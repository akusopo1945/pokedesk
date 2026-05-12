import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePetStore } from './stores/petStore';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Common/Sidebar';
import TopBar from './components/Common/TopBar';
import PetWidget from './components/Pet/PetWidget';
import AchievementPopup from './components/Common/AchievementPopup';
import { useAchievementStore } from './stores/achievementStore';
import { useTaskStore } from './stores/taskStore';
import { useNoteStore } from './stores/noteStore';
import { useTimerStore } from './stores/timerStore';
import { checkForUpdate, shouldCheckForUpdate } from './services/updateService';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Lazy load tab components
const PetPanel = React.lazy(() => import('./components/Pet/PetPanel'));
const NoteBoard = React.lazy(() => import('./components/Notes/NoteBoard'));
const TaskBoard = React.lazy(() => import('./components/Tasks/TaskBoard'));
const PomodoroTimer = React.lazy(() => import('./components/Timer/PomodoroTimer'));
const PokeStats = React.lazy(() => import('./components/Pet/PokeStats'));

// Achievement check function (dipanggil secara event-driven)
function checkAchievements() {
  const pet = usePetStore.getState();
  const taskStore = useTaskStore.getState();
  const noteStore = useNoteStore.getState();
  const timerStore = useTimerStore.getState();

  useAchievementStore.getState().checkAchievements({
    tasksCompleted: taskStore.totalCompleted,
    notesCreated: noteStore.totalCreated,
    pomodorosCompleted: timerStore.totalSessionsCompleted,
    streak: pet.streakDays || 1,
    evolutionStage: pet.evolutionStage,
    petLevel: pet.level,
    feedCount: pet.feedCount,
    happiness: pet.happiness,
  });
}

// Loading fallback component
function TabLoader() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-pokedex-muted text-sm animate-pulse">Loading...</div>
    </div>
  );
}

function App() {
  const isInitialized = usePetStore((s) => s.isInitialized);
  const [activeTab, setActiveTab] = useState('pet');
  const [updateInfo, setUpdateInfo] = useState(null);
  const [streakInfo, setStreakInfo] = useState(null);
  const recentUnlock = useAchievementStore((s) => s.recentUnlock);
  const clearRecentUnlock = useAchievementStore((s) => s.clearRecentUnlock);
  const isWindowFocused = useRef(true);

  const isPetWidget = window.location.hash === '#/pet-widget';

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onTabChange: setActiveTab,
    onTogglePet: () => window.electronAPI?.togglePet(),
    activeTab,
    enabled: isInitialized && !isPetWidget,
  });

  // IPC listener for tab switching from pet widget
  useEffect(() => {
    window.electronAPI?.onSetActiveTab?.((tab) => setActiveTab(tab));
  }, []);

  // Daily streak check on startup
  useEffect(() => {
    if (!isInitialized || isPetWidget) return;

    const { isNewDay, streakBonus, newStreak } = usePetStore.getState().checkDailyStreak();

    if (isNewDay && streakBonus > 0) {
      // Add streak bonus EXP
      const result = usePetStore.getState().addExp(streakBonus);

      setStreakInfo({
        days: newStreak,
        bonus: streakBonus,
        leveledUp: result.leveledUp,
        newLevel: result.newLevel,
      });

      // Auto-dismiss after 4 seconds
      setTimeout(() => setStreakInfo(null), 4000);
    }
  }, [isInitialized, isPetWidget]);

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

  // ─── Performance: Conditional Stat Decay ───
  // Hanya jalan saat window focused dan user aktif
  useEffect(() => {
    if (!isInitialized || isPetWidget) return;

    const handleVisibilityChange = () => {
      isWindowFocused.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      // Hanya decay saat window focused
      if (isWindowFocused.current) {
        usePetStore.getState().decayStats();
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInitialized, isPetWidget]);

  // ─── Performance: Achievement Check on Mount Only ───
  // Cek sekali saat mount, selanjutanya event-driven
  useEffect(() => {
    if (!isInitialized || isPetWidget) return;

    // Check sekali saat mount
    checkAchievements();

    // Subscribe ke store changes untuk check achievements
    // Hanya check saat ada perubahan signifikan
    const unsubTask = useTaskStore.subscribe((state, prevState) => {
      if (state.totalCompleted !== prevState.totalCompleted) {
        checkAchievements();
      }
    });

    const unsubNote = useNoteStore.subscribe((state, prevState) => {
      if (state.totalCreated !== prevState.totalCreated) {
        checkAchievements();
      }
    });

    const unsubTimer = useTimerStore.subscribe((state, prevState) => {
      if (state.totalSessionsCompleted !== prevState.totalSessionsCompleted) {
        checkAchievements();
      }
    });

    const unsubPet = usePetStore.subscribe((state, prevState) => {
      if (
        state.level !== prevState.level ||
        state.evolutionStage !== prevState.evolutionStage ||
        state.feedCount !== prevState.feedCount ||
        state.happiness !== prevState.happiness
      ) {
        checkAchievements();
      }
    });

    return () => {
      unsubTask();
      unsubNote();
      unsubTimer();
      unsubPet();
    };
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
          <React.Suspense fallback={<TabLoader />}>
            {renderContent()}
          </React.Suspense>
        </main>
      </div>

      {/* Streak Notification */}
      {streakInfo && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-orange-500/90 to-amber-500/90 backdrop-blur-md
            border border-orange-400/50 rounded-2xl px-6 py-4 shadow-2xl
            flex items-center gap-4 min-w-[280px] animate-bounce">
            <div className="text-4xl">🔥</div>
            <div>
              <div className="text-orange-200 text-xs font-bold uppercase tracking-wider">
                Daily Streak!
              </div>
              <div className="text-white font-bold text-lg">
                {streakInfo.days} Hari Berturut-turut!
              </div>
              <div className="text-orange-100/80 text-xs">
                +{streakInfo.bonus} EXP
                {streakInfo.leveledUp && ` • Level Up! Lv.${streakInfo.newLevel}`}
              </div>
            </div>
            <button
              onClick={() => setStreakInfo(null)}
              className="ml-auto text-orange-200/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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
