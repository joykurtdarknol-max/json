import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { 
  FolderOpen, 
  Layers, 
  PhoneCall, 
  Phone, 
  HelpCircle, 
  X 
} from 'lucide-react';
import { sounds } from '../services/audio';

export const DeskView: React.FC = () => {
  const { 
    openCaseFile, 
    setView, 
    lampOn, 
    toggleLamp, 
    phoneRinging,
    incomingCall,
    answerPhone,
    hangupPhone,
    pinnedEvidenceIds,
    openInspectEvidence,
    caseData
  } = useGameStore();

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const deskContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-center wide desk scroll on mobile load
  useEffect(() => {
    if (deskContainerRef.current) {
      const scrollWidth = deskContainerRef.current.scrollWidth;
      const clientWidth = deskContainerRef.current.clientWidth;
      deskContainerRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  const directory = caseData?.directory || [];

  return (
    <div 
      ref={deskContainerRef}
      className="relative w-full h-[calc(100dvh-52px-54px)] md:h-[calc(100vh-52px)] mt-[52px] bg-zinc-950 overflow-x-auto overflow-y-hidden md:overflow-hidden select-none flex items-center justify-start md:justify-center"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Mobile Swipe Hint Pill */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-20 flex md:hidden items-center gap-1.5 bg-zinc-950/85 border border-amber-500/40 px-3 py-1 rounded-full text-[10px] font-police text-amber-300 backdrop-blur-xs shadow-lg pointer-events-none">
        <span>👈 Masayı Kaydırın 👉</span>
      </div>

      {/* Wide Desk Canvas (Preserves uncropped landscape proportions on mobile) */}
      <div className="relative min-w-[200vw] sm:min-w-[140vw] md:min-w-full w-full h-full flex items-center justify-center shrink-0">
        {/* Background Photographic Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
          style={{ 
            backgroundImage: `url('/assets/desk_bg.jpg')`,
            filter: lampOn ? 'brightness(1) contrast(1.05)' : 'brightness(0.3) contrast(1.2)',
          }}
        />

      {/* Atmospheric Lamp Glow */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          lampOn 
            ? 'opacity-80 lamp-lighting' 
            : 'opacity-95 bg-black/85'
        }`} 
      />

      {/* Film Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none film-grain opacity-30" />

      {/* ============================================================ */}
      {/* INCOMING CALL MODAL                                          */}
      {/* ============================================================ */}
      {incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="bg-[#f5ecda] border-4 border-[#b59e74] w-full max-w-md rounded-xl p-6 text-zinc-950 shadow-2xl font-police aged-paper space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-400 pb-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-red-800 animate-bounce" />
                <span className="font-bold text-xs uppercase tracking-wider text-red-900">
                  GELEN TELEFON BAĞLANTISI
                </span>
              </div>
              <button onClick={hangupPhone} className="text-zinc-600 hover:text-red-900 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="font-typewriter font-bold text-sm text-zinc-900">{incomingCall.caller}</h3>
              <p className="text-[11px] text-zinc-600">{incomingCall.role}</p>
            </div>

            <div className="bg-white/70 p-3.5 rounded-lg border border-zinc-300 shadow-inner">
              <p className="font-typewriter text-xs text-zinc-900 leading-relaxed">
                "{incomingCall.message}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {incomingCall.newEvidenceId ? (
                <button
                  onClick={() => {
                    const eId = incomingCall.newEvidenceId!;
                    hangupPhone();
                    openInspectEvidence(eId);
                  }}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer"
                >
                  Yeni Delili İncele ➔
                </button>
              ) : (
                <span className="text-[11px] text-zinc-600">Rapor kaydedildi.</span>
              )}

              <button
                onClick={hangupPhone}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-amber-200 font-bold text-xs rounded-lg cursor-pointer"
              >
                Telefonu Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. TOP CENTER: "Ayağa Kalk & Panoya Bak"                       */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* 1. TOP CENTER: "Ayağa Kalk & Panoya Bak" (Desktop Only)      */}
      {/* ============================================================ */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-3">
        <button
          onClick={() => setView('board')}
          className="flex items-center gap-2.5 bg-amber-950/90 hover:bg-amber-900 text-amber-200 border-2 border-amber-600/60 px-5 py-2 rounded-xl shadow-2xl backdrop-blur-md font-police font-bold text-xs md:text-sm tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
        >
          <Layers className="w-4 h-4 md:w-5 md:h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>Ayağa Kalk & Panoya Bak</span>
          {pinnedEvidenceIds.length > 0 && (
            <span className="bg-amber-500 text-zinc-950 text-xs px-2 py-0.5 rounded-full font-extrabold">
              {pinnedEvidenceIds.length} Delil
            </span>
          )}
        </button>

        <button
          onClick={() => setShowTutorial(!showTutorial)}
          className="p-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl backdrop-blur-md shadow-lg transition-all cursor-pointer"
          title="Kılavuz"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Mobile-only Help Button (Top Left) */}
      <div className="absolute top-3 left-3 z-20 flex md:hidden">
        <button
          onClick={() => setShowTutorial(!showTutorial)}
          className="p-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xl backdrop-blur-md shadow-lg transition-all cursor-pointer"
          title="Dedektif Kılavuzu"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Tutorial Popup */}
      {showTutorial && (
        <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-md bg-zinc-900/95 border-2 border-amber-500/40 rounded-xl p-4 sm:p-5 text-zinc-200 shadow-2xl backdrop-blur-md font-police">
          <div className="flex items-center justify-between border-b border-zinc-700 pb-2 mb-3">
            <h3 className="font-cinzel text-xs sm:text-sm font-bold text-amber-300">🕵️ DEDEKTİF REHBERİ</h3>
            <button onClick={() => setShowTutorial(false)} className="text-zinc-400 hover:text-white text-xs cursor-pointer p-1">✕</button>
          </div>
          <ol className="text-xs space-y-2 text-zinc-300 list-decimal list-inside">
            <li><strong className="text-amber-300">📁 Dosya Butonu:</strong> Masadaki klasörü açıp sayfaları çevir, kanıtları panoya iğnele.</li>
            <li><strong className="text-amber-300">☎️ Telefon Butonu:</strong> Santral rehberine eriş veya çalan telefonu aç.</li>
            <li><strong className="text-amber-300">📌 Pano & İpler:</strong> Panoya geçip raptiyeleri birbirine bağlayarak hipotezleri açığa çıkar.</li>
          </ol>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. TWO PERMANENT, COMPACT, ICON-ONLY BUTTONS (YAZISIZ)       */}
      {/* ============================================================ */}

      {/* BUTTON 1: CASE FILE (Center Desk) */}
      <div className="absolute bottom-5 sm:bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5">
        <button
          onClick={() => openCaseFile(1)}
          title={caseData ? `${caseData.title} - Dosyayı Aç` : "Vaka Dosyasını Aç"}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-950 hover:from-amber-600 hover:to-amber-900 text-amber-200 border-2 border-amber-400/80 shadow-[0_8px_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 cursor-pointer group animate-pulse hover:animate-none"
        >
          <FolderOpen className="w-7 h-7 md:w-8 md:h-8 text-amber-300 group-hover:scale-110 transition-transform" />
        </button>
        <span className="font-police text-[10px] sm:text-[11px] font-bold text-amber-200 bg-zinc-950/85 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow backdrop-blur-xs">
          📁 VAKA DOSYASI
        </span>
      </div>

      {/* BUTTON 2: ROTARY TELEPHONE (Top Right) */}
      <div className="absolute top-3 sm:top-16 md:top-20 right-3 sm:right-10 md:right-24 z-20 flex flex-col items-center gap-1">
        <button
          onClick={() => {
            if (phoneRinging) {
              answerPhone();
            } else {
              sounds.playTapeClick();
              setShowPhoneModal(true);
            }
          }}
          title={phoneRinging ? "Çalan Telefonu Aç!" : "Santral Telefon Rehberi"}
          className={`w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full border-2 transition-all transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.7)] ${
            phoneRinging
              ? 'bg-gradient-to-br from-red-600 to-red-900 border-white text-white animate-bounce shadow-[0_0_25px_rgba(239,68,68,0.8)]'
              : 'bg-gradient-to-br from-zinc-800 to-zinc-950 border-zinc-600 hover:border-amber-400 text-amber-400'
          }`}
        >
          {phoneRinging ? (
            <PhoneCall className="w-5 h-5 md:w-6 md:h-6 animate-spin text-white" />
          ) : (
            <Phone className="w-5 h-5 md:w-6 md:h-6 text-amber-300" />
          )}
        </button>
      </div>

      {/* GREEN BANKER'S LAMP CLICKABLE HOTSPOT (Top Left) */}
      <div 
        onClick={toggleLamp}
        className="absolute top-12 left-8 md:left-24 w-36 h-48 rounded-full cursor-pointer z-10"
        title="Masa Lambası (Aç / Kapat)"
      />
      </div>

      {/* ============================================================ */}
      {/* TELEPHONE DIRECTORY MODAL (100% Dynamic from JSON)           */}
      {/* ============================================================ */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in zoom-in-95 duration-150">
          <div className="bg-zinc-900 border-2 border-zinc-700 w-full max-w-md rounded-xl p-6 text-zinc-200 font-police space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-700 pb-3">
              <h3 className="font-bold text-amber-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                <Phone className="w-4 h-4" />
                SANTRAL TELEFON REHBERİ
              </h3>
              <button 
                onClick={() => setShowPhoneModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {directory.map((contact) => (
                <div key={contact.id} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-zinc-100">{contact.name}</h4>
                    <p className="text-[11px] text-zinc-400">{contact.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded">
                      {contact.status}
                    </span>
                    {contact.viewTarget && (
                      <button
                        onClick={() => {
                          setShowPhoneModal(false);
                          setView(contact.viewTarget!);
                        }}
                        className="text-xs bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold px-2.5 py-1 rounded transition-colors cursor-pointer"
                      >
                        Bağlan ➔
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {directory.length === 0 && (
                <div className="text-zinc-500 text-center py-4">
                  Bu vaka için kayıtlı santral numarası bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
