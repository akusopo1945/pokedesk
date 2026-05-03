import React from 'react';
import { usePetStore } from '../../stores/petStore';
import { useTaskStore } from '../../stores/taskStore';
import { useNoteStore } from '../../stores/noteStore';
import { useTimerStore } from '../../stores/timerStore';
import { useAchievementStore } from '../../stores/achievementStore';

export default function PokeStats() {
  const pet = usePetStore();
  const taskStore = useTaskStore();
  const noteStore = useNoteStore();
  const timerStore = useTimerStore();
  const achievements = useAchievementStore((s) => s.getAllAchievements());
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  const form = pet.getCurrentForm();

  const stats = [
    { icon: '🎯', label: 'Level', value: pet.level, color: 'text-pokedex-yellow' },
    { icon: '✨', label: 'Total EXP', value: pet.exp, color: 'text-amber-400' },
    { icon: '🧠', label: 'Intelligence', value: pet.intelligence, color: 'text-purple-400' },
    { icon: '✅', label: 'Tasks Selesai', value: taskStore.totalCompleted, color: 'text-green-400' },
    { icon: '📝', label: 'Notes Dibuat', value: noteStore.totalCreated, color: 'text-blue-400' },
    { icon: '⏱️', label: 'Pomodoro', value: timerStore.totalSessionsCompleted, color: 'text-cyan-400' },
    { icon: '⏱️', label: 'Fokus Hari Ini', value: `${timerStore.todayFocusMinutes}m`, color: 'text-cyan-300' },
    { icon: '🏆', label: 'Achievements', value: `${unlockedCount}/${achievements.length}`, color: 'text-yellow-400' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{form?.emoji}</div>
          <h2 className="text-2xl font-bold text-white">{pet.petName}</h2>
          <p className="text-pokedex-muted">
            {form?.name} · Level {pet.level}
          </p>
          <div className="mt-2 text-xs text-pokedex-muted">
            Pokémon-mu sejak {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString('id-ID') : '-'}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-pokedex-card border border-pokedex-surface rounded-xl p-4 text-center card-hover"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-pokedex-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <h3 className="text-lg font-bold text-white mb-4">🏆 Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.key}
              className={`border rounded-xl p-3 flex items-center gap-3 transition-all
                ${ach.isUnlocked
                  ? 'bg-pokedex-card border-pokedex-yellow/30 card-hover'
                  : 'bg-pokedex-card/30 border-pokedex-surface opacity-50'
                }`}
            >
              <span className="text-2xl">{ach.isUnlocked ? ach.icon : '🔒'}</span>
              <div>
                <div className={`text-sm font-semibold ${ach.isUnlocked ? 'text-white' : 'text-pokedex-muted'}`}>
                  {ach.name}
                </div>
                <div className="text-xs text-pokedex-muted">{ach.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
