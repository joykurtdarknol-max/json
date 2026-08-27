import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { CaseManifestItem } from '../types/case';
import { getDiscoveredCases } from '../services/caseRegistry';
import { 
  FolderArchive, 
  X, 
  Play, 
  Lock, 
  Calendar, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { sounds } from '../services/audio';

const GITHUB_MANIFEST_URLS = [
  'https://raw.githubusercontent.com/joykurtdarknol-max/json/main/cases.json',
  'https://raw.githubusercontent.com/joykurtdarknol-max/json/main/cases/cases.json',
  'https://raw.githubusercontent.com/joykurtdarknol-max/json/master/cases.json',
  'https://raw.githubusercontent.com/joykurtdarknol-max/json/master/cases/cases.json',
];

interface CaseArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaseArchiveModal: React.FC<CaseArchiveModalProps> = ({ isOpen, onClose }) => {
  const { loadCaseById, activeCaseId, solvedCaseIds } = useGameStore();
  const [casesList, setCasesList] = useState<CaseManifestItem[]>(() => getDiscoveredCases());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local'>('local');

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchManifest = async () => {
      setIsSyncing(true);

      // 1. Instantly populate with auto-discovered cases from project
      const autoDiscovered = getDiscoveredCases();
      if (isMounted && autoDiscovered.length > 0) {
        setCasesList(autoDiscovered);
      }

      // 2. Fetch local /cases/cases.json to merge any extra meta if exists
      try {
        const localRes = await fetch('/cases/cases.json');
        if (localRes.ok) {
          const data: CaseManifestItem[] = await localRes.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            const existingIds = new Set(data.map((d) => d.id));
            const merged = [...data, ...autoDiscovered.filter((a) => !existingIds.has(a.id))];
            setCasesList(merged);
          }
        }
      } catch (err) {
        console.warn('Local manifest fetch error:', err);
      }

      // 3. Check remote GitHub repository (joykurtdarknol-max/json)
      for (const url of GITHUB_MANIFEST_URLS) {
        try {
          const freshUrl = `${url}?_t=${Date.now()}`;
          const remoteRes = await fetch(freshUrl, { cache: 'no-cache' });
          if (remoteRes.ok) {
            const remoteData: CaseManifestItem[] = await remoteRes.json();
            if (isMounted && Array.isArray(remoteData) && remoteData.length > 0) {
              const baseUrl = url.substring(0, url.lastIndexOf('/'));
              const formattedRemote = remoteData.map((item) => {
                const filePath = item.filePath?.startsWith('http')
                  ? item.filePath
                  : `${baseUrl}/${item.filePath?.replace(/^\//, '') || `${item.id}.json`}`;

                let thumbnail = item.thumbnail;
                if (thumbnail) {
                  if (thumbnail.startsWith('assets/')) {
                    thumbnail = `/${thumbnail}`;
                  } else if (!thumbnail.startsWith('/assets/') && !thumbnail.startsWith('http')) {
                    thumbnail = `${baseUrl}/${thumbnail.replace(/^\//, '')}`;
                  }
                }

                return {
                  ...item,
                  filePath,
                  thumbnail
                };
              });

              setCasesList((prev) => {
                const map = new Map<string, CaseManifestItem>();
                prev.forEach((c) => map.set(c.id, c));
                formattedRemote.forEach((c) => map.set(c.id, c));
                return Array.from(map.values());
              });
              setSyncStatus('synced');
              break;
            }
          }
        } catch {
          // Fallback to next URL
        }
      }

      if (isMounted) setIsSyncing(false);
    };

    fetchManifest();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectCase = async (c: CaseManifestItem) => {
    if (!c.isAvailable) {
      alert('Bu vaka şu anda soruşturma aşamasında ve henüz yayınlanmadı!');
      return;
    }
    sounds.playPaper();

    const success = await loadCaseById(c.id, c.filePath);
    if (success) {
      sounds.playEureka();
      onClose();
    } else {
      alert('Vaka dosyası yüklenirken bir hata oluştu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        className="relative w-full max-w-4xl bg-[#f4ebd0] text-zinc-950 rounded-2xl shadow-2xl border-2 sm:border-4 border-[#b59e74] overflow-hidden aged-paper font-police flex flex-col max-h-[96dvh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-[#cbb68d] px-3 sm:px-6 py-2.5 sm:py-4 border-b-2 border-[#b59e74] shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <FolderArchive className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-xs sm:text-base md:text-lg font-bold text-zinc-950 uppercase tracking-wider truncate">
                  MERKEZİ VAKA ARŞİVİ
                </h3>
                {syncStatus === 'synced' ? (
                  <span className="hidden sm:flex items-center gap-1 bg-emerald-900 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    Canlı Eşitlendi
                  </span>
                ) : (
                  <span className="hidden sm:flex items-center gap-1 bg-amber-900/20 text-amber-900 border border-amber-800/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Kontrol Ediliyor...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        Yerel Arşiv
                      </>
                    )}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-700">
                Soruşturulmaya hazır tüm resmi vaka dosyaları
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-700 hover:text-red-900 p-1 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: Case List Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {casesList.map((c) => {
              const isCurrent = activeCaseId === c.id;
              const isSolved = (solvedCaseIds || []).includes(c.id);

              return (
                <div
                  key={c.id}
                  className={`bg-white/80 border-2 rounded-xl p-4 flex flex-col justify-between shadow-md transition-all ${
                    isSolved
                      ? 'border-emerald-700/80 bg-emerald-950/5 shadow-emerald-950/20'
                      : c.isAvailable
                      ? 'border-amber-700/60 hover:shadow-xl hover:border-amber-600 hover:-translate-y-1'
                      : 'border-zinc-300 opacity-60'
                  } ${isCurrent ? 'ring-2 ring-amber-600' : ''}`}
                >
                  <div className="space-y-2.5">
                    {/* Thumbnail & Tag */}
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-zinc-300 bg-zinc-900 shadow-inner">
                      <img
                        src={
                          c.thumbnail || 
                          (c.id === 'case_201' ? '/assets/crime_scene_dressing_room.jpg' :
                           c.id === 'case_107' ? '/assets/dispatch_hammer.jpg' :
                           c.id === 'case_305' ? '/assets/toxin_vial.jpg' :
                           '/assets/pocket_watch.jpg')
                        }
                        alt={c.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/pocket_watch.jpg';
                        }}
                      />

                      <div className="absolute top-2 left-2 bg-zinc-950/90 border border-zinc-700 text-[9px] font-bold text-amber-300 px-2 py-0.5 rounded uppercase tracking-wider">
                        {c.tag}
                      </div>

                      {/* Top Right Solved Stamp */}
                      {isSolved && (
                        <div className="absolute top-2 right-2 bg-emerald-950/95 text-emerald-300 border-2 border-emerald-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg shadow-emerald-950/50">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>ÇÖZÜLDÜ</span>
                        </div>
                      )}

                      {c.isAvailable ? (
                        <div className={`absolute bottom-2 right-2 border text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          isSolved
                            ? 'bg-emerald-900/90 text-emerald-200 border-emerald-600'
                            : isCurrent
                            ? 'bg-amber-900/90 text-amber-200 border-amber-600'
                            : 'bg-zinc-900/90 text-zinc-300 border-zinc-700'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isCurrent ? 'MASADA AÇIK' : isSolved ? 'DAVA KAPANDI' : 'AKTİF VAKA'}</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-zinc-300 font-bold text-xs gap-1.5">
                          <Lock className="w-4 h-4" />
                          <span>YAKINDA</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Location */}
                    <div>
                      <h5 className="font-bold text-xs text-zinc-950 font-typewriter">
                        {c.title}
                      </h5>
                      <span className="text-[11px] text-zinc-600 block">
                        {c.subtitle}
                      </span>
                    </div>

                    <div className="space-y-1 text-[10px] text-zinc-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-800" />
                        <span>{c.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-800" />
                        <span>{c.location}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold">
                        <ShieldAlert className="w-3 h-3 text-red-800" />
                        <span>Zorluk: {c.difficulty}</span>
                      </div>
                    </div>

                    <p className="font-typewriter text-[11px] text-zinc-800 line-clamp-3 leading-relaxed border-t border-zinc-200 pt-2">
                      {c.summary}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-2 border-t border-zinc-300">
                    {c.isAvailable ? (
                      <button
                        onClick={() => handleSelectCase(c)}
                        className={`w-full py-2 font-bold text-xs rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                          isSolved
                            ? 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
                            : isCurrent
                            ? 'bg-amber-800 hover:bg-amber-700 text-amber-100'
                            : 'bg-amber-600 hover:bg-amber-500 text-zinc-950'
                        }`}
                      >
                        {isSolved ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Çözülen Vakayı İncele</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{isCurrent ? 'Masaya Dön' : 'Bu Vakayı Aç & Oyna'}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 bg-zinc-200 text-zinc-500 font-bold text-xs rounded-lg cursor-not-allowed text-center"
                      >
                        Dosya Hazırlanıyor...
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#cbb68d] px-6 py-3 border-t-2 border-[#b59e74] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-200 font-bold text-xs rounded-lg cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
