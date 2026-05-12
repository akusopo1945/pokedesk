import React, { useState } from 'react';
import { usePetStore } from '../../stores/petStore';
import { useTaskStore } from '../../stores/taskStore';
import { useNoteStore } from '../../stores/noteStore';
import { MOOD_EMOJIS } from '../../constants';
import UpdateBanner from './UpdateBanner';

export default function TopBar({ updateInfo, onDismissUpdate }) {
  const petName = usePetStore((s) => s.petName);
  const level = usePetStore((s) => s.level);
  const getExpProgress = usePetStore((s) => s.getExpProgress);
  const getMood = usePetStore((s) => s.getMood);
  const getCurrentForm = usePetStore((s) => s.getCurrentForm);
  const totalTasksDone = useTaskStore((s) => s.totalCompleted);
  const totalNotes = useNoteStore((s) => s.totalCreated);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const form = getCurrentForm();
  const mood = getMood();
  const expProgress = getExpProgress();

  const handleToggleFullscreen = async () => {
    const result = await window.electronAPI?.toggleFullscreen();
    setIsFullscreen(result);
  };

  return (
    <header className="h-14 bg-pokedex-card/80 backdrop-blur-sm border-b border-pokedex-surface
      flex items-center justify-between px-5 titlebar-drag">

      {/* Left: Pet info */}
      <div className="flex items-center gap-3 titlebar-no-drag">
        <span className="text-2xl">{form?.emoji}</span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{petName}</span>
            <span className="text-pokedex-yellow pixel-text text-[8px]">Lv.{level}</span>
            <span className="text-sm">{MOOD_EMOJIS[mood]}</span>
          </div>
          <div className="w-32 h-1.5 bg-pokedex-surface rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-pokedex-yellow rounded-full stat-bar-fill"
              style={{ width: `${expProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center: Update banner */}
      <div className="flex items-center gap-2 titlebar-no-drag">
        <span className="pixel-text text-pokedex-yellow text-xs">PokeDesk</span>
        {updateInfo?.hasUpdate && (
          <UpdateBanner updateInfo={updateInfo} onDismiss={onDismissUpdate} />
        )}
      </div>

      {/* Right: Quick stats + window controls */}
      <div className="flex items-center gap-4 titlebar-no-drag">
        <div className="flex items-center gap-3 text-xs text-pokedex-muted">
          <span>✅ {totalTasksDone}</span>
          <span>📝 {totalNotes}</span>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => window.electronAPI?.minimize()}
            className="w-7 h-7 rounded hover:bg-pokedex-surface flex items-center justify-center
              text-pokedex-muted hover:text-white transition-colors"
          >
            ─
          </button>
          <button
            onClick={handleToggleFullscreen}
            className="w-7 h-7 rounded hover:bg-pokedex-surface flex items-center justify-center
              text-pokedex-muted hover:text-white transition-colors"
          >
            {isFullscreen ? '❐' : '□'}
          </button>
          <button
            onClick={() => window.electronAPI?.close()}
            className="w-7 h-7 rounded hover:bg-red-500/80 flex items-center justify-center
              text-pokedex-muted hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </header>
  );
}
