import { useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Info, MousePointerClick } from 'lucide-react';
import type { Level2Task, OSMode } from '../../types/curriculum';
import { calculateExerciseStars, normalizeText } from '../../utils/keyboardHelper';
import { IsometricKeyboard3D } from '../IsometricKeyboard3D';

interface Level2SelectionProps {
  title: string;
  paragraphs: string[];
  tasks: Level2Task[];
  osMode: OSMode;
  onComplete: (exerciseStars: number[], totalErrors: number) => void;
  onBack: () => void;
}

export function Level2Selection({
  title,
  paragraphs,
  tasks,
  osMode,
  onComplete,
  onBack,
}: Level2SelectionProps) {
  const [taskIdx, setTaskIdx] = useState(0);
  const [taskErrors, setTaskErrors] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [exerciseStars, setExerciseStars] = useState<number[]>([]);
  const [lastSelectedPreview, setLastSelectedPreview] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [usedShiftClick, setUsedShiftClick] = useState(false);
  const [justCompletedTask, setJustCompletedTask] = useState(false);
  const docContainerRef = useRef<HTMLDivElement>(null);

  const currentTask = tasks[taskIdx];

  const evaluateSelection = (shiftUsedNow: boolean) => {
    if (!currentTask || justCompletedTask) return;
    const selection = window.getSelection();
    if (!selection) return;

    const selectedRaw = selection.toString();
    const normalizedSelected = normalizeText(selectedRaw);

    if (!normalizedSelected) {
      return;
    }

    // Ensure selection is actually inside our document container
    if (docContainerRef.current && selection.anchorNode) {
      if (!docContainerRef.current.contains(selection.anchorNode)) {
        return;
      }
    }

    const normalizedTarget = normalizeText(currentTask.targetText);
    const matchesText = normalizedSelected === normalizedTarget;

    if (matchesText) {
      if (currentTask.method === 'shift-click' && !(shiftUsedNow || usedShiftClick)) {
        setLastSelectedPreview(normalizedSelected);
        setTaskErrors((prev) => prev + 1);
        setTotalErrors((prev) => prev + 1);
        setStatusMessage(
          'Teks yang diblok sudah benar, tetapi pada tugas ini wajib memakai cara klik di awal frasa lalu tahan Shift + Klik di akhir frasa.'
        );
        return;
      }

      setLastSelectedPreview(normalizedSelected);
      setStatusMessage(null);
      setJustCompletedTask(true);
      const earned = calculateExerciseStars(taskErrors);
      const updatedStars = [...exerciseStars, earned];

      window.setTimeout(() => {
        window.getSelection()?.removeAllRanges();
        if (taskIdx + 1 < tasks.length) {
          setExerciseStars(updatedStars);
          setTaskIdx(taskIdx + 1);
          setTaskErrors(0);
          setLastSelectedPreview('');
          setStatusMessage(null);
          setUsedShiftClick(false);
          setJustCompletedTask(false);
        } else {
          onComplete(updatedStars, totalErrors);
        }
      }, 650);
    } else {
      setLastSelectedPreview(normalizedSelected);
      // Only penalize as an error when the student releases mouse or runs Ctrl+A and has a non-trivial wrong selection
      setTaskErrors((prev) => prev + 1);
      setTotalErrors((prev) => prev + 1);
      setStatusMessage('Teks yang diblok belum sesuai dengan target. Silakan periksa pratinjau di bawah lalu coba lagi.');
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const isShift = e.shiftKey;
    if (isShift) {
      setUsedShiftClick(true);
    }
    // Slight timeout so browser finishes triple-click/double-click selection update
    window.setTimeout(() => {
      evaluateSelection(isShift);
    }, 30);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      window.setTimeout(() => {
        evaluateSelection(e.shiftKey);
      }, 30);
    } else if (e.shiftKey) {
      setUsedShiftClick(true);
      window.setTimeout(() => {
        evaluateSelection(true);
      }, 30);
    }
  };

  if (!currentTask) return null;

  const shortcutHint = currentTask.method === 'select-all' ? 'A' : null;
  const shiftHint = currentTask.method === 'shift-click';

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
            Level 2 · {title}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code tabular-nums">
            Tugas {taskIdx + 1} / {tasks.length}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-code tabular-nums">Kesalahan: {totalErrors}</span>
        </div>
      </div>

      {/* Task Prompt */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 iso-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <MousePointerClick className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Instruksi Tugas {taskIdx + 1}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
              {currentTask.instruction}
            </h2>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>{currentTask.hint}</span>
        </div>

        {/* Selectable Real HTML Document */}
        <div
          ref={docContainerRef}
          tabIndex={0}
          onMouseUp={handleMouseUp}
          onKeyUp={handleKeyUp}
          aria-label="Dokumen contoh untuk diseleksi"
          className="select-text rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/60 p-6 sm:p-7 space-y-4 text-lg leading-relaxed text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/30 selection:bg-blue-600 selection:text-white"
        >
          {paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Feedback & Selected Text Preview */}
        <div className="space-y-3">
          {justCompletedTask ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Seleksi tepat! Melanjutkan ke tugas berikutnya...</span>
            </div>
          ) : (
            statusMessage && (
              <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
                {statusMessage}
              </div>
            )
          )}

          {lastSelectedPreview && !justCompletedTask && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-1">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Teks yang kamu blok barusan:
              </div>
              <div className="font-mono-code text-sm text-slate-800 dark:text-slate-200 break-words">
                &ldquo;{lastSelectedPreview}&rdquo;
              </div>
            </div>
          )}
        </div>
      </div>

      {(shiftHint || shortcutHint) && (
        <IsometricKeyboard3D
          highlightShift={shiftHint}
          highlightShortcutKey={shortcutHint}
          osMode={osMode}
          caption={
            shortcutHint
              ? `Tekan ${osMode === 'mac' ? 'Cmd' : 'Ctrl'} + A setelah mengklik area dokumen`
              : 'Tahan Shift lalu klik akhir frasa setelah meletakkan kursor di awal frasa'
          }
        />
      )}
    </div>
  );
}
