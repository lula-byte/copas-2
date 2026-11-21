import type { OSMode } from '../types/curriculum';

interface GuideSectionProps {
  osMode: OSMode;
  onStartTraining: () => void;
}

export function GuideSection({ osMode, onStartTraining }: GuideSectionProps) {
  const mod = osMode === 'mac' ? 'Cmd' : 'Ctrl';

  const shortcuts = [
    { keys: 'Shift + Huruf / Angka', purpose: 'Mengetik huruf kapital serta simbol seperti ! @ # ( ) " ?' },
    { keys: 'Klik 2x', purpose: 'Memblok satu kata secara cepat' },
    { keys: 'Klik 3x', purpose: 'Memblok satu paragraf utuh sekaligus' },
    { keys: 'Klik Awal + Shift+Klik Akhir', purpose: 'Memblok rentang frasa dari titik awal hingga titik akhir' },
    { keys: `${mod} + A`, purpose: 'Memilih seluruh teks di dalam area dokumen atau kotak' },
    { keys: `${mod} + C`, purpose: 'Menyalin (Copy) teks yang sedang diblok ke papan klip' },
    { keys: `${mod} + X`, purpose: 'Memotong (Cut) teks yang sedang diblok dan memindahkannya' },
    { keys: `${mod} + V`, purpose: 'Menempel (Paste) teks dari papan klip ke kolom tujuan' },
    { keys: `${mod} + Z`, purpose: 'Membatalkan (Undo) tindakan penempelan terakhir' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 iso-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Panduan Siswa &amp; Guru
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Cara Bermain &amp; Daftar Pintasan ({osMode === 'mac' ? 'Mac' : 'Windows'})
            </h2>
          </div>

          <button
            type="button"
            onClick={onStartTraining}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold iso-btn-primary whitespace-nowrap shrink-0 cursor-pointer"
          >
            Mulai Latihan Sekarang
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-5 space-y-2">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              01. Tanpa Nyawa &amp; Waktu
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Fokus latihan adalah pembiasaan jari. Tidak ada batas waktu atau pengurangan nyawa yang membuat siswa panik.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-5 space-y-2">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              02. Penilaian 1–3 Bintang
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Tanpa kesalahan meraih 3 bintang, 1–2 kesalahan meraih 2 bintang, dan lebih dari 2 kesalahan tetap mendapat 1 bintang penyemangat.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-5 space-y-2">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              03. Mode Guru &amp; Olah PDF AI
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Aktifkan Mode Guru di bilah alat untuk membuka seluruh 4 level sekaligus, atau unggah dokumen PDF baru agar diolah AI menjadi soal latihan.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Referensi Pintasan dan Gerakan Tetikus
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tombol / Aksi</th>
                  <th className="px-4 py-3 font-semibold">Kegunaan dalam Latihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {shortcuts.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 font-mono-code font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {row.keys}
                    </td>
                    <td className="px-4 py-3">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
