import React, { useState, useEffect, useRef } from 'react';
import { useGameStore, type InspectingNote } from '../store/gameStore';
import { X, Edit3, Check, Trash2, RotateCcw, Pin } from 'lucide-react';
import { sounds } from '../services/audio';

const InspectNoteCard: React.FC<{ note: InspectingNote }> = ({ note }) => {
  const { closeInspectNote, updateCustomNote, deleteCustomNote } = useGameStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    sounds.playPaper();
    setEditText(note.text);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim().length === 0) return;
    updateCustomNote(note.id, editText.trim());
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    sounds.playPaper();
    setEditText(note.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Bu dedektif notunu panodan silmek istediğinizden emin misiniz?')) {
      deleteCustomNote(note.id);
      closeInspectNote();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isEditing) {
        handleCancelEdit();
      } else {
        closeInspectNote();
      }
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      if (isEditing) {
        handleSave();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={closeInspectNote} />

      {/* Note Container */}
      <div 
        className="relative w-full max-w-lg max-h-[96dvh] sm:max-h-[90vh] overflow-y-auto bg-[#fef08a] text-zinc-950 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-t-8 border-yellow-400 p-4 sm:p-6 md:p-8 pt-6 sm:pt-8 transform transition-all select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Realistic 3D Pushpin */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
          <div className="w-8 h-8 rounded-full border-2 border-white shadow-[0_4px_8px_rgba(0,0,0,0.6)] flex items-center justify-center bg-red-700">
            <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-inner" />
          </div>
        </div>

        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-yellow-300 pb-3 mb-4 mt-1">
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-red-800 rotate-45" />
            <h4 className="font-police font-bold text-xs sm:text-sm text-red-950 uppercase tracking-widest">
              {note.title || 'DEDEKTİF NOTU'}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {note.isCustom && !isEditing && (
              <>
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-300/80 hover:bg-yellow-400 text-yellow-950 font-police text-xs font-bold transition-colors cursor-pointer"
                  title="Notu Düzenle"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Düzenle
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 rounded text-zinc-600 hover:text-red-700 hover:bg-yellow-300/60 transition-colors cursor-pointer"
                  title="Notu Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={closeInspectNote}
              className="p-1 rounded text-zinc-600 hover:text-zinc-950 hover:bg-yellow-300/60 transition-colors cursor-pointer ml-1"
              title="Kapat (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Note Content / Editor */}
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full h-48 p-4 font-handwriting text-2xl text-zinc-950 bg-yellow-100/90 border-2 border-yellow-400 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-relaxed"
              placeholder="Dedektif notunuzu yazın..."
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-police text-yellow-900/80">
                Kaydetmek için <kbd className="px-1.5 py-0.5 bg-yellow-200 rounded border border-yellow-400">Ctrl/⌘+Enter</kbd>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-yellow-500/50 bg-yellow-200 hover:bg-yellow-300 text-yellow-950 font-police text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  disabled={editText.trim().length === 0}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white font-police text-xs font-bold transition-colors shadow cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[160px] flex flex-col justify-between">
            <div className="font-handwriting text-2xl sm:text-3xl text-zinc-950 leading-relaxed whitespace-pre-wrap select-text py-2">
              {note.text}
            </div>

            {note.isCustom && (
              <div className="mt-6 pt-3 border-t border-yellow-300/80 flex justify-between items-center text-xs text-yellow-950/70 font-police">
                <span>Notu düzenlemek için yukarıdaki "Düzenle" butonunu kullanabilirsiniz.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const InspectNoteModal: React.FC = () => {
  const { inspectingNote } = useGameStore();

  if (!inspectingNote) return null;

  return <InspectNoteCard key={inspectingNote.id} note={inspectingNote} />;
};
