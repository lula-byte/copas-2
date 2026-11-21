import type { CurriculumData, StudentProgress } from '../types/curriculum';

export const DEFAULT_CURRICULUM: CurriculumData = {
  id: 'default-latihan-laptop-smp',
  name: 'Latihan Laptop (Versi Final)',
  description:
    'Kurikulum standar pembiasaan laptop untuk siswa SMP: mengetik dengan Shift, memblok teks, salin-potong-tempel, dan kombinasi.',
  isDefault: true,
  summary: {
    title: 'Rekap Konsep dan Perbaikan: Aplikasi Latihan Laptop untuk Siswa SMP',
    subtitle: 'Dokumen Acuan Kurikulum Pembiasaan Keterampilan Dasar Laptop',
    sourceFileName: 'Rekap_Konsep_Aplikasi_Latihan_Laptop_3200e130.pdf',
    processedAt: '2026-11-21',
    targetAudience: 'Siswa SMP (±16 siswa per sesi kelas, masing-masing menggunakan laptop sendiri)',
    coreObjective:
      'Membiasakan siswa SMP yang sudah fasih memakai ponsel agar terampil menggunakan tombol Shift, menyeleksi (memblok) teks, serta mengoperasikan pintasan salin, potong, tempel, dan urungkan tanpa tekanan nyawa atau batas waktu.',
    skillsCovered: [
      'Tombol Shift untuk huruf kapital dan simbol (! ? @ # ( ) & " dan angka)',
      'Memblok teks dengan klik 2x, klik-geser, klik 3x, Shift+Klik, dan Ctrl+A / Cmd+A',
      'Operasi papan klip: Salin (Ctrl+C), Potong (Ctrl+X), Tempel (Ctrl+V), dan Urungkan (Ctrl+Z)',
      'Kombinasi terpadu: mengambil data akurat di antara baris pengecoh lalu mengetik kode bersimbol',
    ],
    validationRules: [
      'Level 1 membedakan huruf besar dan kecil; kesalahan langsung dihapus otomatis dengan getaran ringan dan peringatan Caps Lock',
      'Penempelan (Paste) diblokir pada kolom latihan ketik agar siswa benar-benar melatih jari',
      'Level 2 menormalkan spasi/baris baru dan memeriksa penggunaan tombol Shift pada tugas Shift+Klik',
      'Level 3 memblokir pengetikan manual di kotak tujuan agar siswa wajib memakai Ctrl/Cmd+C, X, V, dan Z',
      'Penilaian 1–3 bintang per latihan (minimal 1 bintang agar siswa tidak merasa gagal); kemajuan tersimpan lokal di peramban',
    ],
    evolutionHistory: [
      {
        version: 'Versi 1',
        name: 'Petualangan Keyboard',
        mainFeatures: '3 level pemula bergaya anak, bintang ganjaran, petunjuk selalu tampil.',
        reasonForChange: 'Konsep awal untuk membiasakan tiga keterampilan dasar.',
      },
      {
        version: 'Versi 2',
        name: 'Misi Laptop (Level SMP)',
        mainFeatures: 'Tugas bertahap lebih sulit, timer target waktu, peringkat, peringatan Caps Lock.',
        reasonForChange: 'Sasaran siswa SMP yang sudah mahir ponsel butuh tantangan lebih tinggi.',
      },
      {
        version: 'Versi 3',
        name: 'Laptop Defender (Arcade)',
        mainFeatures: 'Permainan meteor jatuh (Blok, Salin, Ketik), 15 nyawa (+2 tiap level), papan peringkat kelas.',
        reasonForChange: 'Permintaan bentuk arcade yang dapat dimainkan serempak oleh satu kelas.',
      },
      {
        version: 'Versi 4',
        name: 'Latihan Laptop (Versi Final)',
        mainFeatures: 'Latihan bertahap tanpa nyawa dan tanpa batas waktu, 4 level terurut, bintang kemajuan.',
        reasonForChange: 'Fokus dikembalikan ke latihan pembiasaan keterampilan, bukan permainan penuh.',
      },
    ],
    improvementNotes: [
      {
        item: 'Tingkat Kesulitan & Validasi SMP',
        detail: 'Validasi ketat per karakter, penghapusan otomatis karakter salah, dan peringatan Caps Lock.',
      },
      {
        item: 'Urutan Level Terstruktur',
        detail: 'Diurutkan menjadi Mengetik (Shift) -> Memblok -> Salin-Tempel -> Kombinasi, lengkap dengan Mode Guru.',
      },
      {
        item: 'Teks HTML Terbuka & Aksesibilitas',
        detail: 'Teks soal berupa HTML biasa agar dapat diseleksi/disalin secara asli, ditambah opsi Kurangi Animasi dan Mode Gelap.',
      },
    ],
    aiNotes:
      'Konsep bawaan telah diselaraskan sepenuhnya dengan rincian Versi Final pada dokumen PDF, mencakup 23 latihan interaktif di 4 level.',
  },
  level1: {
    title: 'Mengetik dengan Shift',
    subtitle: 'Latih ketepatan huruf kapital, tanda baca, dan simbol dengan tombol Shift.',
    tasks: [
      { id: 'l1-1', target: 'Budi', label: 'Latihan 1 · Huruf Kapital Awal' },
      { id: 'l1-2', target: 'Halo, Ani!', label: 'Latihan 2 · Koma dan Tanda Seru' },
      { id: 'l1-3', target: 'Siapa namamu?', label: 'Latihan 3 · Kalimat Tanya' },
      { id: 'l1-4', target: 'Rp1.500.000', label: 'Latihan 4 · Format Mata Uang' },
      { id: 'l1-5', target: 'ani@sekolah.sch.id', label: 'Latihan 5 · Simbol Surel (@)' },
      { id: 'l1-6', target: '"Selamat pagi!"', label: 'Latihan 6 · Tanda Kutip Ganda' },
      { id: 'l1-7', target: 'P@ssw0rd!2026', label: 'Latihan 7 · Kombinasi Kata Sandi' },
    ],
  },
  level2: {
    title: 'Memblok Teks',
    subtitle: 'Kuasai berbagai cara menyeleksi teks menggunakan tetikus dan tombol Shift.',
    paragraphs: [
      'Siswa kelas delapan sedang mengikuti kegiatan praktikum komputer di laboratorium sekolah. Setiap laptop sudah terhubung dengan jaringan lokal kelas. Semua peserta diminta menjaga kebersihan meja kerja.',
      'Pada sesi pagi ini, guru menjelaskan cara memilih kalimat secara cepat. Teknik memblok teks yang rapi sangat membantu saat menyunting tugas laporan. Setelah berlatih bersama, siswa dapat menyelesaikan soal lebih percaya diri.',
      'Di akhir pelajaran, seluruh catatan latihan disimpan ke dalam folder masing-masing siswa.',
    ],
    tasks: [
      {
        id: 'l2-1',
        instruction: 'Klik ganda (2x) pada kata "komputer" di paragraf pertama.',
        targetText: 'komputer',
        method: 'double-click',
        hint: 'Arahkan kursor tepat ke kata "komputer", lalu klik kiri dua kali dengan cepat.',
      },
      {
        id: 'l2-2',
        instruction: 'Blok satu kalimat kedua pada paragraf pertama dengan klik-geser (drag).',
        targetText: 'Setiap laptop sudah terhubung dengan jaringan lokal kelas.',
        method: 'drag-sentence',
        hint: 'Klik tahan di depan kata "Setiap", geser hingga tanda titik setelah "kelas.", lalu lepas.',
      },
      {
        id: 'l2-3',
        instruction: 'Blok seluruh paragraf ketiga dengan klik tiga kali (3x) pada paragraf tersebut.',
        targetText: 'Di akhir pelajaran, seluruh catatan latihan disimpan ke dalam folder masing-masing siswa.',
        method: 'triple-click',
        hint: 'Klik kiri 3 kali secara cepat di mana saja pada paragraf ketiga.',
      },
      {
        id: 'l2-4',
        instruction:
          'Blok frasa "kegiatan praktikum komputer" dengan cara klik di awal frasa lalu Shift+Klik di akhir frasa.',
        targetText: 'kegiatan praktikum komputer',
        method: 'shift-click',
        hint: 'Klik tepat sebelum huruf "k" pada "kegiatan", tahan tombol Shift, lalu klik setelah huruf "r" pada "komputer".',
      },
      {
        id: 'l2-5',
        instruction: 'Blok dua kalimat pertama pada paragraf kedua menggunakan klik-geser.',
        targetText:
          'Pada sesi pagi ini, guru menjelaskan cara memilih kalimat secara cepat. Teknik memblok teks yang rapi sangat membantu saat menyunting tugas laporan.',
        method: 'drag-two-sentences',
        hint: 'Mulai blok dari "Pada sesi pagi ini..." dan berhenti tepat setelah tanda titik pada "...tugas laporan.".',
      },
      {
        id: 'l2-6',
        instruction: 'Blok seluruh teks pada ketiga paragraf sekaligus menggunakan pintasan pilih semua.',
        targetText:
          'Siswa kelas delapan sedang mengikuti kegiatan praktikum komputer di laboratorium sekolah. Setiap laptop sudah terhubung dengan jaringan lokal kelas. Semua peserta diminta menjaga kebersihan meja kerja. Pada sesi pagi ini, guru menjelaskan cara memilih kalimat secara cepat. Teknik memblok teks yang rapi sangat membantu saat menyunting tugas laporan. Setelah berlatih bersama, siswa dapat menyelesaikan soal lebih percaya diri. Di akhir pelajaran, seluruh catatan latihan disimpan ke dalam folder masing-masing siswa.',
        method: 'select-all',
        hint: 'Klik di dalam area dokumen, lalu tekan Ctrl+A (Windows) atau Cmd+A (Mac).',
      },
    ],
  },
  level3: {
    title: 'Salin, Potong, Tempel',
    subtitle: 'Pindahkan dan gandakan teks antara Kotak A dan Kotak B tanpa mengetik ulang.',
    tasks: [
      {
        id: 'l3-1',
        instruction: 'Salin kalimat dari Kotak A lalu tempelkan ke Kotak B.',
        sourceText: 'Belajar pintasan keyboard membuat pekerjaan lebih cepat.',
        actionType: 'copy-paste',
        expectedTargetText: 'Belajar pintasan keyboard membuat pekerjaan lebih cepat.',
        hint: 'Blok kalimat di Kotak A, tekan Ctrl+C (salin), klik Kotak B, lalu tekan Ctrl+V (tempel).',
      },
      {
        id: 'l3-2',
        instruction: 'Potong (Cut) hanya kata "Apel" dari Kotak A dan tempelkan ke Kotak B.',
        sourceText: 'Buah segar: Apel manis dari Malang.',
        actionType: 'cut-paste-word',
        targetWord: 'Apel',
        expectedTargetText: 'Apel',
        expectedSourceAfter: 'Buah segar: manis dari Malang.',
        hint: 'Blok kata "Apel" di Kotak A, tekan Ctrl+X untuk memotong, lalu tekan Ctrl+V di Kotak B.',
      },
      {
        id: 'l3-3',
        instruction: 'Salin teks dari Kotak A lalu tempelkan tepat 3 kali di Kotak B.',
        sourceText: 'Siap!',
        actionType: 'paste-three-times',
        expectedTargetText: 'Siap!Siap!Siap!',
        hint: 'Salin "Siap!" dari Kotak A (Ctrl+C), lalu klik Kotak B dan tekan Ctrl+V sebanyak tiga kali.',
      },
      {
        id: 'l3-4',
        instruction:
          'Salin dan tempel teks dari Kotak A ke Kotak B, kemudian batalkan (Undo) sampai Kotak B kosong kembali.',
        sourceText: 'Latihan pembatalan dengan pintasan.',
        actionType: 'paste-then-undo',
        expectedTargetText: '',
        hint: 'Tempel dulu kalimatnya ke Kotak B dengan Ctrl+V, lalu tekan Ctrl+Z untuk membatalkan hingga Kotak B kosong.',
      },
      {
        id: 'l3-5',
        instruction: 'Pilih seluruh isi Kotak A sekaligus, salin, lalu tempelkan ke Kotak B.',
        sourceText: 'Baris 1: Buka folder tugas.\nBaris 2: Periksa nama berkas.\nBaris 3: Simpan hasil akhir.',
        actionType: 'select-all-copy-paste',
        expectedTargetText:
          'Baris 1: Buka folder tugas. Baris 2: Periksa nama berkas. Baris 3: Simpan hasil akhir.',
        hint: 'Klik Kotak A, tekan Ctrl+A untuk memilih semua, tekan Ctrl+C, klik Kotak B, lalu tekan Ctrl+V.',
      },
    ],
  },
  level4: {
    title: 'Tantangan Kombinasi',
    subtitle: 'Gabungkan keterampilan memilih data akurat, menyalin-menempel, dan mengetik teks bersimbol.',
    tasks: [
      {
        id: 'l4-1',
        title: 'Latihan 1 · Identitas Akun Siswa',
        cardTitle: 'Kartu Data Siswa Kelas 8B',
        cardRows: [
          { label: 'Nama Lengkap', value: 'Ani Rahmawati', isDistractor: true },
          { label: 'Surel Utama', value: 'ani@sekolah.sch.id' },
          { label: 'Surel Wali', value: 'wali.ani@contoh.id', isDistractor: true },
        ],
        pasteInstruction: 'Blok lalu salin alamat Surel Utama dari kartu dan tempel di sini:',
        expectedPasteValue: 'ani@sekolah.sch.id',
        typeInstruction: 'Ketik kata sandi sementara berikut dengan tepat:',
        expectedTypeValue: 'Andi@2026!',
        typeHint: 'Gunakan Shift+A untuk "A", Shift+2 untuk "@", dan Shift+1 untuk "!".',
      },
      {
        id: 'l4-2',
        title: 'Latihan 2 · Anggaran Peralatan Lab',
        cardTitle: 'Kartu Pengadaan Lab Komputer',
        cardRows: [
          { label: 'Dana Cadangan', value: 'Rp750.000', isDistractor: true },
          { label: 'Biaya Perbaikan', value: 'Rp1.500.000' },
          { label: 'Kode Ruang', value: 'Ruang-A2', isDistractor: true },
        ],
        pasteInstruction: 'Salin nominal Biaya Perbaikan dari kartu dan tempel di sini:',
        expectedPasteValue: 'Rp1.500.000',
        typeInstruction: 'Ketik status kesiapan ruangan berikut:',
        expectedTypeValue: 'Lab-1 (Siap!)',
        typeHint: 'Tekan Shift+9 untuk "(", Shift+1 untuk "!", dan Shift+0 untuk ")".',
      },
      {
        id: 'l4-3',
        title: 'Latihan 3 · Jadwal Pengumpulan Tugas',
        cardTitle: 'Kartu Agenda Informatika',
        cardRows: [
          { label: 'Tanggal Mulai', value: '12 November 2026', isDistractor: true },
          { label: 'Tenggat Pengumpulan', value: 'Jumat, 27 November 2026' },
          { label: 'Ruang Kumpul', value: 'Lab Informatika 2', isDistractor: true },
        ],
        pasteInstruction: 'Salin isi baris Tenggat Pengumpulan dan tempel di sini:',
        expectedPasteValue: 'Jumat, 27 November 2026',
        typeInstruction: 'Ketik tagar penanda selesai berikut:',
        expectedTypeValue: '#Tugas_Selesai',
        typeHint: 'Tekan Shift+3 untuk "#" dan Shift+- (tanda hubung) untuk garis bawah "_".',
      },
      {
        id: 'l4-4',
        title: 'Latihan 4 · Alamat Pengiriman Buku',
        cardTitle: 'Kartu Ekspedisi Perpustakaan',
        cardRows: [
          { label: 'Nama Kurir', value: 'Budi Santoso', isDistractor: true },
          { label: 'Alamat Tujuan', value: 'Jl. Merdeka No. 45, Bandung' },
          { label: 'Kode Pos Lama', value: '40111', isDistractor: true },
        ],
        pasteInstruction: 'Salin Alamat Tujuan secara lengkap dari kartu dan tempel di sini:',
        expectedPasteValue: 'Jl. Merdeka No. 45, Bandung',
        typeInstruction: 'Ketik kutipan kalimat berikut persis dengan tanda baca:',
        expectedTypeValue: 'Dia bilang: "Ayo!"',
        typeHint: 'Gunakan Shift+; untuk ":", Shift+\' untuk tanda kutip ganda ("), dan Shift+1 untuk "!".',
      },
      {
        id: 'l4-5',
        title: 'Latihan 5 · Pengumuman Kehadiran Kelas',
        cardTitle: 'Papan Informasi Kelas 8',
        cardRows: [
          { label: 'Catatan Kemarin', value: 'Latihan mengetik selesai tepat waktu.', isDistractor: true },
          {
            label: 'Pengumuman Resmi',
            value: 'Semua siswa wajib membawa buku catatan saat praktikum berlangsung.',
          },
          { label: 'Jumlah Kelompok', value: '4 Kelompok', isDistractor: true },
        ],
        pasteInstruction: 'Salin kalimat Pengumuman Resmi secara utuh dan tempel di sini:',
        expectedPasteValue: 'Semua siswa wajib membawa buku catatan saat praktikum berlangsung.',
        typeInstruction: 'Ketik keterangan persentase kehadiran berikut:',
        expectedTypeValue: 'Hadir: 100%!',
        typeHint: 'Gunakan Shift+; untuk ":", Shift+5 untuk "%", dan Shift+1 untuk "!".',
      },
    ],
  },
};

export const INITIAL_PROGRESS: StudentProgress = {
  unlockedUpTo: 1,
  levels: {
    1: { completed: false, stars: 0, bestStars: 0, totalErrors: 0, exerciseStars: [] },
    2: { completed: false, stars: 0, bestStars: 0, totalErrors: 0, exerciseStars: [] },
    3: { completed: false, stars: 0, bestStars: 0, totalErrors: 0, exerciseStars: [] },
    4: { completed: false, stars: 0, bestStars: 0, totalErrors: 0, exerciseStars: [] },
  },
};
