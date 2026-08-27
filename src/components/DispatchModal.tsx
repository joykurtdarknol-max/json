import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Radio, Shield, Waves, Landmark, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({ isOpen, onClose }) => {
  const { dispatchMissions, startDispatchMission, openInspectEvidence } = useGameStore();

  if (!isOpen) return null;

  const getTeamIcon = (team: string) => {
    switch (team) {
      case 'forensic': return <Shield className="w-5 h-5 text-amber-500" />;
      case 'dive_team': return <Waves className="w-5 h-5 text-blue-400" />;
      case 'bank_audit': return <Landmark className="w-5 h-5 text-emerald-400" />;
      default: return <Radio className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        className="relative w-full max-w-2xl max-h-[96dvh] sm:max-h-[85vh] flex flex-col bg-zinc-950 text-zinc-100 rounded-xl shadow-2xl border border-amber-600/50 sm:border-2 overflow-hidden font-police"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-zinc-900 px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
            <h3 className="font-cinzel text-xs sm:text-sm font-bold text-amber-200 uppercase tracking-wider truncate">
              TELSİZ & SAHA SEVKİYATI
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission List */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 text-xs text-zinc-300">
            <p className="font-typewriter leading-relaxed">
              Şehirdeki şüpheli mekanlara olay yeri inceleme ekipleri, dalgıçlar ve mali müfettişler sevk ederek yeni deliller toplayabilirsiniz. Ekipler görev tamamlandığında telsizden arayacaktır.
            </p>
          </div>

          <div className="space-y-3">
            {dispatchMissions.map((mission) => {
              const isAvailable = mission.status === 'available';
              const isInProgress = mission.status === 'in_progress';
              const isCompleted = mission.status === 'completed';

              return (
                <div 
                  key={mission.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                        {getTeamIcon(mission.team)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-zinc-100">{mission.title}</h4>
                        <span className="text-[11px] text-amber-400 block mt-0.5">
                          📍 {mission.targetLocation}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isAvailable && (
                        <button
                          onClick={() => startDispatchMission(mission.id)}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer"
                        >
                          Ekibi Sevk Et ➔
                        </button>
                      )}

                      {isInProgress && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-950 text-amber-300 border border-amber-700 rounded-lg text-xs font-bold animate-pulse">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          Görevde (Aranıyor...)
                        </span>
                      )}

                      {isCompleted && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-lg text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Rapor Teslim Edildi
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 font-typewriter leading-relaxed">
                    {mission.description}
                  </p>

                  {isCompleted && (
                    <div className="bg-zinc-950 p-3 rounded-lg border border-emerald-900/50 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold">
                          📄 Saha Ekip Bulgusu:
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            openInspectEvidence(mission.resultEvidenceId);
                          }}
                          className="text-amber-300 hover:text-amber-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <span>Bulunan Delili İncele</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs font-typewriter text-zinc-300">
                        {mission.resultReport}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-900 px-6 py-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-lg cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
