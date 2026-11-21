import type { OSMode } from '../types/curriculum';

export interface KeyInstruction {
  keyId: string;
  keyLabel: string;
  requiresShift: boolean;
  hintText: string;
}

const SHIFT_SYMBOL_MAP: Record<string, { keyId: string; baseLabel: string; desc: string }> = {
  '!': { keyId: 'Digit1', baseLabel: '1', desc: 'tanda seru (!)' },
  '@': { keyId: 'Digit2', baseLabel: '2', desc: 'tanda @' },
  '#': { keyId: 'Digit3', baseLabel: '3', desc: 'tanda pagar (#)' },
  '$': { keyId: 'Digit4', baseLabel: '4', desc: 'tanda dolar ($)' },
  '%': { keyId: 'Digit5', baseLabel: '5', desc: 'tanda persen (%)' },
  '^': { keyId: 'Digit6', baseLabel: '6', desc: 'tanda ^' },
  '&': { keyId: 'Digit7', baseLabel: '7', desc: 'tanda &' },
  '*': { keyId: 'Digit8', baseLabel: '8', desc: 'tanda bintang (*)' },
  '(': { keyId: 'Digit9', baseLabel: '9', desc: 'kurung buka (' },
  ')': { keyId: 'Digit0', baseLabel: '0', desc: 'kurung tutup )' },
  '_': { keyId: 'Minus', baseLabel: '-', desc: 'garis bawah (_)' },
  '+': { keyId: 'Equal', baseLabel: '=', desc: 'tanda tambah (+)' },
  '{': { keyId: 'BracketLeft', baseLabel: '[', desc: 'kurung kurawal {' },
  '}': { keyId: 'BracketRight', baseLabel: ']', desc: 'kurung kurawal }' },
  ':': { keyId: 'Semicolon', baseLabel: ';', desc: 'titik dua (:)' },
  '"': { keyId: 'Quote', baseLabel: "'", desc: 'tanda kutip ganda (")' },
  '<': { keyId: 'Comma', baseLabel: ',', desc: 'tanda <' },
  '>': { keyId: 'Period', baseLabel: '.', desc: 'tanda >' },
  '?': { keyId: 'Slash', baseLabel: '/', desc: 'tanda tanya (?)' },
};

const PLAIN_SYMBOL_MAP: Record<string, { keyId: string; label: string; desc: string }> = {
  ' ': { keyId: 'Space', label: 'Spasi', desc: 'spasi' },
  '-': { keyId: 'Minus', label: '-', desc: 'tanda hubung (-)' },
  '=': { keyId: 'Equal', label: '=', desc: 'sama dengan (=)' },
  '[': { keyId: 'BracketLeft', label: '[', desc: 'kurung siku [' },
  ']': { keyId: 'BracketRight', label: ']', desc: 'kurung siku ]' },
  ';': { keyId: 'Semicolon', label: ';', desc: 'titik koma (;)' },
  "'": { keyId: 'Quote', label: "'", desc: "tanda petik (')" },
  ',': { keyId: 'Comma', label: ',', desc: 'tanda koma (,)' },
  '.': { keyId: 'Period', label: '.', desc: 'tanda titik (.)' },
  '/': { keyId: 'Slash', label: '/', desc: 'garis miring (/)' },
};

export function getKeyInstructionForChar(char: string): KeyInstruction | null {
  if (!char) return null;

  if (SHIFT_SYMBOL_MAP[char]) {
    const info = SHIFT_SYMBOL_MAP[char];
    return {
      keyId: info.keyId,
      keyLabel: info.baseLabel,
      requiresShift: true,
      hintText: `Tahan Shift + ${info.baseLabel} untuk ${info.desc}`,
    };
  }

  if (PLAIN_SYMBOL_MAP[char]) {
    const info = PLAIN_SYMBOL_MAP[char];
    return {
      keyId: info.keyId,
      keyLabel: info.label,
      requiresShift: false,
      hintText: `Tekan tombol ${info.label} untuk ${info.desc}`,
    };
  }

  if (/^[A-Z]$/.test(char)) {
    return {
      keyId: `Key${char}`,
      keyLabel: char,
      requiresShift: true,
      hintText: `Tahan Shift + ${char} untuk huruf besar ${char}`,
    };
  }

  if (/^[a-z]$/.test(char)) {
    const upper = char.toUpperCase();
    return {
      keyId: `Key${upper}`,
      keyLabel: upper,
      requiresShift: false,
      hintText: `Tekan huruf ${char} (tanpa Shift / pastikan Caps Lock mati)`,
    };
  }

  if (/^[0-9]$/.test(char)) {
    return {
      keyId: `Digit${char}`,
      keyLabel: char,
      requiresShift: false,
      hintText: `Tekan angka ${char}`,
    };
  }

  return {
    keyId: '',
    keyLabel: char,
    requiresShift: false,
    hintText: `Ketik karakter "${char}"`,
  };
}

export function normalizeText(value: string): string {
  return value.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
}

export function calculateExerciseStars(errors: number): number {
  if (errors <= 0) return 3;
  if (errors <= 2) return 2;
  return 1;
}

export function calculateLevelStars(exerciseStars: number[]): number {
  if (exerciseStars.length === 0) return 1;
  const total = exerciseStars.reduce((acc, s) => acc + s, 0);
  return Math.max(1, Math.min(3, Math.round(total / exerciseStars.length)));
}

export function formatShortcutLabel(osMode: OSMode, key: 'A' | 'C' | 'X' | 'V' | 'Z'): string {
  const mod = osMode === 'mac' ? 'Cmd' : 'Ctrl';
  return `${mod}+${key}`;
}
