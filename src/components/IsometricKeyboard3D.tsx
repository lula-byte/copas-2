import { useEffect, useState } from 'react';
import type { OSMode } from '../types/curriculum';

interface KeyDef {
  id: string;
  label: string;
  shiftLabel?: string;
  widthClass?: string;
  isModifier?: boolean;
}

const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { id: 'Backquote', label: '`', shiftLabel: '~', widthClass: 'w-10' },
    { id: 'Digit1', label: '1', shiftLabel: '!', widthClass: 'w-10' },
    { id: 'Digit2', label: '2', shiftLabel: '@', widthClass: 'w-10' },
    { id: 'Digit3', label: '3', shiftLabel: '#', widthClass: 'w-10' },
    { id: 'Digit4', label: '4', shiftLabel: '$', widthClass: 'w-10' },
    { id: 'Digit5', label: '5', shiftLabel: '%', widthClass: 'w-10' },
    { id: 'Digit6', label: '6', shiftLabel: '^', widthClass: 'w-10' },
    { id: 'Digit7', label: '7', shiftLabel: '&', widthClass: 'w-10' },
    { id: 'Digit8', label: '8', shiftLabel: '*', widthClass: 'w-10' },
    { id: 'Digit9', label: '9', shiftLabel: '(', widthClass: 'w-10' },
    { id: 'Digit0', label: '0', shiftLabel: ')', widthClass: 'w-10' },
    { id: 'Minus', label: '-', shiftLabel: '_', widthClass: 'w-10' },
    { id: 'Equal', label: '=', shiftLabel: '+', widthClass: 'w-10' },
    { id: 'Backspace', label: 'Hapus', widthClass: 'w-20', isModifier: true },
  ],
  [
    { id: 'Tab', label: 'Tab', widthClass: 'w-14', isModifier: true },
    { id: 'KeyQ', label: 'Q', widthClass: 'w-10' },
    { id: 'KeyW', label: 'W', widthClass: 'w-10' },
    { id: 'KeyE', label: 'E', widthClass: 'w-10' },
    { id: 'KeyR', label: 'R', widthClass: 'w-10' },
    { id: 'KeyT', label: 'T', widthClass: 'w-10' },
    { id: 'KeyY', label: 'Y', widthClass: 'w-10' },
    { id: 'KeyU', label: 'U', widthClass: 'w-10' },
    { id: 'KeyI', label: 'I', widthClass: 'w-10' },
    { id: 'KeyO', label: 'O', widthClass: 'w-10' },
    { id: 'KeyP', label: 'P', widthClass: 'w-10' },
    { id: 'BracketLeft', label: '[', shiftLabel: '{', widthClass: 'w-10' },
    { id: 'BracketRight', label: ']', shiftLabel: '}', widthClass: 'w-10' },
    { id: 'Backslash', label: '\\', shiftLabel: '|', widthClass: 'w-14' },
  ],
  [
    { id: 'CapsLock', label: 'Caps', widthClass: 'w-16', isModifier: true },
    { id: 'KeyA', label: 'A', widthClass: 'w-10' },
    { id: 'KeyS', label: 'S', widthClass: 'w-10' },
    { id: 'KeyD', label: 'D', widthClass: 'w-10' },
    { id: 'KeyF', label: 'F', widthClass: 'w-10' },
    { id: 'KeyG', label: 'G', widthClass: 'w-10' },
    { id: 'KeyH', label: 'H', widthClass: 'w-10' },
    { id: 'KeyJ', label: 'J', widthClass: 'w-10' },
    { id: 'KeyK', label: 'K', widthClass: 'w-10' },
    { id: 'KeyL', label: 'L', widthClass: 'w-10' },
    { id: 'Semicolon', label: ';', shiftLabel: ':', widthClass: 'w-10' },
    { id: 'Quote', label: "'", shiftLabel: '"', widthClass: 'w-10' },
    { id: 'Enter', label: 'Enter', widthClass: 'w-20', isModifier: true },
  ],
  [
    { id: 'ShiftLeft', label: 'Shift', widthClass: 'w-24', isModifier: true },
    { id: 'KeyZ', label: 'Z', widthClass: 'w-10' },
    { id: 'KeyX', label: 'X', widthClass: 'w-10' },
    { id: 'KeyC', label: 'C', widthClass: 'w-10' },
    { id: 'KeyV', label: 'V', widthClass: 'w-10' },
    { id: 'KeyB', label: 'B', widthClass: 'w-10' },
    { id: 'KeyN', label: 'N', widthClass: 'w-10' },
    { id: 'KeyM', label: 'M', widthClass: 'w-10' },
    { id: 'Comma', label: ',', shiftLabel: '<', widthClass: 'w-10' },
    { id: 'Period', label: '.', shiftLabel: '>', widthClass: 'w-10' },
    { id: 'Slash', label: '/', shiftLabel: '?', widthClass: 'w-10' },
    { id: 'ShiftRight', label: 'Shift', widthClass: 'w-24', isModifier: true },
  ],
  [
    { id: 'ControlLeft', label: 'Ctrl', widthClass: 'w-14', isModifier: true },
    { id: 'MetaLeft', label: 'Cmd', widthClass: 'w-14', isModifier: true },
    { id: 'AltLeft', label: 'Alt', widthClass: 'w-12', isModifier: true },
    { id: 'Space', label: 'Spasi', widthClass: 'flex-1 min-w-[180px]' },
    { id: 'AltRight', label: 'Alt', widthClass: 'w-12', isModifier: true },
    { id: 'ControlRight', label: 'Ctrl', widthClass: 'w-14', isModifier: true },
  ],
];

