import { useEffect, useState } from 'react';
import { Monitor, Moon, RotateCcw, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import { DocumentProcessorStudio } from './components/DocumentProcessorStudio';
import { GuideSection } from './components/GuideSection';
import { LevelResultModal } from './components/LevelResultModal';
import { MissionMap } from './components/MissionMap';
import { TeacherBankEditor } from './components/TeacherBankEditor';
import { Level1Typing } from './components/levels/Level1Typing';
import { Level2Selection } from './components/levels/Level2Selection';
import { Level3Clipboard } from './components/levels/Level3Clipboard';
import { Level4Combination } from './components/levels/Level4Combination';
import { DEFAULT_CURRICULUM, INITIAL_PROGRESS } from './data/defaultCurriculum';
import type {
  AppSettings,
  CurriculumData,
  LevelId,
  StudentProgress,
} from './types/curriculum';
import { calculateLevelStars } from './utils/keyboardHelper';

type ActiveView = 'map' | 'level' | 'result' | 'ai-studio' | 'bank' | 'guide';

const STORAGE_KEYS = {
  curriculum: 'latihan-laptop:curriculum:v1',
  progress: 'latihan-laptop:progress:v1',
  settings: 'latihan-laptop:settings:v1',
};

function detectDefaultOS(): 'windows' | 'mac' {
  if (typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/i.test(navigator.platform)) {
    return 'mac';
  }
  return 'windows';
}

export default function App() {
  const [curriculum, setCurriculum] = useState<CurriculumData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.curriculum);
      if (saved) return JSON.parse(saved) as CurriculumData;
    } catch {
      // Fallback to default
    }
    return DEFAULT_CURRICULUM;
  });

  const [progress, setProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.progress);
      if (saved) return JSON.parse(saved) as StudentProgress;
    } catch {
      // Fallback to initial
    }
    return INITIAL_PROGRESS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.settings);
      if (saved) return JSON.parse(saved) as AppSettings;
    } catch {
      // Fallback
    }
    return {
      theme: 'light',
      reducedMotion: false,
      osMode: detectDefaultOS(),
      teacherMode: false,
    };
  });

  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [activeLevelId, setActiveLevelId] = useState<LevelId>(1);
  const [levelSessionKey, setLevelSessionKey] = useState(0);
  const [lastResult, setLastResult] = useState<{
    levelId: LevelId;
    averageStars: number;
    totalErrors: number;
  } | null>(null);

  // Sync theme and reducedMotion classes on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch {
      // Ignore quota errors
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.curriculum, JSON.stringify(curriculum));
    } catch {
      // Ignore quota errors
    }
  }, [curriculum]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
    } catch {
      // Ignore quota errors
    }
  }, [progress]);

  const handleStartLevel = (levelId: LevelId) => {
    setActiveLevelId(levelId);
    setLevelSessionKey((k) => k + 1);
    setActiveView('level');
  };

  const handleCompleteLevel = (levelId: LevelId, exerciseStars: number[], totalErrors: number) => {
    const avgStars = calculateLevelStars(exerciseStars);

    setProgress((prev) => {
      const prevLevel = prev.levels[levelId];
      const nextUnlocked = Math.min(4, Math.max(prev.unlockedUpTo, levelId + 1)) as LevelId;
      return {
        unlockedUpTo: nextUnlocked,
        levels: {
          ...prev.levels,
          [levelId]: {
            completed: true,
            stars: avgStars,
            bestStars: Math.max(prevLevel.bestStars, avgStars),
            totalErrors,
            exerciseStars,
            lastCompletedAt: new Date().toISOString(),
          },
        },
      };
    });

    setLastResult({
      levelId,
      averageStars: avgStars,
      totalErrors,
    });
    setActiveView('result');
  };

  const handleApplyCurriculum = (nextCurriculum: CurriculumData) => {
    setCurriculum(nextCurriculum);
    setProgress(INITIAL_PROGRESS);
  };

  const handleResetDefaultCurriculum = () => {
    setCurriculum(DEFAULT_CURRICULUM);
    setProgress(INITIAL_PROGRESS);
  };

  const handleResetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    setActiveView('map');
  };

  const getLevelTitle = (id: LevelId) => {
    if (id === 1) return curriculum.level1.title;
    if (id === 2) return curriculum.level2.title;
    if (id === 3) return curriculum.level3.title;
    return curriculum.level4.title;
  };

  const navItems: Array<{ id: ActiveView; label: string }> = [
    { id: 'map', label: 'Peta Level' },
    { id: 'ai-studio', label: 'Olah Dokumen AI' },
    { id: 'bank', label: 'Bank Soal' },
    { id: 'guide', label: 'Panduan' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FB] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Top Bar: 3-Zone Contract */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => setActiveView('map')}
            className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Latihan Laptop
          </button>

          {/* Zone 2: 4 clean single-line text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navItems.map((item) => {
              const isActive =
                activeView === item.id ||
                (item.id === 'map' && (activeView === 'level' || activeView === 'result'));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'border-blue-600 dark:border-blue-400 text-slate-900 dark:text-white font-semibold'
                      : 'border-transparent hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="flex items-center shrink-0">
            {activeView === 'ai-studio' ? (
              <button
                type="button"
                onClick={() => setActiveView('map')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold iso-btn-primary whitespace-nowrap shrink-0 cursor-pointer"
              >
                Buka Peta Level
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveView('ai-studio')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold iso-btn-primary whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Olah PDF AI</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 flex items-center gap-4 overflow-x-auto text-xs font-medium">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`py-1 whitespace-nowrap shrink-0 ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Workspace Control Toolbar (OS Mode, Theme, Reduced Motion, Teacher Mode) */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, osMode: 'windows' }))}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  settings.osMode === 'windows'
                    ? 'bg-slate-900 dark:bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Windows (Ctrl)
              </button>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, osMode: 'mac' }))}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  settings.osMode === 'mac'
                    ? 'bg-slate-900 dark:bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mac (Cmd)
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setSettings((s) => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap cursor-pointer"
            >
              {settings.theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>Mode Gelap</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span>Mode Terang</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion }))}
              aria-pressed={settings.reducedMotion}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap cursor-pointer ${
                settings.reducedMotion
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Kurangi Animasi: {settings.reducedMotion ? 'Aktif' : 'Mati'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, teacherMode: !s.teacherMode }))}
              aria-pressed={settings.teacherMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold whitespace-nowrap cursor-pointer ${
                settings.teacherMode
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mode Guru: {settings.teacherMode ? 'Semua Level Terbuka' : 'Normal'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetProgress}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Kemajuan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-8">
        {activeView === 'map' && (
          <MissionMap
            curriculum={curriculum}
            progress={progress}
            teacherMode={settings.teacherMode}
            onSelectLevel={handleStartLevel}
            onOpenDocumentAI={() => setActiveView('ai-studio')}
          />
        )}

        {activeView === 'level' && activeLevelId === 1 && (
          <Level1Typing
            key={`l1-${levelSessionKey}-${curriculum.id}`}
            title={curriculum.level1.title}
            tasks={curriculum.level1.tasks}
            osMode={settings.osMode}
            onComplete={(stars, errs) => handleCompleteLevel(1, stars, errs)}
            onBack={() => setActiveView('map')}
          />
        )}

        {activeView === 'level' && activeLevelId === 2 && (
          <Level2Selection
            key={`l2-${levelSessionKey}-${curriculum.id}`}
            title={curriculum.level2.title}
            paragraphs={curriculum.level2.paragraphs}
            tasks={curriculum.level2.tasks}
            osMode={settings.osMode}
            onComplete={(stars, errs) => handleCompleteLevel(2, stars, errs)}
            onBack={() => setActiveView('map')}
          />
        )}

        {activeView === 'level' && activeLevelId === 3 && (
          <Level3Clipboard
            key={`l3-${levelSessionKey}-${curriculum.id}`}
            title={curriculum.level3.title}
            tasks={curriculum.level3.tasks}
            osMode={settings.osMode}
            onComplete={(stars, errs) => handleCompleteLevel(3, stars, errs)}
            onBack={() => setActiveView('map')}
          />
        )}

        {activeView === 'level' && activeLevelId === 4 && (
          <Level4Combination
            key={`l4-${levelSessionKey}-${curriculum.id}`}
            title={curriculum.level4.title}
            tasks={curriculum.level4.tasks}
            osMode={settings.osMode}
            onComplete={(stars, errs) => handleCompleteLevel(4, stars, errs)}
            onBack={() => setActiveView('map')}
          />
        )}

        {activeView === 'result' && lastResult && (
          <LevelResultModal
            levelId={lastResult.levelId}
            levelTitle={getLevelTitle(lastResult.levelId)}
            averageStars={lastResult.averageStars}
            totalErrors={lastResult.totalErrors}
            hasNextLevel={lastResult.levelId < 4}
            onNextLevel={() => handleStartLevel((lastResult.levelId + 1) as LevelId)}
            onRetry={() => handleStartLevel(lastResult.levelId)}
            onBackToMap={() => setActiveView('map')}
          />
        )}

        {activeView === 'ai-studio' && (
          <DocumentProcessorStudio
            activeCurriculum={curriculum}
            onApplyCurriculum={handleApplyCurriculum}
            onResetDefault={handleResetDefaultCurriculum}
            onStartTraining={() => setActiveView('map')}
          />
        )}

        {activeView === 'bank' && (
          <TeacherBankEditor
            key={curriculum.id}
            curriculum={curriculum}
            onUpdateCurriculum={(updated) => setCurriculum(updated)}
            onResetDefault={handleResetDefaultCurriculum}
          />
        )}

        {activeView === 'guide' && (
          <GuideSection osMode={settings.osMode} onStartTraining={() => setActiveView('map')} />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
          <span>Latihan Laptop SMP · Kemajuan tersimpan lokal pada peramban ini</span>
          <span>Kurikulum Aktif: {curriculum.name}</span>
        </div>
      </footer>
    </div>
  );
}
