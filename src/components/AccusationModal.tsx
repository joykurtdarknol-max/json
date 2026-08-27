import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Gavel, CheckCircle, FileText } from 'lucide-react';

export const AccusationModal: React.FC = () => {
  const { 
    isAccusationOpen, 
    closeAccusationModal, 
    submitAccusation,
    caseData 
  } = useGameStore();

  const suspects = caseData?.suspects || [];
  const evidences = caseData?.evidences || [];
  const weapons = caseData?.weapons || [];

  const [selectedSuspect, setSelectedSuspect] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState('');

  // Synchronize default selections when case loads
  useEffect(() => {
    if (!isAccusationOpen) return;
    if (suspects.length > 0 && !selectedSuspect) {
      setSelectedSuspect(suspects[0].id);
    }
    if (weapons.length > 0 && !selectedWeapon) {
      setSelectedWeapon(weapons[0].id);
    }
    if (evidences.length > 0 && !selectedEvidence) {
      setSelectedEvidence(evidences[0].id);
    }
  }, [isAccusationOpen, suspects, weapons, evidences, selectedSuspect, selectedWeapon, selectedEvidence]);

  if (!isAccusationOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAccusation(selectedSuspect, selectedWeapon, selectedEvidence);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeAccusationModal} />

      <div 
        className="relative w-full max-w-2xl max-h-[96dvh] sm:max-h-[90vh] flex flex-col bg-[#f5ecda] text-zinc-950 rounded-xl shadow-2xl border-2 sm:border-4 border-[#b59e74] overflow-hidden aged-paper"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Court Header */}
        <div className="flex items-center justify-between bg-[#cbb68d] px-3 sm:px-6 py-2.5 sm:py-3 border-b-2 border-[#b59e74] shrink-0">
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4 sm:w-5 sm:h-5 text-red-900" />
            <h3 className="font-cinzel text-xs sm:text-sm font-bold text-zinc-950 uppercase tracking-wider truncate">
              RESMİ İDDİANAME
            </h3>
          </div>
          <button 
            onClick={closeAccusationModal}
            className="text-zinc-700 hover:text-red-900 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto font-police flex-1">
          <div className="border-b border-zinc-400 pb-3">
            <p className="font-typewriter text-xs text-zinc-800 leading-relaxed">
              {caseData?.title || 'Resmi Vaka'} soruşturmasında elde edilen deliller ve şüpheli ifadeleri doğrultusunda mahkemeye sunulacak nihai karar metnidir.
            </p>
          </div>

          {/* 1. KİMİ SUÇLUYORSUNUZ? */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-red-900">
              1. Asli Cinayet Şüphelisi (Katil Kim?):
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suspects.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSuspect(s.id)}
                  className={`p-3 rounded-lg border-2 flex items-center gap-3 cursor-pointer transition-all ${
                    selectedSuspect === s.id
                      ? 'border-red-800 bg-red-950/10 shadow-md font-bold'
                      : 'border-zinc-300 bg-white/50 hover:bg-white/80'
                  }`}
                >
                  <img src={s.imageNormal} alt={s.name} className="w-12 h-12 rounded object-cover border border-zinc-400" />
                  <div>
                    <h4 className="text-xs text-zinc-950 font-bold">{s.name}</h4>
                    <p className="text-[11px] text-zinc-600">{s.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. CİNAYET ALETİ NEDİR? */}
          {weapons.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-red-900">
                2. Cinayet Silahı / Aleti:
              </label>
              <div className="space-y-2">
                {weapons.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWeapon(w.id)}
                    className={`p-3 rounded-lg border-2 flex items-center justify-between cursor-pointer transition-all ${
                      selectedWeapon === w.id
                        ? 'border-red-800 bg-red-950/10 shadow-md font-bold'
                        : 'border-zinc-300 bg-white/50 hover:bg-white/80'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs text-zinc-950">{w.name}</h4>
                      <p className="text-[11px] text-zinc-600">{w.description}</p>
                    </div>
                    {selectedWeapon === w.id && <CheckCircle className="w-4 h-4 text-red-800" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. EN KRİTİK ÇÜRÜTÜCÜ KANIT */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-red-900">
              3. Katilin Yalanını Çürüten Temel Kanıt:
            </label>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {evidences.map((e) => {
                const isSelected = selectedEvidence === e.id;
                return (
                  <div
                    key={e.id}
                    onClick={() => setSelectedEvidence(e.id)}
                    className={`rounded-lg border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-red-800 bg-red-950/10 shadow-md ring-1 ring-red-800'
                        : 'border-zinc-300 bg-white/60 hover:bg-white/90'
                    }`}
                  >
                    {/* Main Card Row */}
                    <div className="p-2.5 sm:p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {e.image ? (
                          <div className="w-10 h-10 rounded border border-zinc-400 bg-zinc-950 overflow-hidden shrink-0 shadow-xs">
                            <img src={e.image} alt={e.title} className="w-full h-full object-cover grayscale contrast-125" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded border border-zinc-400 bg-zinc-200 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-zinc-600" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono font-bold bg-zinc-800 text-amber-300 px-1.5 py-0.2 rounded shrink-0">
                              {e.id.replace(/^evidence_/, '#').toUpperCase()}
                            </span>
                            <h4 className={`text-xs text-zinc-950 font-bold ${isSelected ? 'text-red-950' : 'truncate'}`}>
                              {e.title}
                            </h4>
                          </div>
                          {!isSelected && (
                            <p className="text-[11px] text-zinc-600 truncate mt-0.5">{e.description}</p>
                          )}
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5 text-red-800 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-400 shrink-0" />
                      )}
                    </div>

                    {/* Smooth Expanded Detail Drawer (Tıklanınca Açılan Kısım) */}
                    {isSelected && (
                      <div className="px-3 pb-3 pt-1 border-t border-red-900/20 bg-white/70 space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                        <div className="text-xs text-zinc-800 font-typewriter leading-relaxed pt-1">
                          {e.description}
                        </div>
                        {e.sourceLocation && (
                          <div className="text-[10px] text-zinc-600 font-police flex items-center gap-1">
                            <span className="font-bold text-zinc-800">Bulunduğu Yer:</span>
                            <span>{e.sourceLocation}</span>
                          </div>
                        )}
                        {(e.hiddenClueUV || e.hiddenClueMagnifier) && (
                          <div className="text-[10px] bg-purple-950/10 text-purple-900 border border-purple-800/30 px-2 py-0.5 rounded font-bold inline-block">
                            🔬 Adli İpucu: {e.hiddenClueUV || e.hiddenClueMagnifier}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-400 flex items-center justify-between">
            <button
              type="button"
              onClick={closeAccusationModal}
              className="px-4 py-2 text-xs font-bold text-zinc-700 hover:text-zinc-950 cursor-pointer"
            >
              Vakayı İncelemeye Devam Et
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-red-900 hover:bg-red-800 text-white font-police font-bold text-xs rounded-lg shadow-xl shadow-red-950/40 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <Gavel className="w-4 h-4 text-amber-300" />
              <span>İddianameyi Mahkemeye Sun ➔</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
