import { useState } from 'react';
import { CheckCircle2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import type { CurriculumData, Level1Task } from '../types/curriculum';

interface TeacherBankEditorProps {
  curriculum: CurriculumData;
  onUpdateCurriculum: (next: CurriculumData) => void;
  onResetDefault: () => void;
}

export function TeacherBankEditor({
  curriculum,
  onUpdateCurriculum,
  onResetDefault,
}: TeacherBankEditorProps) {
  const [l1Tasks, setL1Tasks] = useState<Level1Task[]>(curriculum.level1.tasks);
  const [paragraphs, setParagraphs] = useState<string[]>(curriculum.level2.paragraphs);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    const cleanedL1 = l1Tasks.filter((t) => t.target.trim().length > 0);
    const updated: CurriculumData = {
      ...curriculum,
      isDefault: false,
      level1: {
        ...curriculum.level1,
        tasks: cleanedL1.length > 0 ? cleanedL1 : curriculum.level1.tasks,
      },
      level2: {
        ...curriculum.level2,
        paragraphs: paragraphs.map((p) => p.trim()).filter(Boolean),
      },
    };
    onUpdateCurriculum(updated);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2400);
  };

  const addLevel1Task = () => {
    setL1Tasks((prev) => [
      ...prev,
      {
        id: `l1-custom-${Date.now()}`,
        target: 'Info#2026!',
        label: `Latihan ${prev.length + 1} · Tambahan Guru`,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 iso-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Bank Soal Terstruktur · Dapat Disesuaikan Guru
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Editor Daftar Soal ({curriculum.name})
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Daftar soal dipisahkan sebagai data agar guru mudah mengganti teks latihan tanpa menyentuh kode aplikasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onResetDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 iso-btn-secondary cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Bawaan</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold iso-btn-primary cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Perubahan bank soal tersimpan di peramban ini dan siap dipakai siswa.</span>
          </div>
        )}

        {/* Level 1 Tasks Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Level 1 · Teks Target Mengetik dengan Shift ({l1Tasks.length} soal)
            </h3>
            <button
              type="button"
              onClick={addLevel1Task}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Soal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {l1Tasks.map((task, idx) => (
              <div
                key={task.id}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-3"
              >
                <span className="text-xs font-mono-code text-slate-500 dark:text-slate-400 w-6 shrink-0">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={task.target}
                  aria-label={`Teks target soal ${idx + 1}`}
                  onChange={(e) => {
                    const val = e.target.value;
                    setL1Tasks((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, target: val } : item))
                    );
                  }}
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 font-mono-code text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  disabled={l1Tasks.length <= 1}
                  aria-label={`Hapus soal ${idx + 1}`}
                  onClick={() => setL1Tasks((prev) => prev.filter((_, i) => i !== idx))}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Level 2 Document Paragraphs Preview / Edit */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Level 2 · Paragraf Dokumen Contoh ({paragraphs.length} paragraf)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Catatan: jika Anda mengubah teks paragraf secara manual, pastikan potongan target pada tugas Level 2 tetap ada di dalam paragraf. Untuk membuat dokumen baru beserta tugasnya secara otomatis, gunakan tab Olah Dokumen AI.
          </p>
          <div className="space-y-3">
            {paragraphs.map((para, idx) => (
              <textarea
                key={idx}
                rows={2}
                value={para}
                aria-label={`Paragraf ${idx + 1}`}
                onChange={(e) => {
                  const val = e.target.value;
                  setParagraphs((prev) => prev.map((p, i) => (i === idx ? val : p)));
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/50 p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600"
              />
            ))}
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Level 3 & 4 Summary Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Level 3 · Daftar Tugas Salin-Potong-Tempel ({curriculum.level3.tasks.length})
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {curriculum.level3.tasks.map((t, i) => (
                <li key={t.id} className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2">
                  <span className="font-mono-code text-xs text-slate-400 mr-2">{i + 1}.</span>
                  {t.instruction}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Level 4 · Daftar Skenario Kombinasi ({curriculum.level4.tasks.length})
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {curriculum.level4.tasks.map((t, i) => (
                <li key={t.id} className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2">
                  <span className="font-mono-code text-xs text-slate-400 mr-2">{i + 1}.</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{t.title}</span>
                  {' — '}
                  <span className="font-mono-code text-xs">{t.expectedTypeValue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
