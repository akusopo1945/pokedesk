import React, { useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { usePetStore } from '../../stores/petStore';
import { EXP_REWARDS, calculatePriorityBonus } from '../../services/expService';
import { TASK_COLUMNS, PRIORITIES } from '../../constants';

const COLUMNS = TASK_COLUMNS;

export default function TaskBoard() {
  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const completeTask = useTaskStore((s) => s.completeTask);
  const moveTask = useTaskStore((s) => s.moveTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const addExp = usePetStore((s) => s.addExp);
  const addIntelligence = usePetStore((s) => s.addIntelligence);

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDeadline, setNewDeadline] = useState('');

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const deadline = newDeadline ? new Date(newDeadline).getTime() : null;
    addTask(newTitle.trim(), newDesc.trim(), newPriority, deadline);
    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setNewDeadline('');
    setIsCreating(false);
  };

  const handleComplete = (id) => {
    const task = completeTask(id);
    if (task) {
      const bonus = calculatePriorityBonus(task.priority);
      const totalExp = EXP_REWARDS.TASK_COMPLETE + bonus;
      addExp(totalExp);
      addIntelligence(2);
    }
  };

  const handleMove = (id, direction) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const statusOrder = ['todo', 'in_progress', 'done'];
    const currentIdx = statusOrder.indexOf(task.status);
    const newIdx = Math.max(0, Math.min(2, currentIdx + direction));
    if (statusOrder[newIdx] === 'done') {
      handleComplete(id);
    } else {
      moveTask(id, statusOrder[newIdx]);
    }
  };

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const isOverdue = (task) => {
    return task.deadline && task.deadline < Date.now() && task.status !== 'done';
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ✅ PokeTasks
            </h2>
            <p className="text-pokedex-muted text-sm mt-0.5">
              {tasks.filter((t) => t.status === 'done').length}/{tasks.length} selesai ·
              +{EXP_REWARDS.TASK_COMPLETE} EXP per task
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-green-500 to-emerald-500 text-white
              hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/20"
          >
            <span>+</span> Task Baru
          </button>
        </div>

        {/* Create Task Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pokedex-card border border-pokedex-surface rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Buat Task Baru</h3>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Judul task..."
                className="w-full bg-pokedex-surface border border-pokedex-surface rounded-xl
                  px-4 py-2.5 text-white text-sm mb-3
                  focus:border-pokedex-yellow focus:outline-none transition-colors
                  placeholder:text-pokedex-muted"
                autoFocus
              />

              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Deskripsi (opsional)..."
                rows={3}
                className="w-full bg-pokedex-surface border border-pokedex-surface rounded-xl
                  px-4 py-2.5 text-white text-sm mb-3 resize-none
                  focus:border-pokedex-yellow focus:outline-none transition-colors
                  placeholder:text-pokedex-muted"
              />

              {/* Priority */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-pokedex-muted">Prioritas:</span>
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setNewPriority(p.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${newPriority === p.id
                        ? 'bg-pokedex-surface text-white ring-1 ring-white/20'
                        : 'text-pokedex-muted hover:text-white'
                      }`}
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-pokedex-muted">Deadline:</span>
                <input
                  type="datetime-local"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="bg-pokedex-surface border border-pokedex-surface rounded-lg
                    px-3 py-1.5 text-white text-xs
                    focus:border-pokedex-yellow focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-pokedex-muted hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreate}
                  className="px-5 py-2 rounded-xl font-semibold text-sm
                    bg-pokedex-yellow text-pokedex-bg hover:bg-yellow-300 transition-colors"
                >
                  Buat Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Columns */}
        <div className="grid grid-cols-3 gap-4">
          {COLUMNS.map((col) => {
            const columnTasks = getTasksByStatus(col.id);
            return (
              <div key={col.id} className="min-h-[400px]">
                {/* Column Header */}
                <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${col.color}`}>
                  <span>{col.icon}</span>
                  <span className="font-semibold text-white text-sm">{col.label}</span>
                  <span className="text-pokedex-muted text-xs ml-auto">{columnTasks.length}</span>
                </div>

                {/* Tasks */}
                <div className="flex flex-col gap-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`bg-pokedex-card border rounded-xl p-3 card-hover group
                        ${isOverdue(task) ? 'border-red-500/50' : 'border-pokedex-surface'}`}
                    >
                      {/* Priority indicator */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs">
                          {PRIORITIES.find((p) => p.id === task.priority)?.emoji}
                        </span>
                        <h4 className={`text-sm font-medium flex-1 ${
                          task.status === 'done' ? 'line-through text-pokedex-muted' : 'text-white'
                        }`}>
                          {task.title}
                        </h4>
                      </div>

                      {task.description && (
                        <p className="text-xs text-pokedex-muted mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {task.deadline && (
                        <div className={`text-[10px] mb-2 ${
                          isOverdue(task) ? 'text-red-400 font-semibold' : 'text-pokedex-muted'
                        }`}>
                          📅 {new Date(task.deadline).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {isOverdue(task) && ' ⚠️ TERLAMBAT'}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => handleMove(task.id, -1)}
                            className="text-xs px-2 py-1 rounded bg-pokedex-surface text-pokedex-muted
                              hover:text-white transition-colors"
                          >
                            ←
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => handleMove(task.id, 1)}
                            className="text-xs px-2 py-1 rounded bg-pokedex-surface text-pokedex-muted
                              hover:text-white transition-colors"
                          >
                            →
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-xs px-2 py-1 rounded text-pokedex-muted
                            hover:text-red-400 transition-colors ml-auto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-pokedex-muted text-xs">
                      Kosong
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
