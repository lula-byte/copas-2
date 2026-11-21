import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileText,
  Layers,
  Loader2,
  RotateCcw,
  Sparkles,
  Upload,
} from 'lucide-react';
import type { CurriculumData } from '../types/curriculum';

interface DocumentProcessorStudioProps {
  activeCurriculum: CurriculumData;
  onApplyCurriculum: (curriculum: CurriculumData) => void;
  onResetDefault: () => void;
  onStartTraining: () => void;
}

export function DocumentProcessorStudio({
  activeCurriculum,
  onApplyCurriculum,
  onResetDefault,
  onStartTraining,
}: DocumentProcessorStudioProps) {
  const [sampleInfo, setSampleInfo] = useState<{
    available: boolean;
    fileName?: string;
    sizeBytes?: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [topicInput, setTopicInput] = useState('');
  const [gradeInput, setGradeInput] = useState('Siswa SMP Kelas 7-9');
  const [dragActive, setDragActive] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  useEffect(() => {
    fetch('/api/sample-pdf-info')
      .then((r) => r.json())
      .then((data) => setSampleInfo(data))
      .catch(() => setSampleInfo({ available: false }));
  }, []);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const commaIndex = result.indexOf(',');
        resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
      };
      reader.onerror = () => reject(new Error('Gagal membaca berkas dari perangkat.'));
      reader.readAsDataURL(file);
    });

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);
    setProcessingLabel(`Mengolah "${file.name}" dengan AI...`);

    try {
      const isText =
        file.type.startsWith('text/') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.csv');

      let bodyPayload: Record<string, unknown>;
      if (isText) {
        const textContent = await file.text();
        bodyPayload = {
          fileName: file.name,
          mimeType: file.type || 'text/plain',
          textContent,
        };
      } else {
        const base64Data = await fileToBase64(file);
        bodyPayload = {
          fileName: file.name,
          mimeType: file.type || 'application/pdf',
          base64Data,
        };
      }

      const res = await fetch('/api/process-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengolah dokumen.');
      }

      onApplyCurriculum(data.curriculum);
      setSuccessMsg(
        `Dokumen "${file.name}" berhasil diolah otomatis menjadi kurikulum 4 level dan langsung aktif di arena latihan.`
      );
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengolah berkas.');
    } finally {
      setIsProcessing(false);
      setProcessingLabel('');
    }
  };

  const handleProcessBundledPdf = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);
    setProcessingLabel('Mengolah PDF konsep bawaan dengan Gemini AI...');

    try {
      const res = await fetch('/api/process-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useBundledSample: true }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengolah PDF contoh.');
      }

      onApplyCurriculum(data.curriculum);
      setSuccessMsg(
        'PDF Rekap Konsep berhasil diolah otomatis oleh AI. Ringkasan konsep, tabel riwayat, dan 4 level latihan telah diperbarui.'
      );
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menghubungi layanan AI.');
    } finally {
      setIsProcessing(false);
      setProcessingLabel('');
    }
  };

  const handleTopicGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);
    setProcessingLabel(`Menyusun latihan bertema "${topicInput.trim()}" dengan AI...`);

    try {
      const res = await fetch('/api/generate-topic-exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicInput.trim(), gradeLevel: gradeInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat paket soal.');
      }

      onApplyCurriculum(data.curriculum);
      setSuccessMsg(`Paket latihan bertema "${topicInput.trim()}" berhasil disusun dan diterapkan.`);
      setTopicInput('');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat paket soal.');
    } finally {
      setIsProcessing(false);
      setProcessingLabel('');
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(activeCurriculum, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeCurriculum.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const summary = activeCurriculum.summary;

  return (
    <div className="space-y-8">
      {/* Upload & AI Processing Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Upload & Bundled PDF trigger */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 iso-card space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Pengolahan Dokumen Kurikulum Otomatis
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Unggah PDF atau Materi Ajar untuk Diolah AI
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Unggah berkas PDF konsep, silabus, atau modul pelajaran. AI akan mengekstrak rangkuman konsep, aturan validasi, dan menyusun otomatis bank soal interaktif Level 1 hingga Level 4.
            </p>
          </div>

          {/* Dropzone */}
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileProcess(file);
            }}
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
              dragActive
                ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/40 hover:border-blue-500'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.txt,.md,.csv,application/pdf,text/plain,text/markdown"
              disabled={isProcessing}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileProcess(file);
                e.target.value = '';
              }}
              className="sr-only"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_3px_0_0_#1d4ed8]">
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
            </div>
            <div className="space-y-1">
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {isProcessing ? processingLabel : 'Klik untuk memilih berkas atau seret ke sini'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Mendukung PDF, TXT, dan Markdown (maksimal 20 MB)
              </div>
            </div>
          </label>

          {/* Bundled Sample PDF Action */}
          {sampleInfo?.available && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate">{sampleInfo.fileName}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  Dokumen PDF terlampir · {Math.round((sampleInfo.sizeBytes ?? 0) / 1024)} KB
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPdfPreview((v) => !v)}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap cursor-pointer"
                >
                  {showPdfPreview ? 'Tutup Pratinjau PDF' : 'Lihat PDF Asli'}
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessBundledPdf}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold iso-btn-primary whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Olah Otomatis PDF Ini</span>
                </button>
              </div>
            </div>
          )}

          {showPdfPreview && (
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-950">
              <iframe
                title="Pratinjau Dokumen PDF"
                src="/assets/aistudio/Rekap_Konsep_Aplikasi_Latihan_Laptop_3200e130.pdf"
                className="w-full h-[420px]"
              />
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-800 dark:text-rose-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <span>{successMsg}</span>
              </div>
              <button
                type="button"
                onClick={onStartTraining}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                Buka Peta Level
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick Topic Generator */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 iso-card space-y-5">
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Generator Materi Cepat
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Buat Soal dari Topik Pelajaran
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Belum menyiapkan berkas PDF? Tulis topik mata pelajaran agar AI langsung menyusun 4 level latihan laptop sesuai konteks materi tersebut.
            </p>
          </div>

          <form onSubmit={handleTopicGenerate} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Topik Materi
              </label>
              <input
                id="topic-input"
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Contoh: Sistem Tata Surya atau Ekosistem"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="grade-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Sasaran Siswa
              </label>
              <input
                id="grade-input"
                type="text"
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing || !topicInput.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold iso-btn-primary cursor-pointer"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              <span>Susun 4 Level Otomatis</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh JSON</span>
            </button>
            {!activeCurriculum.isDefault && (
              <button
                type="button"
                onClick={onResetDefault}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Kembalikan Bawaan PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Extracted Concept & Curriculum Breakdown */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 iso-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Sumber: {summary.sourceFileName}</span>
              <span aria-hidden="true">·</span>
              <span>Diperbarui {summary.processedAt}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
              {summary.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{summary.coreObjective}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Keterampilan Utama yang Dilatih
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
              {summary.skillsCovered.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Aturan Validasi &amp; Teknis
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
              {summary.validationRules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>

        {summary.evolutionHistory.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Perkembangan Konsep yang Terdeteksi
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Versi</th>
                    <th className="px-4 py-3 font-semibold">Nama</th>
                    <th className="px-4 py-3 font-semibold">Ciri Utama</th>
                    <th className="px-4 py-3 font-semibold">Alasan Perubahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  {summary.evolutionHistory.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-mono-code font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {row.version}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        {row.name}
                      </td>
                      <td className="px-4 py-3">{row.mainFeatures}</td>
                      <td className="px-4 py-3">{row.reasonForChange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 text-sm text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Catatan Pengolahan AI: </span>
          {summary.aiNotes}
        </div>
      </div>
    </div>
  );
}
