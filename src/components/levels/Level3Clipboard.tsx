import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clipboard, Info, RotateCcw } from 'lucide-react';
import type { Level3Task, OSMode } from '../../types/curriculum';
import { calculateExerciseStars, formatShortcutLabel, normalizeText } from '../../utils/keyboardHelper';
import { IsometricKeyboard3D } from '../IsometricKeyboard3D';

interface Level3ClipboardProps {
  title: string;
  tasks: Level3Task[];
  osMode: OSMode;
  onComplete: (exerciseStars: number[], totalErrors: number) => void;
  onBack: () => void;
}

export function Level3Clipboard({
  title,
  tasks,
  osMode,
  onComplete,
  onBack,
}: Level3ClipboardProps) {
  const [taskIdx, setTaskIdx] = useState(0);
  const [sourceVal, setSourceVal] = useState(tasks[0]?.sourceText ?? '');
  const [targetVal, setTargetVal] = useState('');
  const [targetHistory, setTargetHistory] = useState<string[]>(['']);
  const [pasteCount, setPasteCount] = useState(0);
  const [hasPastedForUndo, setHasPastedForUndo] = useState(false);
  const [taskErrors, setTaskErrors] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [exerciseStars, setExerciseStars] = useState<number[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [justCompletedTask, setJustCompletedTask] = useState(false);
  const [activeShortcut, setActiveShortcut] = useState<'A' | 'C' | 'X' | 'V' | 'Z'>('C');

  const boxARef = useRef<HTMLTextAreaElement>(null);
  const boxBRef = useRef<HTMLTextAreaElement>(null);

  const currentTask = tasks[taskIdx];
  const modLabel = osMode === 'mac' ? 'Cmd' : 'Ctrl';

  useEffect(() => {
    if (!currentTask) return;
    setSourceVal(currentTask.sourceText);
    setTargetVal('');
    setTargetHistory(['']);
    setPasteCount(0);
    setHasPastedForUndo(false);
    setTaskErrors(0);
    setStatusMessage(null);
    setJustCompletedTask(false);
    setActiveShortcut(
      currentTask.actionType === 'cut-paste-word'
        ? 'X'
        : currentTask.actionType === 'select-all-copy-paste'
          ? 'A'
          : 'C'
    );
  }, [taskIdx, currentTask]);

  const completeCurrentTask = () => {
    setJustCompletedTask(true);
    setStatusMessage(null);
    const earned = calculateExerciseStars(taskErrors);
    const updatedStars = [...exerciseStars, earned];

    window.setTimeout(() => {
      if (taskIdx + 1 < tasks.length) {
        setExerciseStars(updatedStars);
        setTaskIdx(taskIdx + 1);
      } else {
        onComplete(updatedStars, totalErrors);
      }
    }, 650);
  };

  const registerError = (msg: string) => {
    setTaskErrors((prev) => prev + 1);
    setTotalErrors((prev) => prev + 1);
    setStatusMessage(msg);
  };

  const handleResetBoxes = () => {
    if (!currentTask || justCompletedTask) return;
    setSourceVal(currentTask.sourceText);
    setTargetVal('');
    setTargetHistory(['']);
    setPasteCount(0);
    setHasPastedForUndo(false);
    setStatusMessage('Kotak A dan Kotak B telah dikembalikan ke kondisi awal latihan.');
  };

  const handleBoxAKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    if (isMod && ['a', 'c', 'x'].includes(key)) {
      if (key === 'a') setActiveShortcut('C');
      if (key === 'c' || key === 'x') setActiveShortcut('V');
      return;
    }

    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Shift', 'Control', 'Meta', 'Tab'].includes(e.key)) {
      return;
    }

    e.preventDefault();
    registerError(`Kotak A hanya untuk menyeleksi, menyalin (${modLabel}+C), atau memotong (${modLabel}+X).`);
  };

  const handleBoxACut = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!currentTask) return;
    const el = boxARef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    if (start === end) return;

    e.preventDefault();
    const selected = sourceVal.slice(start, end);

    if (currentTask.actionType !== 'cut-paste-word') {
      registerError(`Pada latihan ini gunakan Salin (${modLabel}+C), bukan Potong (${modLabel}+X).`);
      return;
    }

    e.clipboardData.setData('text/plain', selected);
    const updatedSource = (sourceVal.slice(0, start) + sourceVal.slice(end)).replace(/\s{2,}/g, ' ').trim();
    setSourceVal(updatedSource);
    setActiveShortcut('V');
    setStatusMessage(`Teks "${selected.trim()}" dipotong! Sekarang tempel (${modLabel}+V) di Kotak B.`);
  };

  const handleBoxACopy = () => {
    setActiveShortcut('V');
    if (currentTask?.actionType === 'cut-paste-word') {
      setStatusMessage(
        `Ingat: latihan ini meminta Potong (${modLabel}+X), bukan Salin (${modLabel}+C), agar kata "${currentTask.targetWord}" terhapus dari Kotak A.`
      );
    } else {
      setStatusMessage(`Teks disalin! Klik Kotak B lalu tekan ${modLabel}+V untuk menempel.`);
    }
  };

  const handleBoxAPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const evaluateTargetState = (nextB: string, nextSource: string, nextPasteCount: number, pastedNow: boolean) => {
    if (!currentTask || justCompletedTask) return;

    const normB = normalizeText(nextB);
    const normExpectedB = normalizeText(currentTask.expectedTargetText);

    switch (currentTask.actionType) {
      case 'copy-paste':
      case 'select-all-copy-paste': {
        if (normB === normExpectedB) {
          completeCurrentTask();
        } else if (normB.length > 0) {
          registerError('Teks di Kotak B belum sama persis dengan target. Periksa kembali bagian yang diblok di Kotak A.');
        }
        break;
      }

      case 'cut-paste-word': {
        const targetWord = currentTask.targetWord ?? 'Apel';
        const wordStillInA = new RegExp(`\\b${targetWord}\\b`).test(nextSource);
        if (normB === normExpectedB) {
          if (wordStillInA) {
            registerError(
              `Kata "${targetWord}" sudah ada di Kotak B, tetapi masih tersisa di Kotak A. Gunakan Potong (${modLabel}+X), lalu klik Reset Kotak.`
            );
          } else {
            completeCurrentTask();
          }
        } else if (normB.length > 0) {
          registerError(`Pastikan kamu memotong dan menempelkan hanya kata "${targetWord}".`);
        }
        break;
      }

      case 'paste-three-times': {
        const compactB = nextB.replace(/\s+/g, '');
        const compactExpected = currentTask.expectedTargetText.replace(/\s+/g, '');
        if (nextPasteCount === 3 && compactB === compactExpected) {
          completeCurrentTask();
        } else if (nextPasteCount > 3) {
          registerError('Terlalu banyak penempelan (lebih dari 3 kali). Klik "Reset Kotak" lalu tempel tepat 3 kali.');
        } else if (pastedNow && nextPasteCount < 3) {
          setStatusMessage(`Sudah ditempel ${nextPasteCount} dari 3 kali. Tekan ${modLabel}+V lagi.`);
        }
        break;
      }

      case 'paste-then-undo': {
        if (pastedNow && nextB.trim().length > 0) {
          setHasPastedForUndo(true);
          setActiveShortcut('Z');
          setStatusMessage(
            `Berhasil ditempel! Sekarang tekan ${modLabel}+Z di dalam Kotak B untuk membatalkan hingga kosong.`
          );
        } else if (hasPastedForUndo && nextB.trim() === '') {
          completeCurrentTask();
        }
        break;
      }
    }
  };

  const handleBoxBKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (justCompletedTask) {
      e.preventDefault();
      return;
    }

    const isMod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Handle explicit Undo stack on Ctrl/Cmd+Z
    if (isMod && key === 'z') {
      e.preventDefault();
      if (targetHistory.length > 1) {
        const nextHistory = targetHistory.slice(0, -1);
        const restored = nextHistory[nextHistory.length - 1] ?? '';
        setTargetHistory(nextHistory);
        setTargetVal(restored);
        const nextCount = Math.max(0, pasteCount - 1);
        setPasteCount(nextCount);
        evaluateTargetState(restored, sourceVal, nextCount, false);
      } else {
        setStatusMessage(`Kotak B sudah kosong. Tempel dulu teks dengan ${modLabel}+V.`);
      }
      return;
    }

    if (isMod && ['v', 'a', 'c'].includes(key)) {
      return;
    }

    // Block Backspace, Delete, Cut, or manual typing in Kotak B
    e.preventDefault();
    registerError(
      `Mengetik dan menghapus manual dinonaktifkan di Kotak B. Gunakan pintasan ${modLabel}+V atau ${modLabel}+Z.`
    );
  };

  const handleBoxBPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (justCompletedTask || !currentTask) return;

    const pastedText = e.clipboardData.getData('text/plain');
    if (!pastedText) return;

    const el = boxBRef.current;
    const start = el?.selectionStart ?? targetVal.length;
    const end = el?.selectionEnd ?? targetVal.length;
    const nextB = targetVal.slice(0, start) + pastedText + targetVal.slice(end);
    const nextPasteCount = pasteCount + 1;

    setTargetVal(nextB);
    setTargetHistory((prev) => [...prev, nextB]);
    setPasteCount(nextPasteCount);

    evaluateTargetState(nextB, sourceVal, nextPasteCount, true);
  };

  if (!currentTask) return null;

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
            Level 3 · {title}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code tabular-nums">
            Latihan {taskIdx + 1} / {tasks.length}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code tabular-nums">Kesalahan: {totalErrors}</span>
        </div>
      </div>

      {/* Main Clipboard Sandbox */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 iso-card space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Clipboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Instruksi Tugas {taskIdx + 1}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
              {currentTask.instruction}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleResetBoxes}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Kotak</span>
          </button>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>{currentTask.hint}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="box-a-source" className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Kotak A (Sumber Teks)
            </label>
            <textarea
              id="box-a-source"
              ref={boxARef}
              rows={5}
              value={sourceVal}
              onChange={() => {}}
              onKeyDown={handleBoxAKeyDown}
              onCut={handleBoxACut}
              onCopy={handleBoxACopy}
              onPaste={handleBoxAPaste}
              spellCheck={false}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 p-4 font-mono-code text-base leading-relaxed text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 selection:bg-blue-600 selection:text-white"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Blok teks di sini lalu gunakan {formatShortcutLabel(osMode, 'C')} atau{' '}
              {formatShortcutLabel(osMode, 'X')}.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="box-b-target" className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Kotak B (Tujuan)
            </label>
            <textarea
              id="box-b-target"
              ref={boxBRef}
              rows={5}
              value={targetVal}
              onChange={() => {}}
              onKeyDown={handleBoxBKeyDown}
              onPaste={handleBoxBPaste}
              spellCheck={false}
              placeholder={`Klik di sini lalu tekan ${formatShortcutLabel(osMode, 'V')}...`}
              className={`w-full rounded-xl border p-4 font-mono-code text-base leading-relaxed outline-none transition-colors ${
                justCompletedTask
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
              }`}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ketik/hapus manual diblokir. Gunakan {formatShortcutLabel(osMode, 'V')} dan{' '}
              {formatShortcutLabel(osMode, 'Z')}.
            </p>
          </div>
        </div>

        {/* Status Message */}
        {justCompletedTask ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Berhasil! Pintasan papan klip dijalankan dengan benar.</span>
          </div>
        ) : (
          statusMessage && (
            <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 px-4 py-3 text-sm text-slate-800 dark:text-slate-200">
              {statusMessage}
            </div>
          )
        )}
      </div>

      <IsometricKeyboard3D
        highlightShortcutKey={activeShortcut}
        osMode={osMode}
        showHint={!justCompletedTask}
        caption={`Pintasan yang disarankan sekarang: ${formatShortcutLabel(osMode, activeShortcut)}`}
      />
    </div>
  );
}
