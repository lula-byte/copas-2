import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

const BUNDLED_PDF_RELATIVE = 'public/assets/aistudio/Rekap_Konsep_Aplikasi_Latihan_Laptop_3200e130.pdf';

function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi pada environment server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const curriculumResponseSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'Nama singkat modul atau kurikulum hasil ekstraksi dokumen (bahasa Indonesia).',
    },
    description: {
      type: Type.STRING,
      description: 'Deskripsi ringkas 1-2 kalimat mengenai modul latihan ini.',
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        targetAudience: { type: Type.STRING },
        coreObjective: { type: Type.STRING },
        skillsCovered: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        validationRules: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        evolutionHistory: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              version: { type: Type.STRING },
              name: { type: Type.STRING },
              mainFeatures: { type: Type.STRING },
              reasonForChange: { type: Type.STRING },
            },
            required: ['version', 'name', 'mainFeatures', 'reasonForChange'],
          },
        },
        improvementNotes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              detail: { type: Type.STRING },
            },
            required: ['item', 'detail'],
          },
        },
        aiNotes: { type: Type.STRING },
      },
      required: [
        'title',
        'subtitle',
        'targetAudience',
        'coreObjective',
        'skillsCovered',
        'validationRules',
        'evolutionHistory',
        'improvementNotes',
        'aiNotes',
      ],
    },
    level1: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        tasks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              target: { type: Type.STRING },
              label: { type: Type.STRING },
            },
            required: ['id', 'target', 'label'],
          },
        },
      },
      required: ['title', 'subtitle', 'tasks'],
    },
    level2: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        paragraphs: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Tepat 3 paragraf teks bahasa Indonesia yang diambil atau diadaptasi dari topik dokumen.',
        },
        tasks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              instruction: { type: Type.STRING },
              targetText: {
                type: Type.STRING,
                description: 'Potongan teks persis yang ada di dalam paragraphs.',
              },
              method: {
                type: Type.STRING,
                description:
                  'Salah satu dari: double-click, drag-sentence, triple-click, shift-click, drag-two-sentences, select-all',
              },
              hint: { type: Type.STRING },
            },
            required: ['id', 'instruction', 'targetText', 'method', 'hint'],
          },
        },
      },
      required: ['title', 'subtitle', 'paragraphs', 'tasks'],
    },
    level3: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        tasks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              instruction: { type: Type.STRING },
              sourceText: { type: Type.STRING },
              actionType: {
                type: Type.STRING,
                description:
                  'Salah satu dari: copy-paste, cut-paste-word, paste-three-times, paste-then-undo, select-all-copy-paste',
              },
              targetWord: { type: Type.STRING },
              expectedTargetText: { type: Type.STRING },
              expectedSourceAfter: { type: Type.STRING },
              hint: { type: Type.STRING },
            },
            required: ['id', 'instruction', 'sourceText', 'actionType', 'expectedTargetText', 'hint'],
          },
        },
      },
      required: ['title', 'subtitle', 'tasks'],
    },
    level4: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        tasks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              cardTitle: { type: Type.STRING },
              cardRows: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                    isDistractor: { type: Type.BOOLEAN },
                  },
                  required: ['label', 'value', 'isDistractor'],
                },
              },
              pasteInstruction: { type: Type.STRING },
              expectedPasteValue: { type: Type.STRING },
              typeInstruction: { type: Type.STRING },
              expectedTypeValue: { type: Type.STRING },
              typeHint: { type: Type.STRING },
            },
            required: [
              'id',
              'title',
              'cardTitle',
              'cardRows',
              'pasteInstruction',
              'expectedPasteValue',
              'typeInstruction',
              'expectedTypeValue',
              'typeHint',
            ],
          },
        },
      },
      required: ['title', 'subtitle', 'tasks'],
    },
  },
  required: ['name', 'description', 'summary', 'level1', 'level2', 'level3', 'level4'],
};

app.get('/api/sample-pdf-info', (_req, res) => {
  const fullPath = path.resolve(process.cwd(), BUNDLED_PDF_RELATIVE);
  if (!fs.existsSync(fullPath)) {
    res.json({ available: false });
    return;
  }
  const stats = fs.statSync(fullPath);
  res.json({
    available: true,
    fileName: 'Rekap_Konsep_Aplikasi_Latihan_Laptop_3200e130.pdf',
    sizeBytes: stats.size,
  });
});

