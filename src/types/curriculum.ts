export type OSMode = 'windows' | 'mac';
export type ThemeMode = 'light' | 'dark';
export type LevelId = 1 | 2 | 3 | 4;

export interface Level1Task {
  id: string;
  target: string;
  label: string;
  hint?: string;
}

export type SelectionMethod =
  | 'double-click'
  | 'drag-sentence'
  | 'triple-click'
  | 'shift-click'
  | 'drag-two-sentences'
  | 'select-all';

export interface Level2Task {
  id: string;
  instruction: string;
  targetText: string;
  method: SelectionMethod;
  hint: string;
}

export type ClipboardActionType =
  | 'copy-paste'
  | 'cut-paste-word'
  | 'paste-three-times'
  | 'paste-then-undo'
  | 'select-all-copy-paste';

export interface Level3Task {
  id: string;
  instruction: string;
  sourceText: string;
  actionType: ClipboardActionType;
  targetWord?: string;
  expectedTargetText: string;
  expectedSourceAfter?: string;
  hint: string;
}

export interface DataCardRow {
  label: string;
  value: string;
  isDistractor?: boolean;
}

export interface Level4Task {
  id: string;
  title: string;
  cardTitle: string;
  cardRows: DataCardRow[];
  pasteInstruction: string;
  expectedPasteValue: string;
  typeInstruction: string;
  expectedTypeValue: string;
  typeHint: string;
}

export interface DocumentConceptEvolution {
  version: string;
  name: string;
  mainFeatures: string;
  reasonForChange: string;
}

export interface DocumentImprovementNote {
  item: string;
  detail: string;
}

export interface DocumentAnalysisSummary {
  title: string;
  subtitle: string;
  sourceFileName: string;
  processedAt: string;
  targetAudience: string;
  coreObjective: string;
  skillsCovered: string[];
  validationRules: string[];
  evolutionHistory: DocumentConceptEvolution[];
  improvementNotes: DocumentImprovementNote[];
  aiNotes: string;
}

export interface CurriculumData {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  summary: DocumentAnalysisSummary;
  level1: {
    title: string;
    subtitle: string;
    tasks: Level1Task[];
  };
  level2: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    tasks: Level2Task[];
  };
  level3: {
    title: string;
    subtitle: string;
    tasks: Level3Task[];
  };
  level4: {
    title: string;
    subtitle: string;
    tasks: Level4Task[];
  };
}

export interface LevelProgress {
  completed: boolean;
  stars: number; // 1 to 3
  bestStars: number;
  totalErrors: number;
  exerciseStars: number[];
  lastCompletedAt?: string;
}

export interface StudentProgress {
  levels: Record<LevelId, LevelProgress>;
  unlockedUpTo: LevelId;
}

export interface AppSettings {
  theme: ThemeMode;
  reducedMotion: boolean;
  osMode: OSMode;
  teacherMode: boolean;
}
