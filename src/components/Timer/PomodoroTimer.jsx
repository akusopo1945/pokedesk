import React, { useEffect, useRef } from 'react';
import { useTimerStore } from '../../stores/timerStore';
import { usePetStore } from '../../stores/petStore';
import { EXP_REWARDS } from '../../services/expService';
import { TIMER_MODES } from '../../constants';

const MODE_CONFIG = {
  work: TIMER_MODES.WORK,
  short_break: TIMER_MODES.SHORT_BREAK,
  long_break: TIMER_MODES.LONG_BREAK,
};

export default function PomodoroTimer() {
  const {
    isRunning, isPaused, mode, secondsRemaining,
    sessionsCompleted, todaySessions, todayFocusMinutes,
    start, pause, resume, stop, tick, getProgress, getFormattedTime,
  } = useTimerStore();

  const addExp = usePetStore((s) => s.addExp);
  const addIntelligence = usePetStore((s) => s.addIntelligence);
  const restoreEnergy = usePetStore((s) => s.restoreEnergy);
  const petName = usePetStore((s) => s.petName);

  const timerRef = useRef(null);
  const prevModeRef = useRef(mode);

  const config = MODE_CONFIG[mode];
  const progress = getProgress();

  // Timer tick
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        const result = tick();
        if (result === 'work_complete') {
          addExp(EXP_REWARDS.POMODORO_COMPLETE);
          addIntelligence(5);
        } else if (result === 'break_complete') {
          restoreEnergy(20);
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isPaused]);

  // SVG circle dimensions
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Mode Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-2xl">{config.emoji}</span>
          <h2 className="text-xl font-bold text-white">{config.label}</h2>
        </div>

        {/* Timer Circle */}
        <div className="relative inline-block mb-8">
          <svg width="280" height="280" className="-rotate-90">
            {/* Background circle */}
            <circle
              cx="140" cy="140" r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="140" cy="140" r={radius}
              fill="none"
              stroke={config.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
              style={{ filter: `drop-shadow(0 0 8px ${config.ring}40)` }}
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white font-mono tracking-wider">
              {getFormattedTime()}
            </span>
            <span className="text-pokedex-muted text-sm mt-1">
              Sesi ke-{sessionsCompleted + 1}
            </span>
          </div>
        </div>

        {/* Pet companion message */}
        <div className="bg-pokedex-card/60 border border-pokedex-surface rounded-xl px-5 py-3 mb-6">
          <p className="text-pokedex-muted text-sm">
            {mode === 'work'
              ? (isRunning ? `🔥 ${petName} sedang fokus menemanimu...` : `⏱️ Siap untuk sesi fokus?`)
              : `☕ ${petName} sedang bersantai bersamamu!`
            }
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {!isRunning ? (
            <button
              onClick={() => start()}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg
                bg-gradient-to-r ${config.color} text-white
                hover:scale-105 active:scale-95 transition-all shadow-xl`}
            >
              ▶ Mulai
            </button>
          ) : (
            <>
              <button
                onClick={isPaused ? resume : pause}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                  bg-pokedex-surface text-white hover:bg-pokedex-surface/80 transition-all"
              >
                {isPaused ? '▶ Lanjut' : '⏸ Jeda'}
              </button>
              <button
                onClick={stop}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                  bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
              >
                ⏹ Berhenti
              </button>
            </>
          )}
        </div>

        {/* Today Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-pokedex-card border border-pokedex-surface rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{todaySessions}</div>
            <div className="text-xs text-pokedex-muted">Sesi Hari Ini</div>
          </div>
          <div className="bg-pokedex-card border border-pokedex-surface rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{todayFocusMinutes}m</div>
            <div className="text-xs text-pokedex-muted">Waktu Fokus</div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-xs text-pokedex-muted">
          💡 Tip: Setiap sesi fokus = +{EXP_REWARDS.POMODORO_COMPLETE} EXP & +5 Intelligence untuk {petName}
        </div>
      </div>
    </div>
  );
}
