import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, ClipboardCheck, HelpCircle, Keyboard } from 'lucide-react';
import type { Level4Task, OSMode } from '../../types/curriculum';
import {
  calculateExerciseStars,
  formatShortcutLabel,
  getKeyInstructionForChar,
  normalizeText,
} from '../../utils/keyboardHelper';
import { IsometricKeyboard3D } from '../IsometricKeyboard3D';

interface Level4CombinationProps {
  title: string;
  tasks: Level4Task[];
  osMode: OSMode;
  onComplete: (exerciseStars: number[], totalErrors: number) => void;
  onBack: () => void;
}

export function Level4Combination({
  title,
  tasks,
  osMode,
  onComplete,
  onBack,
}: Level4CombinationProps) {
  const [taskIdx, setTaskIdx] = useState(0);
  const [pasteVal, setPasteVal] = useState('');
  const [pasteDone, setPasteDone] = useState(false);
  const [typedVal, setTypedVal] = useState('');
  const [typeDone, setTypeDone] = useState(false);
  const [taskErrors, setTaskErrors] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [exerciseStars, setExerciseStars] = useState<number[]>([]);
  const [showPostErrorHint, setShowPostErrorHint] = useState(false);
  const [shakeCol1, setShakeCol1] = useState(false);
  const [shakeCol2, setShakeCol2] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [justCompletedTask, setJustCompletedTask] = useState(false);

  const col1Ref = useRef<HTMLInputElement>(null);
  const col2Ref = useRef<HTMLInputElement>(null);

  const currentTask = tasks[taskIdx];
  const modLabel = osMode === 'mac' ? 'Cmd' : 'Ctrl';

  useEffect(() => {
    setPasteVal('');
    setPasteDone(false);
    setTypedVal('');
    setTypeDone(false);
    setTaskErrors(0);
    setShowPostErrorHint(false);
    setFeedbackMsg(null);
    setJustCompletedTask(false);
  }, [taskIdx]);

  const checkBothCompleted = (nextPasteDone: boolean, nextTypeDone: boolean, currentTaskErrs: number, currentTotalErrs: number) => {
    if (nextPasteDone && nextTypeDone && !justCompletedTask) {
      setJustCompletedTask(true);
      const earned = calculateExerciseStars(currentTaskErrs);
      const updatedStars = [...exerciseStars, earned];

      window.setTimeout(() => {
        if (taskIdx + 1 < tasks.length) {
          setExerciseStars(updatedStars);
          setTaskIdx(taskIdx + 1);
        } else {
          onComplete(updatedStars, currentTotalErrs);
        }
      }, 650);
    }
  };

  // Column 1: Paste-only handler
  const handleCol1KeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isMod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    if (isMod && ['v', 'a', 'c', 'x', 'z'].includes(key)) {
      return;
    }
    if (['Tab', 'ArrowLeft', 'ArrowRight', 'Shift', 'Control', 'Meta'].includes(e.key)) {
      return;
    }

    e.preventDefault();
    setTaskErrors((prev) => prev + 1);
    setTotalErrors((prev) => prev + 1);
    setShakeCol1(true);
    setFeedbackMsg(`Kolom 1 hanya menerima tempelan (${modLabel}+V) dari kartu data. Mengetik manual diblokir.`);
    window.setTimeout(() => setShakeCol1(false), 260);
  };

  const handleCol1Paste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!currentTask || pasteDone) return;

    const pasted = e.clipboardData.getData('text/plain');
    setPasteVal(pasted);

    if (normalizeText(pasted) === normalizeText(currentTask.expectedPasteValue)) {
      setPasteDone(true);
      setFeedbackMsg('Kolom 1 tepat! Lanjutkan mengisi Kolom 2 dengan mengetik.');
      window.setTimeout(() => col2Ref.current?.focus(), 80);
      checkBothCompleted(true, typeDone, taskErrors, totalErrors);
    } else {
      const nextTaskErrs = taskErrors + 1;
      const nextTotalErrs = totalErrors + 1;
      setTaskErrors(nextTaskErrs);
      setTotalErrors(nextTotalErrs);
      setShakeCol1(true);
      setFeedbackMsg(
        'Data yang ditempel belum tepat. Perhatikan baris pengecoh pada kartu dan blok bagian yang diminta saja.'
      );
      window.setTimeout(() => setShakeCol1(false), 260);
    }
  };

  // Column 2: Type-only handler
  const handleCol2Paste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTaskErrors((prev) => prev + 1);
    setTotalErrors((prev) => prev + 1);
    setShowPostErrorHint(true);
    setShakeCol2(true);
    setFeedbackMsg('Kolom 2 khusus latihan mengetik! Penempelan diblokir.');
    window.setTimeout(() => setShakeCol2(false), 260);
  };

  const handleCol2KeyMonitor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleCol2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentTask || typeDone || justCompletedTask) return;
    const rawValue = e.target.value;

    if (rawValue.length <= typedVal.length) return;

    const addedChar = rawValue.slice(typedVal.length);
    const expectedChar = currentTask.expectedTypeValue[typedVal.length];

    if (addedChar === expectedChar) {
      const nextTyped = typedVal + addedChar;
      setTypedVal(nextTyped);
      setFeedbackMsg(null);

      if (nextTyped === currentTask.expectedTypeValue) {
        setTypeDone(true);
        checkBothCompleted(pasteDone, true, taskErrors, totalErrors);
      }
    } else {
      const nextTaskErrs = taskErrors + 1;
      const nextTotalErrs = totalErrors + 1;
      setTaskErrors(nextTaskErrs);
      setTotalErrors(nextTotalErrs);
      setShowPostErrorHint(true);
      setShakeCol2(true);
      setFeedbackMsg(
        `Karakter "${addedChar === ' ' ? 'Spasi' : addedChar}" salah — petunjuk tombol sekarang ditampilkan.`
      );
      window.setTimeout(() => setShakeCol2(false), 260);
    }
  };

  if (!currentTask) return null;

  const nextChar = currentTask.expectedTypeValue[typedVal.length] ?? '';
  const keyInstruction = getKeyInstructionForChar(nextChar);

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
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
            Level 4 · {title}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code tabular-nums">
            Latihan {taskIdx + 1} / {tasks.length}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code tabular-nums">Kesalahan: {totalErrors}</span>
        </div>
      </div>

      {capsLockOn && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 px-4 py-3 text-sm text-amber-900 dark:text-amber-200"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Caps Lock sedang aktif!</strong> Matikan agar huruf kecil pada Kolom 2 tidak tertukar.
          </span>
        </div>
      )}

      {/* Two-Column Card + Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Selectable Data Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 iso-card space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {currentTask.title}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {currentTask.cardTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih dan salin ({modLabel}+C) hanya nilai baris yang diminta; abaikan baris pengecoh.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
            {currentTask.cardRows.map((row, idx) => (
              <div key={idx} className="p-4 space-y-1">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
                  {row.label}
                </div>
                <div className="select-text font-mono-code text-base font-semibold text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white break-words">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Column 1 (Paste Only) + Column 2 (Type Only) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 iso-card space-y-6">
          {/* Column 1 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="col1-paste" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                1. Kolom Tempel ({modLabel}+V)
              </label>
              {pasteDone && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Cocok</span>
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{currentTask.pasteInstruction}</p>
            <input
              id="col1-paste"
              ref={col1Ref}
              type="text"
              value={pasteVal}
              onChange={() => {}}
              onKeyDown={handleCol1KeyDown}
              onPaste={handleCol1Paste}
              readOnly={pasteDone}
              placeholder={`Salin dari kartu lalu tekan ${modLabel}+V di sini...`}
              className={`w-full rounded-xl border px-4 py-3 font-mono-code text-base outline-none transition-colors ${
                pasteDone
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                  : shakeCol1
                    ? 'animate-gentle-shake border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-slate-900 dark:text-slate-100'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
              }`}
            />
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Column 2 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="col2-type" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                2. Kolom Ketik Bersimbol (Tempel Diblokir)
              </label>
              {typeDone && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai</span>
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{currentTask.typeInstruction}</p>

            {/* Target Preview */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-4 py-3.5">
              <div className="flex flex-wrap items-center gap-0.5 font-mono-code text-xl font-semibold select-none">
                {currentTask.expectedTypeValue.split('').map((ch, idx) => {
                  const isDone = idx < typedVal.length;
                  const isCurrent = idx === typedVal.length;
                  return (
                    <span
                      key={idx}
                      className={`inline-flex min-w-[0.6em] justify-center rounded px-0.5 ${
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

            <input
              id="col2-type"
              ref={col2Ref}
              type="text"
              value={typedVal}
              onChange={handleCol2Change}
              onKeyDown={handleCol2KeyMonitor}
              onKeyUp={handleCol2KeyMonitor}
              onPaste={handleCol2Paste}
              readOnly={typeDone}
              autoComplete="off"
              spellCheck={false}
              placeholder="Ketik teks bersimbol persis seperti di atas..."
              className={`w-full rounded-xl border px-4 py-3 font-mono-code text-base outline-none transition-colors ${
                typeDone
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                  : shakeCol2
                    ? 'animate-gentle-shake border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-slate-900 dark:text-slate-100'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
              }`}
            />

            {/* Post-error hint (only appears after student makes an error, as specified in PDF) */}
            {showPostErrorHint && !typeDone && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
                <HelpCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Petunjuk: </span>
                    <span>{keyInstruction ? keyInstruction.hintText : currentTask.typeHint}</span>
                  </div>
                  <div className="text-xs text-amber-800 dark:text-amber-300">{currentTask.typeHint}</div>
                </div>
              </div>
            )}

            {justCompletedTask ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Kombinasi tepat! Menuju latihan berikutnya...</span>
              </div>
            ) : (
              feedbackMsg && <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{feedbackMsg}</p>
            )}
          </div>
        </div>
      </div>

      {/* 3D Isometric Keyboard (highlights next key once hint is triggered after mistake) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Keyboard className="w-4 h-4" />
          <span>
            {showPostErrorHint
              ? 'Papan Ketik 3D menyorot tombol bantuan karena terjadi kesalahan'
              : 'Papan Ketik 3D (petunjuk sorotan muncul otomatis bila terjadi kesalahan)'}
          </span>
        </div>
        <IsometricKeyboard3D
          highlightKeyId={keyInstruction?.keyId}
          highlightShift={keyInstruction?.requiresShift}
          osMode={osMode}
          capsLockOn={capsLockOn}
          showHint={showPostErrorHint && !typeDone}
          caption={showPostErrorHint && keyInstruction ? keyInstruction.hintText : 'Ketik mandiri tanpa bantuan sorotan'}
        />
      </div>
    </div>
  );
}
