import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({ isOpen, onClose }) => {
  const { timelineEvents, isEvidencePinned, openInspectEvidence } = useGameStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        className="relative w-full max-w-3xl max-h-[96dvh] sm:max-h-[85vh] flex flex-col bg-[#f5ecda] text-zinc-950 rounded-xl shadow-2xl border-2 sm:border-4 border-[#b59e74] overflow-hidden aged-paper"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#cbb68d] px-3 sm:px-6 py-2.5 sm:py-3 border-b-2 border-[#b59e74] shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-900" />
            <h3 className="font-cinzel text-xs sm:text-sm font-bold text-zinc-950 uppercase tracking-wider truncate">
              KRONOLOJİ & ZAMAN ŞERİDİ
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-700 hover:text-red-900 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto font-police flex-1">
          <div className="border-b border-zinc-400 pb-3">
            <p className="font-typewriter text-xs text-zinc-800 leading-relaxed">
              Olay gecesi saat saat gerçekleşen eylemler, tanık ifadeleri ve saha delilleriyle doğrulanmış zaman çizelgesi.
            </p>
          </div>

          <div className="relative pl-6 md:pl-8 border-l-4 border-amber-800/40 space-y-6">
            {timelineEvents.map((evt) => {
              const hasEvidence = evt.associatedEvidenceId && isEvidencePinned(evt.associatedEvidenceId);

              return (
                <div key={evt.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-[#cbb68d] border-2 border-amber-900 flex items-center justify-center shadow-md">
                    <Clock className="w-3.5 h-3.5 text-amber-900" />
                  </div>

                  <div className="bg-white/70 p-4 rounded-lg border border-zinc-300 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-200 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-zinc-900 text-amber-400 px-2 py-0.5 rounded font-bold text-xs font-typewriter">
                          {evt.time}
                        </span>
                        <h4 className="font-bold text-xs text-zinc-950">
                          {evt.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-bold">
                        {evt.isVerified ? (
                          <span className="text-emerald-800 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Doğrulandı
                          </span>
                        ) : (
                          <span className="text-amber-800 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Şüpheli İfade
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="font-typewriter text-xs text-zinc-800 leading-relaxed">
                      {evt.description}
                    </p>

                    {evt.associatedEvidenceId && (
                      <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-zinc-600 font-handwriting">
                          *İlgili Kanıt: {evt.associatedEvidenceId}
                        </span>
                        {hasEvidence ? (
                          <button
                            onClick={() => openInspectEvidence(evt.associatedEvidenceId!)}
                            className="text-blue-900 hover:text-blue-950 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Kanıtı İncele</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-amber-900 font-bold text-[11px]">
                            [Kanıt Henüz Panoya Eklenmedi]
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#cbb68d] px-6 py-3 border-t-2 border-[#b59e74] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-200 font-police font-bold text-xs rounded-lg cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
