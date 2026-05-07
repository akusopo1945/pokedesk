import React, { useState, useEffect } from 'react';
import { usePetStore } from './stores/petStore';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Common/Sidebar';
import TopBar from './components/Common/TopBar';
import PetPanel from './components/Pet/PetPanel';
import NoteBoard from './components/Notes/NoteBoard';
import TaskBoard from './components/Tasks/TaskBoard';
import PomodoroTimer from './components/Timer/PomodoroTimer';
import PokeStats from './components/Pet/PokeStats';
import PetWidget from './components/Pet/PetWidget';
import AchievementPopup from './components/Common/AchievementPopup';
import { useAchievementStore } from './stores/achievementStore';
import { useTaskStore } from './stores/taskStore';
import { useNoteStore } from './stores/noteStore';
import { useTimerStore } from './stores/timerStore';
import { checkForUpdate, shouldCheckForUpdate } from './services/updateService';

function App() {
  const isInitialized = usePetStore((s) => s.isInitialized);
  const [activeTab, setActiveTab] = useState('pet');
  const [updateInfo, setUpdateInfo] = useState(null);
  const recentUnlock = useAchievementStore((s) => s.recentUnlock);
  const clearRecentUnlock = useAchievementStore((s) => s.clearRecentUnlock);

  const isPetWidget = window.location.hash === '#/pet-widget';

  // IPC listener for tab switching from pet widget
  useEffect(() => {
    window.electronAPI?.onSetActiveTab?.((tab) => setActiveTab(tab));
  }, []);

  // Auto-update check (setiap 24 jam)
  useEffect(() => {
    if (isPetWidget) return;

    const doCheck = async () => {
      if (!shouldCheckForUpdate()) return;

      const version = await window.electronAPI?.getAppVersion();
      if (!version) return;

      const result = await checkForUpdate(version);
      if (result.hasUpdate) {
        setUpdateInfo(result);
      }
    };

    doCheck();
  }, [isPetWidget]);

  // Stat decay interval
  useEffect(() => {
    if (!isInitialized || isPetWidget) return;
    const interval = setInterval(() => {
      usePetStore.getState().decayStats();
    }, 60000);
    return () => clearInterval(interval);
  }, [isInitialized, isPetWidget]);

  // Check achievements periodically
  useEffect(() => {
    if (!isInitialized || isPetWidget) return;
    const check = () => {
      const pet = usePetStore.getState();
      const taskStore = useTaskStore.getState();
      const noteStore = useNoteStore.getState();
      const timerStore = useTimerStore.getState();

      useAchievementStore.getState().checkAchievements({
        tasksCompleted: taskStore.totalCompleted,
        notesCreated: noteStore.totalCreated,
        pomodorosCompleted: timerStore.totalSessionsCompleted,
        streak: 1,
        evolutionStage: pet.evolutionStage,
        petLevel: pet.level,
        feedCount: pet.feedCount,
        happiness: pet.happiness,
      });
    };

    const interval = setInterval(check, 5000);
    check();
    return () => clearInterval(interval);
  }, [isInitialized, isPetWidget]);

  // ─── Pet Widget Route ───
  if (isPetWidget) {
    if (!isInitialized) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="bg-pokedex-card/90 border border-pokedex-surface rounded-lg px-3 py-2
              text-pokedex-muted text-[10px] text-center shadow-lg"
          >
            Buka PokeDesk<br />dulu ya! 🐾
          </div>
        </div>
      );
    }
    return <PetWidget />;
  }

  // ─── Main App ───
  if (!isInitialized) {
    return <Onboarding />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'pet':
        return <PetPanel />;
      case 'notes':
        return <NoteBoard />;
      case 'tasks':
        return <TaskBoard />;
      case 'timer':
        return <PomodoroTimer />;
      case 'stats':
        return <PokeStats />;
      default:
        return <PetPanel />;
    }
  };

  return (
    <div className="flex h-screen bg-pokedex-bg overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          updateInfo={updateInfo}
          onDismissUpdate={() => setUpdateInfo(null)}
        />
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>

      {recentUnlock && (
        <AchievementPopup
          achievement={recentUnlock}
          onClose={clearRecentUnlock}
        />
      )}
    </div>
  );
}

export default App;
