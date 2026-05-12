import { useEffect, useCallback } from 'react';

/**
 * Custom hook untuk keyboard shortcuts
 *
 * Shortcuts:
 * - Ctrl+1: Tab Pet
 * - Ctrl+2: Tab Notes
 * - Ctrl+3: Tab Tasks
 * - Ctrl+4: Tab Timer
 * - Ctrl+5: Tab Stats
 * - Ctrl+N: Buat Note baru (jika di tab Notes)
 * - Ctrl+T: Buat Task baru (jika di tab Tasks)
 * - Ctrl+P: Toggle Pet Widget
 * - Escape: Tutup modal/overlay
 */
export function useKeyboardShortcuts({
  onTabChange,
  onTogglePet,
  activeTab,
  enabled = true,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (!enabled) return;

      // Tab shortcuts: Ctrl+1-5
      if (e.ctrlKey || e.metaKey) {
        const tabMap = {
          '1': 'pet',
          '2': 'notes',
          '3': 'tasks',
          '4': 'timer',
          '5': 'stats',
        };

        const key = e.key;
        if (tabMap[key]) {
          e.preventDefault();
          onTabChange?.(tabMap[key]);
          return;
        }

        // Ctrl+P: Toggle Pet Widget
        if (key === 'p' || key === 'P') {
          e.preventDefault();
          onTogglePet?.();
          return;
        }
      }
    },
    [enabled, onTabChange, onTogglePet, activeTab]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}

/**
 * Shortcut definitions untuk display di UI
 */
export const SHORTCUTS = [
  { keys: ['Ctrl', '1'], description: 'Tab Pet', category: 'Navigasi' },
  { keys: ['Ctrl', '2'], description: 'Tab Notes', category: 'Navigasi' },
  { keys: ['Ctrl', '3'], description: 'Tab Tasks', category: 'Navigasi' },
  { keys: ['Ctrl', '4'], description: 'Tab Timer', category: 'Navigasi' },
  { keys: ['Ctrl', '5'], description: 'Tab Stats', category: 'Navigasi' },
  { keys: ['Ctrl', 'P'], description: 'Toggle Pet Widget', category: 'Widget' },
  { keys: ['Esc'], description: 'Tutup Modal', category: 'Umum' },
];