app.post('/api/process-document', async (req, res) => {
  try {
    const { fileName, mimeType, base64Data, textContent, useBundledSample } = req.body as {
      fileName?: string;
      mimeType?: string;
      base64Data?: string;
      textContent?: string;
      useBundledSample?: boolean;
    };

    let resolvedFileName = fileName || 'dokumen-kurikulum.pdf';
    let resolvedMimeType = mimeType || 'application/pdf';
    let resolvedBase64 = base64Data;

    if (useBundledSample) {
      const fullPath = path.resolve(process.cwd(), BUNDLED_PDF_RELATIVE);
      if (!fs.existsSync(fullPath)) {
        res.status(404).json({ error: 'Berkas PDF contoh bawaan tidak ditemukan di server.' });
        return;
      }
      resolvedBase64 = fs.readFileSync(fullPath).toString('base64');
      resolvedFileName = 'Rekap_Konsep_Aplikasi_Latihan_Laptop_3200e130.pdf';
      resolvedMimeType = 'application/pdf';
    }

    if (!resolvedBase64 && !textContent) {
      res.status(400).json({ error: 'Mohon unggah berkas dokumen atau isi teks untuk diolah.' });
      return;
    }

    const ai = createGeminiClient();

    const systemInstruction = `Anda adalah arsitek kurikulum dan pengolah dokumen pendidikan otomatis berbahasa Indonesia.
Tugas Anda: membaca dokumen yang diunggah pengguna (bisa berupa PDF spesifikasi, modul ajar, catatan konsep, atau materi pelajaran apa pun) lalu mengekstrak DAN menyusunnya secara otomatis menjadi struktur lengkap aplikasi "Latihan Laptop" 4 level untuk siswa SMP:
1. Ringkasan analisis dokumen (judul, sasaran, tujuan inti, daftar keterampilan, aturan validasi, tabel riwayat versi/konsep jika ada di dokumen—jika tidak ada isi array kosong [], serta catatan perbaikan).
2. Level 1 - Mengetik dengan Shift: buat 5-7 item latihan mengetik pendek yang melatih huruf kapital, tanda baca, angka, dan simbol (! ? @ # ( ) & " _) yang relevan dengan isi/konteks dokumen. Jika dokumen sudah menyebut contoh teks target persis seperti Budi, Halo, Ani!, dsb., pertahankan contoh tersebut!
3. Level 2 - Memblok Teks: buat TEPAT 3 paragraf teks berbahasa Indonesia yang koheren sesuai topik dokumen, lalu buat 6 tugas berurutan:
   - tugas 1: method "double-click" (1 kata persis yang ada di paragraf 1)
   - tugas 2: method "drag-sentence" (1 kalimat persis di paragraf 1 atau 2)
   - tugas 3: method "triple-click" (1 paragraf penuh persis, misal paragraf 3)
   - tugas 4: method "shift-click" (1 frasa 2-4 kata yang persis ada di paragraf)
   - tugas 5: method "drag-two-sentences" (2 kalimat pertama berurutan persis di paragraf 2)
   - tugas 6: method "select-all" (gabungan seluruh 3 paragraf dipisahkan 1 spasi)
   KRITIS: setiap targetText di Level 2 WAJIB merupakan substring persis dari paragraphs!
4. Level 3 - Salin, Potong, Tempel: buat 5 tugas berurutan sesuai actionType:
   - tugas 1: actionType "copy-paste" (expectedTargetText sama persis dengan sourceText)
   - tugas 2: actionType "cut-paste-word" (tentukan targetWord yang muncul tepat satu kali di sourceText; expectedTargetText = targetWord; expectedSourceAfter = sourceText tanpa targetWord dengan spasi rapi)
   - tugas 3: actionType "paste-three-times" (sourceText kata/frasa singkat, expectedTargetText = sourceText diulang 3 kali tanpa pemisah tambahan, misal "Siap!Siap!Siap!")
   - tugas 4: actionType "paste-then-undo" (expectedTargetText = "")
   - tugas 5: actionType "select-all-copy-paste" (sourceText 2-3 baris dipisah \\n, expectedTargetText = semua baris digabung spasi)
5. Level 4 - Kombinasi: buat 4-5 skenario kartu data sesuai topik dokumen. Setiap kartu punya 3 baris (2 baris pengecoh isDistractor: true, dan 1 baris target utama isDistractor: false). expectedPasteValue harus sama persis dengan value baris non-distractor. expectedTypeValue harus kata/kode singkat bersimbol yang relevan.

Pastikan seluruh antarmuka dan instruksi memakai bahasa Indonesia baku yang ramah untuk siswa SMP.`;

    const parts: Array<{ inlineData: { mimeType: string; data: string } } | { text: string }> = [];

    if (resolvedBase64) {
      parts.push({
        inlineData: {
          mimeType: resolvedMimeType,
          data: resolvedBase64,
        },
      });
      parts.push({
        text: `Olah dokumen berjudul "${resolvedFileName}" ini secara otomatis menjadi analisis konsep dan bank soal 4 level interaktif sesuai skema JSON.`,
      });
    } else if (textContent) {
      parts.push({
        text: `Olah isi dokumen berikut (berkas: "${resolvedFileName}") secara otomatis menjadi analisis konsep dan bank soal 4 level interaktif sesuai skema JSON:\n\n${textContent}`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: curriculumResponseSchema,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      res.status(502).json({ error: 'Model AI tidak mengembalikan keluaran teks.' });
      return;
    }

    const parsed = JSON.parse(rawText);

    const curriculum = {
      id: `ai-${Date.now()}`,
      name: parsed.name || resolvedFileName,
      description: parsed.description || 'Kurikulum hasil pengolahan dokumen otomatis oleh AI.',
      isDefault: false,
      summary: {
        ...parsed.summary,
        sourceFileName: resolvedFileName,
        processedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      },
      level1: parsed.level1,
      level2: parsed.level2,
      level3: parsed.level3,
      level4: parsed.level4,
    };

    res.json({ curriculum });
  } catch (err: unknown) {
    console.error('Error processing document with Gemini:', err);
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengolah dokumen dengan AI.';
    res.status(500).json({ error: message });
  }
});

app.post('/api/generate-topic-exercises', async (req, res) => {
  try {
    const { topic, gradeLevel } = req.body as { topic?: string; gradeLevel?: string };
    if (!topic || !topic.trim()) {
      res.status(400).json({ error: 'Topik materi pelajaran wajib diisi.' });
      return;
    }

    const ai = createGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Buatkan paket latihan keterampilan laptop 4 level lengkap untuk ${gradeLevel || 'Siswa SMP'} dengan tema materi pelajaran: "${topic.trim()}". Pastikan Level 2 punya 3 paragraf akurat dengan targetText yang merupakan potongan persis paragraf, Level 3 memakai 5 actionType standar, dan Level 4 memiliki kartu data berisi baris pengecoh.`,
      config: {
        systemInstruction:
          'Anda adalah guru TIK/Informatika SMP yang menyusun latihan keterampilan dasar laptop (Shift, Blok teks, Salin-Potong-Tempel, Kombinasi) berbasis tema mata pelajaran dalam bahasa Indonesia baku.',
        responseMimeType: 'application/json',
        responseSchema: curriculumResponseSchema,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      res.status(502).json({ error: 'Model AI tidak mengembalikan keluaran.' });
      return;
    }

    const parsed = JSON.parse(rawText);
    const curriculum = {
      id: `topic-${Date.now()}`,
      name: parsed.name || `Latihan Tema: ${topic.trim()}`,
      description: parsed.description || `Paket latihan laptop bertema ${topic.trim()}.`,
      isDefault: false,
      summary: {
        ...parsed.summary,
        sourceFileName: `Generator Topik (${topic.trim()})`,
        processedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      },
      level1: parsed.level1,
      level2: parsed.level2,
      level3: parsed.level3,
      level4: parsed.level4,
    };

    res.json({ curriculum });
  } catch (err: unknown) {
    console.error('Error generating topic exercises:', err);
    const message = err instanceof Error ? err.message : 'Gagal membuat soal dari topik.';
    res.status(500).json({ error: message });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Latihan Laptop SMP server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
