import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import achievementsData from '../../data/achievements.json';

export const useAchievementStore = create(
  persist(
    (set, get) => ({
      unlocked: [], // array of achievement keys
      recentUnlock: null, // untuk notifikasi

      checkAchievements: (stats) => {
        const { unlocked } = get();
        const newUnlocks = [];

        for (const achievement of achievementsData) {
          if (unlocked.includes(achievement.key)) continue;

          let earned = false;
          const cond = achievement.condition;

          if (cond.startsWith('tasks_completed >= ')) {
            earned = stats.tasksCompleted >= parseInt(cond.split('>= ')[1]);
          } else if (cond.startsWith('notes_created >= ')) {
            earned = stats.notesCreated >= parseInt(cond.split('>= ')[1]);
          } else if (cond.startsWith('pomodoros_completed >= ')) {
            earned = stats.pomodorosCompleted >= parseInt(cond.split('>= ')[1]);
          } else if (cond.startsWith('streak >= ')) {
            earned = stats.streak >= parseInt(cond.split('>= ')[1]);
          } else if (cond.startsWith('evolution_stage >= ')) {
            earned = stats.evolutionStage >= parseInt(cond.split('>= ')[1]);
          } else if (cond.startsWith('pet_level >= ')) {
            earned = stats.petLevel >= parseInt(cond.split('>= ')[1]);
          } else if (cond.startsWith('feed_count >= ')) {
            earned = stats.feedCount >= parseInt(cond.split('>= ')[1]);
          } else if (cond.startsWith('happiness >= ')) {
            earned = stats.happiness >= parseInt(cond.split('>= ')[1]);
          }

          if (earned) {
            newUnlocks.push(achievement.key);
          }
        }

        if (newUnlocks.length > 0) {
          const latestKey = newUnlocks[newUnlocks.length - 1];
          const latestAchievement = achievementsData.find((a) => a.key === latestKey);
          set((state) => ({
            unlocked: [...state.unlocked, ...newUnlocks],
            recentUnlock: latestAchievement,
          }));
          return latestAchievement;
        }
        return null;
      },

      clearRecentUnlock: () => {
        set({ recentUnlock: null });
      },

      getUnlockedAchievements: () => {
        const { unlocked } = get();
        return achievementsData.filter((a) => unlocked.includes(a.key));
      },

      getAllAchievements: () => {
        const { unlocked } = get();
        return achievementsData.map((a) => ({
          ...a,
          isUnlocked: unlocked.includes(a.key),
        }));
      },
    }),
    {
      name: 'pokedesk-achievements',
    }
  )
);
