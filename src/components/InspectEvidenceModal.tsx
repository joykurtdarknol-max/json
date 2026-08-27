import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { 
  X, 
  Trash2, 
  Clock, 
  MapPin, 
  Eye, 
  Search, 
  Sparkles, 
  Zap, 
  Fingerprint, 
  FileText, 
  FlaskConical, 
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { sounds } from '../services/audio';

type TabType = 'summary' | 'transcript' | 'forensic' | 'cyber_hts';

export const InspectEvidenceModal: React.FC = () => {
  const { 
    inspectingEvidenceId, 
    closeInspectEvidence, 
    unpinEvidenceFromBoard,
    caseData 
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [uvMode, setUvMode] = useState(false);
  const [zoomMode, setZoomMode] = useState(false);

  if (!inspectingEvidenceId) return null;

  const evidence = caseData?.evidences?.find((e) => e.id === inspectingEvidenceId);
  if (!evidence) return null;

  const hasTranscript = !!evidence.transcriptMarkdown;
  const hasForensic = !!evidence.forensicAnalysisMarkdown;
  const hasCyber = !!evidence.cyberHtsLogMarkdown;

  const toggleUV = () => {
    sounds.playSwitch();
    setUvMode(!uvMode);
  };

  const toggleZoom = () => {
    sounds.playPaper();
    setZoomMode(!zoomMode);
  };

  const handleTabChange = (tab: TabType) => {
    sounds.playPaper();
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeInspectEvidence} />

      <div 
        className={`relative w-full max-w-3xl rounded-xl shadow-2xl border-2 sm:border-4 transition-all duration-300 overflow-hidden font-police flex flex-col max-h-[96dvh] sm:max-h-[90vh] ${
          uvMode
            ? 'bg-purple-950 border-purple-600 text-purple-100 shadow-[0_0_40px_rgba(168,85,247,0.4)]'
            : 'bg-[#f6eedb] border-[#b59e74] text-zinc-950 aged-paper'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Official Police Header */}
        <div className={`px-3 sm:px-5 py-2 sm:py-3 border-b-2 flex items-center justify-between gap-2 shrink-0 ${
          uvMode ? 'bg-purple-900 border-purple-700 text-purple-100' : 'bg-[#cbb68d] border-[#b59e74] text-zinc-950'
        }`}>
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-950" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-zinc-950 text-amber-300 px-2 py-0.5 rounded">
                  {evidence.officialDocumentNo || `T.C. İST-ASAYİŞ-2014 // ${evidence.id.toUpperCase()}`}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
                  CİNAYET BÜRO ADLİ DELİL DOSYASI
                </span>
              </div>
            </div>
          </div>

          {/* Quick Forensic Tools in Header */}
          <div className="flex items-center gap-2">
            {evidence.hiddenClueUV && (
              <button
                onClick={toggleUV}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                  uvMode ? 'bg-purple-600 text-white border-purple-400 animate-pulse shadow-md' : 'bg-purple-950/60 text-purple-300 border-purple-600 hover:bg-purple-900'
                }`}
                title="UV Işıkla gizli izleri tara"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{uvMode ? 'UV Kapat' : 'UV Işık'}</span>
              </button>
            )}

            {evidence.hiddenClueMagnifier && (
              <button
                onClick={toggleZoom}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                  zoomMode ? 'bg-amber-600 text-zinc-950 border-amber-400 font-bold' : 'bg-zinc-800 text-zinc-300 border-zinc-600 hover:bg-zinc-700'
                }`}
                title="Büyüteçle mikro detayları incele"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{zoomMode ? 'Yakınlaştırma Kapat' : 'Büyüteç'}</span>
              </button>
            )}

            <button 
              onClick={closeInspectEvidence}
              className="text-zinc-700 hover:text-red-900 p-1 cursor-pointer transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Dossier Tabs Bar */}
        <div className={`flex items-center gap-1 px-4 pt-2 border-b overflow-x-auto select-none ${
          uvMode ? 'bg-purple-950/80 border-purple-800' : 'bg-[#e2d5ba] border-[#b59e74]'
        }`}>
          <button
            onClick={() => handleTabChange('summary')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer ${
              activeTab === 'summary'
                ? uvMode 
                  ? 'bg-purple-900 text-white border-t-2 border-x-2 border-purple-500 shadow'
                  : 'bg-[#f6eedb] text-zinc-950 border-t-2 border-x-2 border-[#b59e74] shadow'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Genel & Bulgu Özeti</span>
          </button>

          {hasTranscript && (
            <button
              onClick={() => handleTabChange('transcript')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer ${
                activeTab === 'transcript'
                  ? uvMode 
                    ? 'bg-purple-900 text-white border-t-2 border-x-2 border-purple-500 shadow'
                    : 'bg-[#f6eedb] text-zinc-950 border-t-2 border-x-2 border-[#b59e74] shadow'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-900" />
              <span>Resmi Polis İfade Zabtı</span>
              <span className="bg-red-800 text-white text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">ZABIT</span>
            </button>
          )}

          {hasForensic && (
            <button
              onClick={() => handleTabChange('forensic')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer ${
                activeTab === 'forensic'
                  ? uvMode 
                    ? 'bg-purple-900 text-white border-t-2 border-x-2 border-purple-500 shadow'
                    : 'bg-[#f6eedb] text-zinc-950 border-t-2 border-x-2 border-[#b59e74] shadow'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-800" />
              <span>Adli Tıp & Toksikoloji</span>
              <span className="bg-emerald-900 text-emerald-200 text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">GC-MS</span>
            </button>
          )}

          {hasCyber && (
            <button
              onClick={() => handleTabChange('cyber_hts')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer ${
                activeTab === 'cyber_hts'
                  ? uvMode 
                    ? 'bg-purple-900 text-white border-t-2 border-x-2 border-purple-500 shadow'
                    : 'bg-[#f6eedb] text-zinc-950 border-t-2 border-x-2 border-[#b59e74] shadow'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-800" />
              <span>Dijital HTS & CCTV Logu</span>
              <span className="bg-indigo-900 text-indigo-200 text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">BAZ</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              {/* Photo or Evidence Bag Card */}
              {evidence.image ? (
                <div className={`w-full max-h-72 rounded-lg overflow-hidden border-2 shadow-inner flex items-center justify-center transition-all duration-300 ${
                  uvMode ? 'bg-purple-950 border-purple-500 filter brightness-90 hue-rotate-90' : 'bg-zinc-900 border-zinc-400'
                }`}>
                  <img
                    src={evidence.image}
                    alt={evidence.title}
                    className={`w-full h-full object-contain transition-transform duration-300 ${
                      zoomMode ? 'scale-150' : 'scale-100'
                    }`}
                  />
                </div>
              ) : (
                <div className={`w-full p-4 rounded-lg border-2 border-dashed flex items-center justify-between transition-all duration-300 ${
                  uvMode
                    ? 'bg-purple-900/50 border-purple-500 text-purple-200'
                    : 'bg-[#ebdcb9] border-[#b59e74] text-zinc-900'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-zinc-900/10 rounded-lg border border-zinc-700/30">
                      <Fingerprint className="w-8 h-8 text-red-900" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold bg-red-950 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                        RESMİ DELİL POŞETİ // #{evidence.id.toUpperCase()}
                      </span>
                      <h4 className="font-typewriter font-bold text-sm text-zinc-950 mt-1">{evidence.title}</h4>
                      <p className="text-[11px] text-zinc-700">{evidence.sourceLocation}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right text-[10px] font-police text-zinc-600">
                    <span className="block font-bold">KORUMA ZİNCİRİ: AKTİF</span>
                    <span>{evidence.dateStr || caseData?.date}</span>
                  </div>
                </div>
              )}

              {/* Title & Metadata */}
              <div className="border-b border-zinc-300/40 pb-3">
                <h2 className="font-typewriter text-lg md:text-xl font-bold">
                  {evidence.title}
                </h2>
                <div className="flex items-center gap-4 text-xs opacity-75 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {evidence.dateStr || caseData?.date || '04 Ekim 2014'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {evidence.sourceLocation}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className={`p-4 rounded-lg border ${
                uvMode ? 'bg-purple-900/40 border-purple-700' : 'bg-white/70 border-zinc-300 shadow-inner'
              }`}>
                <p className="font-typewriter text-xs md:text-sm leading-relaxed">
                  {evidence.description}
                </p>
              </div>

              {/* Handwritten Note */}
              {evidence.handwrittenNote && (
                <div className={`p-3 rounded-lg border ${
                  uvMode ? 'bg-purple-900/30 border-purple-600' : 'bg-amber-100/70 border-amber-300'
                }`}>
                  <span className="text-[10px] uppercase font-bold opacity-75 block">
                    Dedektif Saha Notu:
                  </span>
                  <p className="font-handwriting text-base font-bold mt-0.5">
                    "{evidence.handwrittenNote}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRANSCRIPT (POLIS ZABTI) */}
          {activeTab === 'transcript' && evidence.transcriptMarkdown && (
            <div className="space-y-4 font-typewriter text-xs md:text-sm bg-white/80 p-5 rounded-lg border-2 border-zinc-300 shadow-inner text-zinc-900 leading-relaxed">
              <div className="border-b-2 border-zinc-900 pb-3 flex items-center justify-between font-police">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                    T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ — ASAYİŞ ŞUBE
                  </h4>
                  <p className="text-[10px] text-zinc-600">Cinayet Büro Amirliği Resmi Soruşturma İfade Tutanağı</p>
                </div>
                <div className="text-right">
                  <span className="border-2 border-red-900 text-red-900 text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest block">
                    GİZLİ // ADLİ EVRAK
                  </span>
                </div>
              </div>

              <div className="whitespace-pre-wrap font-mono text-[12px] md:text-[13px] bg-zinc-50 p-4 rounded border border-zinc-200">
                {evidence.transcriptMarkdown}
              </div>

              <div className="border-t border-zinc-300 pt-3 flex justify-between text-[11px] font-police text-zinc-600">
                <span>Zabıt Kâtibi: Polis Memuru H. Aksoy</span>
                <span>Sorgulayan: Cinayet Büro Başkomiseri</span>
              </div>
            </div>
          )}

          {/* TAB 3: FORENSIC (ADLI TIP & TOKSIKOLOJI) */}
          {activeTab === 'forensic' && evidence.forensicAnalysisMarkdown && (
            <div className="space-y-4 font-typewriter text-xs md:text-sm bg-white/80 p-5 rounded-lg border-2 border-emerald-900/30 shadow-inner text-zinc-900 leading-relaxed">
              <div className="border-b-2 border-emerald-900 pb-3 flex items-center justify-between font-police">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-950">
                    ADLİ TIP KURUMU BAŞKANLIĞI // YENİBOSNA MERKEZ
                  </h4>
                  <p className="text-[10px] text-zinc-600">Toksikoloji & Biyolojik İhtisas Dairesi Laboratuvar Raporu</p>
                </div>
                <span className="bg-emerald-900 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                  RAPOR ONAYLANDI
                </span>
              </div>

              <div className="whitespace-pre-wrap font-mono text-[12px] md:text-[13px] bg-emerald-950/5 p-4 rounded border border-emerald-900/20">
                {evidence.forensicAnalysisMarkdown}
              </div>
            </div>
          )}

          {/* TAB 4: CYBER HTS & CCTV */}
          {activeTab === 'cyber_hts' && evidence.cyberHtsLogMarkdown && (
            <div className="space-y-4 font-typewriter text-xs md:text-sm bg-zinc-950 p-5 rounded-lg border-2 border-indigo-500/40 shadow-2xl text-zinc-200 leading-relaxed">
              <div className="border-b border-indigo-500/40 pb-3 flex items-center justify-between font-police">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                    SİBER SUÇLARLA MÜCADELE ŞUBE MÜDÜRLÜĞÜ
                  </h4>
                  <p className="text-[10px] text-zinc-400">HTS Baz İstasyonu & CCTV Dijital Güvenlik Zaman Damgası Dökümü</p>
                </div>
                <span className="bg-indigo-950 border border-indigo-500 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                  SİGNAL MATCH
                </span>
              </div>

              <div className="whitespace-pre-wrap font-mono text-[11px] md:text-[12px] bg-zinc-900 p-4 rounded border border-zinc-800 text-emerald-400">
                {evidence.cyberHtsLogMarkdown}
              </div>
            </div>
          )}

          {/* UV Hidden Clue Banner if Active */}
          {uvMode && evidence.hiddenClueUV && (
            <div className="p-3 bg-purple-900/80 border-2 border-purple-400 rounded-lg text-purple-100 text-xs font-bold animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300 shrink-0" />
              <span>{evidence.hiddenClueUV}</span>
            </div>
          )}

          {/* Magnifier Hidden Clue Banner if Active */}
          {zoomMode && evidence.hiddenClueMagnifier && (
            <div className="p-3 bg-amber-900/80 border-2 border-amber-400 rounded-lg text-amber-100 text-xs font-bold flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{evidence.hiddenClueMagnifier}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`flex items-center justify-between px-5 py-3 border-t-2 ${
          uvMode ? 'bg-purple-900 border-purple-700' : 'bg-[#cbb68d] border-[#b59e74]'
        }`}>
          <button
            onClick={() => unpinEvidenceFromBoard(evidence.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-900 hover:bg-red-800 text-white font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Panodan Sök / Kaldır</span>
          </button>

          <button
            onClick={closeInspectEvidence}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-200 font-bold text-xs rounded-lg cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

