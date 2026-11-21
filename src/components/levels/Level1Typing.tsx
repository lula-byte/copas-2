import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, HelpCircle, Keyboard } from 'lucide-react';
import type { Level1Task, OSMode } from '../../types/curriculum';
import { calculateExerciseStars, getKeyInstructionForChar } from '../../utils/keyboardHelper';
import { IsometricKeyboard3D } from '../IsometricKeyboard3D';

interface Level1TypingProps {
  title: string;
  tasks: Level1Task[];
  osMode: OSMode;
  onComplete: (exerciseStars: number[], totalErrors: number) => void;
  onBack: () => void;
}

export function Level1Typing({ title, tasks, osMode, onComplete, onBack }: Level1TypingProps) {
  const [taskIdx, setTaskIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [taskErrors, setTaskErrors] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [exerciseStars, setExerciseStars] = useState<number[]>([]);
  const [shake, setShake] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [justCompletedTask, setJustCompletedTask] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentTask = tasks[taskIdx];
  const target = currentTask?.target ?? '';
  const nextChar = target[typed.length] ?? '';
  const keyInstruction = getKeyInstructionForChar(nextChar);

  useEffect(() => {
    inputRef.current?.focus();
  }, [taskIdx]);

  const triggerShake = (message: string) => {
    setShake(true);
    setFeedbackMsg(message);
    window.setTimeout(() => setShake(false), 260);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (justCompletedTask || !currentTask) return;
    const rawValue = e.target.value;

    // Prevent deleting already verified characters or jumping ahead
    if (rawValue.length < typed.length) {
      return;
    }

    if (rawValue.length === typed.length) {
      return;
    }

    // Check appended character(s)
    const addedChar = rawValue.slice(typed.length);
    const expectedChar = target[typed.length];

    if (addedChar === expectedChar) {
      const nextTyped = typed + addedChar;
      setTyped(nextTyped);
      setFeedbackMsg(null);

      if (nextTyped === target) {
        const earned = calculateExerciseStars(taskErrors);
        const updatedStars = [...exerciseStars, earned];
        setJustCompletedTask(true);

        window.setTimeout(() => {
          if (taskIdx + 1 < tasks.length) {
            setExerciseStars(updatedStars);
            setTaskIdx(taskIdx + 1);
            setTyped('');
            setTaskErrors(0);
            setFeedbackMsg(null);
            setJustCompletedTask(false);
          } else {
            onComplete(updatedStars, totalErrors);
          }
        }, 550);
      }
    } else {
      // Wrong character: auto-delete (keep `typed` unchanged), shake, increment errors
      setTaskErrors((prev) => prev + 1);
      setTotalErrors((prev) => prev + 1);
      const charPreview = addedChar === ' ' ? 'Spasi' : `"${addedChar}"`;
      const expectedPreview = expectedChar === ' ' ? 'Spasi' : `"${expectedChar}"`;
      triggerShake(`Karakter ${charPreview} kurang tepat — seharusnya ${expectedPreview}.`);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTaskErrors((prev) => prev + 1);
    setTotalErrors((prev) => prev + 1);
    triggerShake('Fungsi tempel (Paste) dinonaktifkan pada Level 1. Silakan ketik langsung.');
  };

  if (!currentTask) return null;

  return (
    <div className="space-y-6">
      {/* Top Level Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 iso-btn-secondary whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Peta</span>
        </button>

        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Level 1 · {title}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code tabular-nums">
            Soal {taskIdx + 1} / {tasks.length}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code tabular-nums">Kesalahan: {totalErrors}</span>
        </div>
      </div>

      {/* Caps Lock Warning */}
      {capsLockOn && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 px-4 py-3 text-sm text-amber-900 dark:text-amber-200"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Peringatan Caps Lock aktif!</strong> Matikan tombol Caps Lock terlebih dahulu agar huruf kecil tidak berubah menjadi huruf besar.
          </span>
        </div>
      )}

      {/* Main Typing Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 iso-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {currentTask.label}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Ketik persis sesuai huruf besar, kecil, angka, dan simbol
          </span>
        </div>

        {/* Target Text Character Display */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="cursor-text rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-5 py-6 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-0.5 font-mono-code text-2xl sm:text-3xl font-semibold tracking-wide select-none">
            {target.split('').map((ch, idx) => {
              const isDone = idx < typed.length;
              const isCurrent = idx === typed.length;
              return (
                <span
                  key={idx}
                  className={`inline-flex min-w-[0.65em] justify-center rounded px-0.5 py-0.5 transition-colors ${
                    isDone
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                      : isCurrent
                        ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 ring-2 ring-blue-500/70'
                        : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              );
            })}
          </div>
        </div>

        {/* Input Box */}
        <div className="space-y-2">
          <label htmlFor="level1-typing-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Kolom Ketik (tempel diblokir)
          </label>
          <input
            id="level1-typing-input"
            ref={inputRef}
            type="text"
            value={typed}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onPaste={handlePaste}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Mulai mengetik di sini..."
            className={`w-full rounded-xl border px-4 py-3.5 font-mono-code text-lg outline-none transition-colors ${
              justCompletedTask
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200'
                : shake
                  ? 'animate-gentle-shake border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-slate-900 dark:text-slate-100'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
            }`}
          />

          <div className="min-h-[24px] flex items-center justify-between gap-4 text-sm">
            {justCompletedTask ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tepat sekali! Lanjut ke latihan berikutnya...</span>
              </span>
            ) : feedbackMsg ? (
              <span className="text-rose-600 dark:text-rose-400 font-medium">{feedbackMsg}</span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">
                Karakter benar otomatis berwarna hijau.
              </span>
            )}
          </div>
        </div>

        {/* Always-Visible Next Key Hint on Level 1 */}
        {keyInstruction && !justCompletedTask && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 dark:border-blue-900/70 bg-blue-50/70 dark:bg-blue-950/40 px-4 py-3 text-sm text-blue-950 dark:text-blue-100">
            <HelpCircle className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <span className="font-semibold">Petunjuk Tombol Berikutnya: </span>
              <span>{keyInstruction.hintText}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3D Interactive Isometric Keyboard */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Keyboard className="w-4 h-4" />
          <span>Papan Ketik 3D Interaktif — tombol kuning menandakan Shift, tombol biru menandakan karakter target</span>
        </div>
        <IsometricKeyboard3D
          highlightKeyId={keyInstruction?.keyId}
          highlightShift={keyInstruction?.requiresShift}
          osMode={osMode}
          capsLockOn={capsLockOn}
          showHint={!justCompletedTask}
          caption={keyInstruction ? keyInstruction.hintText : 'Selesai!'}
        />
      </div>
    </div>
  );
}
