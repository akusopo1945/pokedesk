// EXP reward constants
export const EXP_REWARDS = {
  TASK_COMPLETE: 10,
  NOTE_CREATE: 3,
  POMODORO_COMPLETE: 15,
  MINI_GAME_WIN: 5,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 50,
  FEED: 2,
  PET: 1,
};

export function calculateStreakBonus(streakDays) {
  if (streakDays >= 30) return EXP_REWARDS.STREAK_BONUS * 3;
  if (streakDays >= 14) return EXP_REWARDS.STREAK_BONUS * 2;
  if (streakDays >= 7) return EXP_REWARDS.STREAK_BONUS;
  return 0;
}

export function calculatePriorityBonus(priority) {
  switch (priority) {
    case 'high': return 5;
    case 'medium': return 2;
    case 'low': return 0;
    default: return 0;
  }
}
