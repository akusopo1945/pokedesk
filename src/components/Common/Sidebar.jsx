import React from 'react';
import { usePetStore } from '../../stores/petStore';
import { useTaskStore } from '../../stores/taskStore';

const TABS = [
  { id: 'pet', icon: '🐾', label: 'Pet', color: 'from-orange-500 to-red-500' },
  { id: 'notes', icon: '📝', label: 'Notes', color: 'from-yellow-500 to-amber-500' },
  { id: 'tasks', icon: '✅', label: 'Tasks', color: 'from-green-500 to-emerald-500' },
  { id: 'timer', icon: '⏱️', label: 'Timer', color: 'from-blue-500 to-cyan-500' },
  { id: 'stats', icon: '📊', label: 'Stats', color: 'from-purple-500 to-pink-500' },
];

export default function Sidebar({ activeTab, onTabChange }) {
  const petForm = usePetStore((s) => s.getCurrentForm());
  const level = usePetStore((s) => s.level);
  const overdueTasks = useTaskStore((s) => s.getOverdueTasks());

  return (
    <aside className="w-20 bg-pokedex-card border-r border-pokedex-surface flex flex-col items-center py-4 gap-1">
      {/* Logo */}
      <div className="mb-4 text-center">
        <div className="text-2xl">🎮</div>
        <div className="pixel-text text-[7px] text-pokedex-yellow mt-1">PD</div>
      </div>

      {/* Pet mini avatar */}
      {petForm && (
        <div className="mb-3 text-center">
          <div className="text-2xl">{petForm.emoji}</div>
          <div className="pixel-text text-[7px] text-pokedex-muted mt-0.5">Lv.{level}</div>
        </div>
      )}

      <div className="w-10 h-px bg-pokedex-surface mb-3" />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 w-full px-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasNotif = tab.id === 'tasks' && overdueTasks.length > 0;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex flex-col items-center gap-0.5 py-2.5 rounded-xl transition-all
                ${isActive
                  ? 'bg-gradient-to-br ' + tab.color + ' text-white shadow-lg'
                  : 'text-pokedex-muted hover:text-white hover:bg-pokedex-surface'
                }
              `}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[9px] font-medium">{tab.label}</span>
              {hasNotif && (
                <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto">
        <div className="w-10 h-px bg-pokedex-surface mb-3" />
        <button
          onClick={() => window.electronAPI?.togglePet()}
          className="text-pokedex-muted hover:text-pokedex-yellow transition-colors p-2"
          title="Toggle Desktop Pet"
        >
          <span className="text-lg">🖼️</span>
        </button>
      </div>
    </aside>
  );
}
