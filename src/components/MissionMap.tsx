import { CheckCircle2, Lock, Play, Star } from 'lucide-react';
import type { CurriculumData, LevelId, StudentProgress } from '../types/curriculum';

interface MissionMapProps {
  curriculum: CurriculumData;
  progress: StudentProgress;
  teacherMode: boolean;
  onSelectLevel: (levelId: LevelId) => void;
  onOpenDocumentAI: () => void;
}

export function MissionMap({
  curriculum,
  progress,
  teacherMode,
  onSelectLevel,
  onOpenDocumentAI,
}: MissionMapProps) {
  const levelsMeta: Array<{
    id: LevelId;
    title: string;
    subtitle: string;
    taskCount: number;
    skillFocus: string;
  }> = [
    {
      id: 1,
      title: curriculum.level1.title,
      subtitle: curriculum.level1.subtitle,
      taskCount: curriculum.level1.tasks.length,
      skillFocus: 'Shift, Huruf Besar & Simbol',
    },
    {
      id: 2,
      title: curriculum.level2.title,
      subtitle: curriculum.level2.subtitle,
      taskCount: curriculum.level2.tasks.length,
      skillFocus: 'Klik 2x, 3x, Geser & Shift+Klik',
    },
    {
      id: 3,
      title: curriculum.level3.title,
      subtitle: curriculum.level3.subtitle,
      taskCount: curriculum.level3.tasks.length,
      skillFocus: 'Salin, Potong, Tempel & Urungkan',
    },
    {
      id: 4,
      title: curriculum.level4.title,
      subtitle: curriculum.level4.subtitle,
      taskCount: curriculum.level4.tasks.length,
      skillFocus: 'Kartu Data & Ketik Bersimbol',
    },
  ];

  const completedCount = ([1, 2, 3, 4] as LevelId[]).filter((id) => progress.levels[id].completed).length;
  const totalStars = ([1, 2, 3, 4] as LevelId[]).reduce((acc, id) => acc + progress.levels[id].bestStars, 0);

  return (
    <section className="space-y-8">
      {/* Hero Summary Row */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 iso-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Modul Aktif: {curriculum.name}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{completedCount}/4 Level Selesai</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{totalStars}/12 Bintang Terkumpul</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-balance">
              Jalur Latihan Keterampilan Laptop
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {curriculum.description} Latihan berlangsung santai tanpa nyawa dan tanpa batas waktu agar siswa fokus membangun kebiasaan jari.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenDocumentAI}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 iso-btn-secondary whitespace-nowrap shrink-0 cursor-pointer"
            >
              Olah Dokumen AI
            </button>
            <button
              type="button"
              onClick={() => onSelectLevel(progress.unlockedUpTo)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold iso-btn-primary whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Lanjutkan Level {progress.unlockedUpTo}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Node Isometric Mission Path */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {levelsMeta.map((lvl) => {
          const lvlProgress = progress.levels[lvl.id];
          const isUnlocked = teacherMode || lvl.id <= progress.unlockedUpTo;
          const isCompleted = lvlProgress.completed;

          return (
            <div
              key={lvl.id}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-transform duration-150 ${
                isUnlocked
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 iso-card hover:-translate-y-0.5'
                  : 'border-slate-200/80 dark:border-slate-800/70 bg-slate-100/80 dark:bg-slate-900/50 opacity-85'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold font-mono-code ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-[0_3px_0_0_#047857]'
                        : isUnlocked
                          ? 'bg-blue-600 text-white shadow-[0_3px_0_0_#1d4ed8]'
                          : 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {lvl.id}
                  </div>

                  {/* Star Rating Display */}
                  <div className="flex items-center gap-1" aria-label={`Perolehan ${lvlProgress.bestStars} dari 3 bintang`}>
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx <= lvlProgress.bestStars
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>Level {lvl.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{lvl.taskCount} Latihan</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {lvl.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lvl.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Tuntas</span>
                    </span>
                  ) : isUnlocked ? (
                    lvl.skillFocus
                  ) : (
                    'Selesaikan level sebelumnya'
                  )}
                </span>

                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 ${
                    isUnlocked
                      ? 'bg-blue-600 hover:bg-blue-700 text-white iso-btn-primary cursor-pointer'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Latih Lagi' : 'Mulai'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Terkunci</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