interface IsometricKeyboard3DProps {
  highlightKeyId?: string | null;
  highlightShift?: boolean;
  highlightShortcutKey?: 'A' | 'C' | 'X' | 'V' | 'Z' | null;
  osMode: OSMode;
  capsLockOn?: boolean;
  showHint?: boolean;
  caption?: string;
}

export function IsometricKeyboard3D({
  highlightKeyId,
  highlightShift = false,
  highlightShortcutKey = null,
  osMode,
  capsLockOn = false,
  showHint = true,
  caption,
}: IsometricKeyboard3DProps) {
  const [pressedCodes, setPressedCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedCodes((prev) => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedCodes((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    const handleBlur = () => {
      setPressedCodes(new Set());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const isTargetHighlighted = (keyId: string): boolean => {
    if (!showHint) return false;
    if (highlightKeyId && keyId === highlightKeyId) return true;
    if (highlightShift && (keyId === 'ShiftLeft' || keyId === 'ShiftRight')) return true;
    if (highlightShortcutKey) {
      if (osMode === 'mac' && keyId === 'MetaLeft') return true;
      if (osMode === 'windows' && (keyId === 'ControlLeft' || keyId === 'ControlRight')) return true;
      if (keyId === `Key${highlightShortcutKey}`) return true;
    }
    return false;
  };

  return (
    <div className="w-full select-none">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-900/90 p-3 sm:p-4 shadow-[0_8px_0_0_#cbd5e1] dark:shadow-[0_8px_0_0_#020617]">
        {caption && (
          <div className="mb-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium">{caption}</span>
            <span className="font-mono-code text-slate-500 dark:text-slate-400">
              {osMode === 'mac' ? 'Tata letak Mac (Cmd)' : 'Tata letak Windows (Ctrl)'}
            </span>
          </div>
        )}
        <div className="overflow-x-auto pb-1">
          <div className="mx-auto flex min-w-[640px] max-w-[760px] flex-col gap-2">
            {KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1.5">
                {row.map((keyDef) => {
                  const isPressed = pressedCodes.has(keyDef.id);
                  const isHighlighted = isTargetHighlighted(keyDef.id);
                  const isShiftKey = keyDef.id === 'ShiftLeft' || keyDef.id === 'ShiftRight';
                  const isCaps = keyDef.id === 'CapsLock' && capsLockOn;
                  const displayLabel =
                    keyDef.id === 'MetaLeft'
                      ? osMode === 'mac'
                        ? 'Cmd ⌘'
                        : 'Win'
                      : keyDef.label;

                  let surfaceClasses =
                    'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 shadow-[0_4px_0_0_#cbd5e1] dark:shadow-[0_4px_0_0_#0f172a]';

                  if (isCaps) {
                    surfaceClasses =
                      'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-600 shadow-[0_4px_0_0_#d97706]';
                  } else if (isHighlighted) {
                    surfaceClasses = isShiftKey
                      ? 'bg-amber-400 dark:bg-amber-500 text-slate-950 border-amber-600 dark:border-amber-400 shadow-[0_4px_0_0_#b45309]'
                      : 'bg-blue-600 dark:bg-blue-500 text-white border-blue-700 dark:border-blue-400 shadow-[0_4px_0_0_#1e40af]';
                  }

                  return (
                    <div
                      key={keyDef.id}
                      aria-label={displayLabel}
                      className={`relative flex h-11 ${keyDef.widthClass || 'w-10'} flex-col items-center justify-center rounded-lg border text-xs font-semibold transition-transform duration-75 ${surfaceClasses} ${
                        isPressed ? 'translate-y-[3px] !shadow-[0_1px_0_0_rgba(15,23,42,0.4)]' : ''
                      }`}
                    >
                      {keyDef.shiftLabel && (
                        <span
                          className={`text-[10px] leading-none ${
                            isHighlighted
                              ? 'text-blue-100 dark:text-blue-50'
                              : 'text-slate-400 dark:text-slate-400'
                          }`}
                        >
                          {keyDef.shiftLabel}
                        </span>
                      )}
                      <span className="leading-tight font-mono-code">{displayLabel}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
