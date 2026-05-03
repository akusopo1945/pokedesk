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
import AchievementPopup from './components/Common/AchievementPopup';
import { useAchievementStore } from './stores/achievementStore';
import { useTaskStore } from './stores/taskStore';
import { useNoteStore } from './stores/noteStore';
import { useTimerStore } from './stores/timerStore';

function App() {
  const isInitialized = usePetStore((s) => s.isInitialized);
  const [activeTab, setActiveTab] = useState('pet');
  const recentUnlock = useAchievementStore((s) => s.recentUnlock);
  const clearRecentUnlock = useAchievementStore((s) => s.clearRecentUnlock);

  // Stat decay interval
  useEffect(() => {
    if (!isInitialized) return;
    const interval = setInterval(() => {
      usePetStore.getState().decayStats();
    }, 60000);
    return () => clearInterval(interval);
  }, [isInitialized]);

  // Check achievements periodically
  useEffect(() => {
    if (!isInitialized) return;
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
    check(); // Run once immediately
    return () => clearInterval(interval);
  }, [isInitialized]);

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
        <TopBar />
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
