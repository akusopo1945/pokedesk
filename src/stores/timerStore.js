import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const POMODORO_DURATION = 25 * 60; // 25 menit dalam detik
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

export const useTimerStore = create(
  persist(
    (set, get) => ({
      // Timer state
      isRunning: false,
      isPaused: false,
      mode: 'work', // 'work' | 'short_break' | 'long_break'
      secondsRemaining: POMODORO_DURATION,
      sessionsCompleted: 0,
      totalSessionsCompleted: 0,
      currentTaskId: null,

      // Stats
      todaySessions: 0,
      todayFocusMinutes: 0,
      lastSessionDate: null,

      // Actions
      start: (taskId) => {
        set({
          isRunning: true,
          isPaused: false,
          currentTaskId: taskId || null,
        });
      },

      pause: () => {
        set({ isPaused: true });
      },

      resume: () => {
        set({ isPaused: false });
      },

      stop: () => {
        set({
          isRunning: false,
          isPaused: false,
          secondsRemaining: POMODORO_DURATION,
          mode: 'work',
          currentTaskId: null,
        });
      },

      tick: () => {
        const { secondsRemaining, isRunning, isPaused, mode, sessionsCompleted, totalSessionsCompleted, todaySessions, todayFocusMinutes } = get();
        if (!isRunning || isPaused) return;

        if (secondsRemaining <= 1) {
          // Sesi selesai
          if (mode === 'work') {
            const newSessions = sessionsCompleted + 1;
            const isLongBreak = newSessions % 4 === 0;
            set({
              isRunning: false,
              secondsRemaining: isLongBreak ? LONG_BREAK : SHORT_BREAK,
              mode: isLongBreak ? 'long_break' : 'short_break',
              sessionsCompleted: newSessions,
              totalSessionsCompleted: totalSessionsCompleted + 1,
              todaySessions: todaySessions + 1,
              todayFocusMinutes: todayFocusMinutes + 25,
              lastSessionDate: new Date().toDateString(),
            });
            return 'work_complete';
          } else {
            set({
              isRunning: false,
              secondsRemaining: POMODORO_DURATION,
              mode: 'work',
            });
            return 'break_complete';
          }
        }

        set({ secondsRemaining: secondsRemaining - 1 });
        return null;
      },

      getProgress: () => {
        const { secondsRemaining, mode } = get();
        const total = mode === 'work' ? POMODORO_DURATION : mode === 'long_break' ? LONG_BREAK : SHORT_BREAK;
        return ((total - secondsRemaining) / total) * 100;
      },

      getFormattedTime: () => {
        const { secondsRemaining } = get();
        const mins = Math.floor(secondsRemaining / 60);
        const secs = secondsRemaining % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      },

      resetTodayStats: () => {
        const { lastSessionDate } = get();
        const today = new Date().toDateString();
        if (lastSessionDate !== today) {
          set({ todaySessions: 0, todayFocusMinutes: 0 });
        }
      },
    }),
    {
      name: 'pokedesk-timer',
      partialize: (state) => ({
        sessionsCompleted: state.sessionsCompleted,
        totalSessionsCompleted: state.totalSessionsCompleted,
        todaySessions: state.todaySessions,
        todayFocusMinutes: state.todayFocusMinutes,
        lastSessionDate: state.lastSessionDate,
      }),
    }
  )
);
