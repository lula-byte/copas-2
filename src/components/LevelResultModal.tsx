import { ArrowRight, Home, RotateCcw, Star } from 'lucide-react';
import type { LevelId } from '../types/curriculum';

interface LevelResultModalProps {
  levelId: LevelId;
  levelTitle: string;
  averageStars: number;
  totalErrors: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRetry: () => void;
  onBackToMap: () => void;
}

export function LevelResultModal({
  levelId,
  levelTitle,
  averageStars,
  totalErrors,
  hasNextLevel,
  onNextLevel,
  onRetry,
  onBackToMap,
}: LevelResultModalProps) {
  const encouragement =
    averageStars === 3
      ? 'Luar biasa! Ketelitian dan penguasaan tombol kamu sangat rapi.'
      : averageStars === 2
        ? 'Bagus sekali! Kamu sudah mulai terbiasa. Sedikit latihan lagi pasti sempurna.'
        : 'Hebat sudah menyelesaikan seluruh latihan! Terus ulangi agar jari makin terbiasa.';

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center iso-card space-y-6">
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Hasil Level {levelId} · {levelTitle}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
          Level {levelId} Selesai
        </h2>
      </div>

      <div className="flex items-center justify-center gap-3 py-2" aria-label={`Nilai ${averageStars} dari 3 bintang`}>
        {[1, 2, 3].map((starIdx) => (
          <div
            key={starIdx}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform ${
              starIdx <= averageStars
                ? 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 shadow-[0_4px_0_0_#f59e0b]'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'
            }`}
          >
            <Star
              className={`w-7 h-7 ${
                starIdx <= averageStars
                  ? 'fill-amber-400 text-amber-500'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          </div>
        ))}
      </div>

      <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">{encouragement}</p>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Rata-rata Bintang</div>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
            {averageStars} / 3
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Kesalahan</div>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
            {totalErrors}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBackToMap}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 iso-btn-secondary whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Menu</span>
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 iso-btn-secondary whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ulangi</span>
        </button>
        {hasNextLevel && (
          <button
            type="button"
            onClick={onNextLevel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold iso-btn-primary whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Level Berikutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
