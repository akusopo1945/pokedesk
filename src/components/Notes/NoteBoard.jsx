import React, { useState } from 'react';
import { useNoteStore } from '../../stores/noteStore';
import { usePetStore } from '../../stores/petStore';
import { EXP_REWARDS } from '../../services/expService';

const COLORS = [
  { id: '#FACC15', name: 'Kuning' },
  { id: '#FB923C', name: 'Oranye' },
  { id: '#F87171', name: 'Merah' },
  { id: '#A78BFA', name: 'Ungu' },
  { id: '#60A5FA', name: 'Biru' },
  { id: '#34D399', name: 'Hijau' },
  { id: '#F472B6', name: 'Pink' },
];

export default function NoteBoard() {
  const notes = useNoteStore((s) => s.getSortedNotes());
  const addNote = useNoteStore((s) => s.addNote);
  const updateNote = useNoteStore((s) => s.updateNote);
  const deleteNote = useNoteStore((s) => s.deleteNote);
  const togglePin = useNoteStore((s) => s.togglePin);
  const addExp = usePetStore((s) => s.addExp);

  const [editingNote, setEditingNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState(COLORS[0].id);

  const handleCreate = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    addNote(newTitle.trim() || 'Catatan Baru', newContent.trim(), newColor);
    addExp(EXP_REWARDS.NOTE_CREATE);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const handleUpdate = () => {
    if (!editingNote) return;
    updateNote(editingNote.id, {
      title: editingNote.title,
      content: editingNote.content,
      color: editingNote.color,
    });
    setEditingNote(null);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              📝 PokeNotes
            </h2>
            <p className="text-pokedex-muted text-sm mt-0.5">
              {notes.length} catatan · +{EXP_REWARDS.NOTE_CREATE} EXP per catatan
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-yellow-500 to-amber-500 text-pokedex-bg
              hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-500/20"
          >
            <span>+</span> Note Baru
          </button>
        </div>

        {/* Create Note Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pokedex-card border border-pokedex-surface rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Buat Note Baru</h3>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Judul catatan..."
                className="w-full bg-pokedex-surface border border-pokedex-surface rounded-xl
                  px-4 py-2.5 text-white text-sm mb-3
                  focus:border-pokedex-yellow focus:outline-none transition-colors
                  placeholder:text-pokedex-muted"
                autoFocus
              />

              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Tulis catatanmu di sini..."
                rows={5}
                className="w-full bg-pokedex-surface border border-pokedex-surface rounded-xl
                  px-4 py-2.5 text-white text-sm mb-3 resize-none
                  focus:border-pokedex-yellow focus:outline-none transition-colors
                  placeholder:text-pokedex-muted"
              />

              {/* Color picker */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-pokedex-muted">Warna:</span>
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setNewColor(c.id)}
                    className={`w-6 h-6 rounded-full transition-all ${
                      newColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-pokedex-card scale-110' : ''
                    }`}
                    style={{ backgroundColor: c.id }}
                  />
                ))}
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
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Note Modal */}
        {editingNote && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pokedex-card border border-pokedex-surface rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Edit Note</h3>

              <input
                type="text"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                className="w-full bg-pokedex-surface border border-pokedex-surface rounded-xl
                  px-4 py-2.5 text-white text-sm mb-3
                  focus:border-pokedex-yellow focus:outline-none transition-colors"
              />

              <textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                rows={5}
                className="w-full bg-pokedex-surface border border-pokedex-surface rounded-xl
                  px-4 py-2.5 text-white text-sm mb-3 resize-none
                  focus:border-pokedex-yellow focus:outline-none transition-colors"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 rounded-xl text-pokedex-muted hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2 rounded-xl font-semibold text-sm
                    bg-pokedex-yellow text-pokedex-bg hover:bg-yellow-300 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-pokedex-muted">Belum ada catatan</p>
            <p className="text-pokedex-muted text-sm mt-1">
              Buat catatan pertamamu untuk mendapat +{EXP_REWARDS.NOTE_CREATE} EXP!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl p-4 card-hover cursor-pointer group relative"
                style={{
                  backgroundColor: note.color + '15',
                  borderLeft: `4px solid ${note.color}`,
                }}
                onClick={() => setEditingNote({ ...note })}
              >
                {/* Pin button */}
                <button
                  onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                  className={`absolute top-2 right-2 text-sm transition-all ${
                    note.isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`}
                >
                  {note.isPinned ? '📌' : '📍'}
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="absolute bottom-2 right-2 text-xs text-pokedex-muted
                    opacity-0 group-hover:opacity-50 hover:!opacity-100 hover:text-red-400 transition-all"
                >
                  🗑️
                </button>

                <h4 className="font-semibold text-white text-sm mb-2 pr-6 line-clamp-1">
                  {note.title}
                </h4>
                <p className="text-pokedex-muted text-xs line-clamp-4 whitespace-pre-wrap">
                  {note.content || 'Kosong...'}
                </p>
                <div className="mt-3 text-[10px] text-pokedex-muted">
                  {new Date(note.updatedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
