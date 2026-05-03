import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const NOTE_COLORS = ['#FACC15', '#FB923C', '#F87171', '#A78BFA', '#60A5FA', '#34D399', '#F472B6'];

export const useNoteStore = create(
  persist(
    (set, get) => ({
      notes: [],
      totalCreated: 0,

      addNote: (title, content, color) => {
        const note = {
          id: Date.now().toString(),
          title: title || 'Catatan Baru',
          content: content || '',
          color: color || NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
          tags: [],
          isPinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          notes: [note, ...state.notes],
          totalCreated: state.totalCreated + 1,
        }));
        return note;
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
      },

      togglePin: (id) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, isPinned: !n.isPinned } : n
          ),
        }));
      },

      getSortedNotes: () => {
        const { notes } = get();
        return [...notes].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.updatedAt - a.updatedAt;
        });
      },
    }),
    {
      name: 'pokedesk-notes',
    }
  )
);
