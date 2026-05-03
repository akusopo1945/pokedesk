import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      totalCompleted: 0,

      addTask: (title, description, priority, deadline) => {
        const task = {
          id: Date.now().toString(),
          title,
          description: description || '',
          priority: priority || 'medium',
          status: 'todo',
          deadline: deadline || null,
          parentId: null,
          createdAt: Date.now(),
          completedAt: null,
        };
        set((state) => ({ tasks: [task, ...state.tasks] }));
        return task;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      completeTask: (id) => {
        const { tasks, totalCompleted } = get();
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        set({
          tasks: tasks.map((t) =>
            t.id === id
              ? { ...t, status: 'done', completedAt: Date.now() }
              : t
          ),
          totalCompleted: totalCompleted + 1,
        });
        return task;
      },

      moveTask: (id, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: newStatus } : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      getTasksByStatus: (status) => {
        return get().tasks.filter((t) => t.status === status);
      },

      getOverdueTasks: () => {
        const now = Date.now();
        return get().tasks.filter(
          (t) => t.deadline && t.deadline < now && t.status !== 'done'
        );
      },
    }),
    {
      name: 'pokedesk-tasks',
    }
  )
);
