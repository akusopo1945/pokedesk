import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const NOTE_COLORS = ['#FACC15', '#FB923C', '#F87171', '#A78BFA', '#60A5FA', '#34D399', '#F472B6'];

export const useNoteStore = create(
  persist(
    (set, get) => ({
      notes: [],
      totalCreated: 0,
      activeTagFilter: null,

      addNote: (title, content, color, tags = []) => {
        const note = {
          id: Date.now().toString(),
          title: title || 'Catatan Baru',
          content: content || '',
          color: color || NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
          tags: tags,
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

      addTagToNote: (noteId, tag) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId && !n.tags.includes(tag)
              ? { ...n, tags: [...n.tags, tag], updatedAt: Date.now() }
              : n
          ),
        }));
      },

      removeTagFromNote: (noteId, tag) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId
              ? { ...n, tags: n.tags.filter((t) => t !== tag), updatedAt: Date.now() }
              : n
          ),
        }));
      },

      setActiveTagFilter: (tag) => {
        set({ activeTagFilter: tag });
      },

      getAllTags: () => {
        const { notes } = get();
        const tagSet = new Set();
        notes.forEach((note) => {
          note.tags.forEach((tag) => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
      },

      getFilteredNotes: () => {
        const { notes, activeTagFilter } = get();
        let filtered = [...notes];

        if (activeTagFilter) {
          filtered = filtered.filter((n) => n.tags.includes(activeTagFilter));
        }

        return filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.updatedAt - a.updatedAt;
        });
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
