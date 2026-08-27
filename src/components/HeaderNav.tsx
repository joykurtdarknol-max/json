import React, { useState, useRef, useEffect } from 'react';
import { useGameStore, type GameView } from '../store/gameStore';
import { 
  FolderOpen, 
  Layers, 
  UserCheck, 
  Gavel, 
  Lightbulb, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Search, 
  CloudRain, 
  Music, 
  PhoneCall, 
  Clock, 
  Settings, 
  RotateCcw, 
  Radio,
  X
} from 'lucide-react';
import { sounds } from '../services/audio';

interface HeaderNavProps {
  onOpenTimeline?: () => void;
  onOpenArchive?: () => void;
  onOpenDispatch?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ 
  onOpenTimeline, 
  onOpenArchive,
  onOpenDispatch
}) => {
  const { 
    currentView, 
    setView, 
    lampOn, 
    toggleLamp, 
    isRainActive, 
    toggleRain, 
    isJazzActive, 
    toggleJazz, 
    phoneRinging, 
    answerPhone, 
    pinnedEvidenceIds, 
    discoveredContradictionIds, 
    openAccusationModal, 
    restartCase, 
    caseData 
  } = useGameStore();

  const [muted, setMuted] = useState(sounds.getMuted());
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  const handleMuteToggle = () => {
    const isMuted = sounds.toggleMute();
    setMuted(isMuted);
  };

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const navItems: { view: GameView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { 
      view: 'desk', 
      label: 'Masa', 
      icon: <FolderOpen className="w-4 h-4" /> 
    },
    { 
      view: 'board', 
      label: 'Pano', 
      icon: <Layers className="w-4 h-4" />,
      badge: pinnedEvidenceIds.length
    },
    { 
      view: 'interrogation', 
      label: 'Sorgu', 
      icon: <UserCheck className="w-4 h-4" /> 
    },
  ];

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-amber-900/30 px-3 md:px-5 py-2 flex items-center justify-between shadow-2xl h-[52px]">
      {/* Left: Case Selector */}
      <div className="flex items-center gap-2">
        {onOpenArchive ? (
          <button
            onClick={onOpenArchive}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 hover:border-amber-400/60 px-3 py-1.5 rounded-lg shadow-inner cursor-pointer transition-all group"
            title="Vaka Arşivini Aç / Başka Vaka Seç"
          >
            <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-cinzel text-xs font-bold text-amber-200 tracking-wider">
              {caseData ? caseData.id.toUpperCase().replace('_', ' #') : 'VAKA SEÇ'}
            </span>
            <span className="text-[10px] text-amber-400/80 font-police underline">
              (Arşiv)
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-zinc-900 border border-amber-500/20 px-3 py-1.5 rounded-lg shadow-inner">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-cinzel text-xs font-bold text-amber-200 tracking-wider">
              {caseData ? caseData.id.toUpperCase().replace('_', ' #') : 'VAKA'}
            </span>
          </div>
        )}

        {/* Incoming Phone Call Alert */}
        {phoneRinging && (
          <button
            onClick={answerPhone}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg font-police text-xs font-bold animate-bounce shadow-lg shadow-red-900/50 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 animate-spin" />
            <span>TELEFON ÇALIYOR!</span>
          </button>
        )}
      </div>

      {/* Center: Main View Switcher (Masa | Pano | Sorgu) - Desktop */}
      <nav className="hidden md:flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 shadow-inner">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-amber-600 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-amber-200 hover:bg-zinc-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Quick Tools, Single Settings Button & Accusation */}
      <div className="flex items-center gap-2">
        {/* Contradiction Counter */}
        {discoveredContradictionIds.length > 0 && (
          <div className="hidden lg:flex items-center gap-1 bg-rose-950/60 border border-rose-600/40 text-rose-300 px-2.5 py-1 rounded-lg text-xs font-police">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>{discoveredContradictionIds.length} Hipotez</span>
          </div>
        )}

        {/* Timeline Button - Desktop */}
        {onOpenTimeline && (
          <button
            onClick={onOpenTimeline}
            className="hidden md:flex items-center gap-1 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-police"
            title="Zaman Şeridi"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Zaman Şeridi</span>
          </button>
        )}

        {/* Dispatch Button - Desktop */}
        {onOpenDispatch && (
          <button
            onClick={onOpenDispatch}
            className="hidden md:flex items-center gap-1 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-police"
            title="Saha Ekipleri ve Telsiz"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Telsiz</span>
          </button>
        )}

        {/* UNIFIED SETTINGS BUTTON & POPUP MENU */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Oyun Ayarları & Atmosfer"
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-police font-bold ${
              showSettings
                ? 'bg-amber-600 border-amber-500 text-zinc-950 shadow-lg'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-amber-200 hover:bg-zinc-800'
            }`}
          >
            <Settings className={`w-4 h-4 ${showSettings ? 'rotate-90 text-zinc-950' : 'text-amber-400'} transition-transform duration-200`} />
            <span className="hidden xl:inline">Ayarlar</span>
          </button>

          {showSettings && (
            <div className="absolute right-0 top-11 w-72 bg-zinc-950 border-2 border-zinc-700 rounded-2xl p-4 shadow-2xl z-50 text-zinc-200 font-police text-xs space-y-4 animate-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-cinzel font-bold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  OYUN & ATMOSFER AYARLARI
                </span>
                <button 
                  onClick={() => setShowSettings(false)} 
                  className="text-zinc-500 hover:text-white cursor-pointer p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Ses & Ambiyans Kontrolleri */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  🎵 Ses & Ambiyans
                </span>

                {/* Yağmur Sesi */}
                <div className="flex items-center justify-between bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <CloudRain className={`w-4 h-4 ${isRainActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                    <span className="text-xs text-zinc-200">Yağmur Sesi</span>
                  </div>
                  <button
                    onClick={toggleRain}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isRainActive ? 'bg-blue-600 text-white shadow' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isRainActive ? 'Açık' : 'Kapalı'}
                  </button>
                </div>

                {/* Gerilim Tema Müziği */}
                <div className="flex items-center justify-between bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Music className={`w-4 h-4 ${isJazzActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                    <span className="text-xs text-zinc-200">Gerilim Tema Müziği</span>
                  </div>
                  <button
                    onClick={toggleJazz}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isJazzActive ? 'bg-amber-600 text-zinc-950 shadow' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isJazzActive ? 'Açık' : 'Kapalı'}
                  </button>
                </div>

                {/* Genel Ses Efektleri */}
                <div className="flex items-center justify-between bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2">
                    {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    <span className="text-xs text-zinc-200">Efekt Sesleri</span>
                  </div>
                  <button
                    onClick={handleMuteToggle}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      !muted ? 'bg-emerald-700 text-white shadow' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {!muted ? 'Açık' : 'Sessiz'}
                  </button>
                </div>
              </div>

              {/* 2. Aydınlatma Kontrolü */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  💡 Aydınlatma
                </span>
                <div className="flex items-center justify-between bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Lightbulb className={`w-4 h-4 ${lampOn ? 'text-yellow-400' : 'text-zinc-500'}`} />
                    <span className="text-xs text-zinc-200">Masa Lambası</span>
                  </div>
                  <button
                    onClick={toggleLamp}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      lampOn ? 'bg-yellow-500 text-zinc-950 shadow' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {lampOn ? 'Açık' : 'Kapalı'}
                  </button>
                </div>
              </div>

              {/* 3. Vaka Sıfırlama */}
              <div className="pt-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    if (confirm('Vakayı en baştan sıfırlamak istediğinize emin misiniz?')) {
                      restartCase();
                      setShowSettings(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 p-2 bg-red-950/40 hover:bg-red-900/70 border border-red-800/60 text-red-300 rounded-xl font-bold text-[11px] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                  <span>Vakayı Sıfırla (Baştan Başla)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Accuse Button */}
        <button
          onClick={openAccusationModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-red-700 to-rose-800 hover:from-red-600 hover:to-rose-700 text-white font-police font-bold text-xs px-3 py-1.5 rounded-lg border border-red-500/40 shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <Gavel className="w-4 h-4 text-amber-300" />
          <span className="hidden md:inline">İddianame</span>
        </button>
      </div>
    </header>

    {/* Mobile Bottom Navigation Bar */}
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-amber-900/40 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex md:hidden items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer relative ${
              isActive
                ? 'text-amber-400 font-extrabold'
                : 'text-zinc-400 hover:text-amber-200'
            }`}
          >
            <div className="relative">
              {item.icon}
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="absolute -top-1 -right-2.5 bg-amber-500 text-zinc-950 text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-extrabold shadow">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {onOpenTimeline && (
        <button
          onClick={onOpenTimeline}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-amber-200 transition-all cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          <span className="mt-0.5">Zaman</span>
        </button>
      )}

      {onOpenDispatch && (
        <button
          onClick={onOpenDispatch}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-amber-200 transition-all cursor-pointer"
        >
          <Radio className="w-4 h-4" />
          <span className="mt-0.5">Telsiz</span>
        </button>
      )}
    </nav>
    </>
  );
};
