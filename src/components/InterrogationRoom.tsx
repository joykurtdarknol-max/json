import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { sounds } from '../services/audio';
import { 
  User, 
  Fingerprint, 
  FileText, 
  Gavel, 
  Calendar, 
  AlertCircle
} from 'lucide-react';

export const InterrogationRoom: React.FC = () => {
  const { 
    suspects, 
    activeSuspectId, 
    setActiveSuspect, 
    openAccusationModal,
    caseData 
  } = useGameStore();

  const [mobileTab, setMobileTab] = useState<'deposition' | 'profile'>('deposition');

  const activeSuspect = suspects.find((s) => s.id === activeSuspectId) || suspects[0];

  const handleSelectSuspect = (id: string) => {
    sounds.playPaper();
    setActiveSuspect(id);
  };

  if (!activeSuspect) {
    return (
      <div className="relative w-full h-[calc(100vh-52px)] mt-[52px] bg-zinc-950 flex items-center justify-center text-zinc-400 font-police">
        Şüpheli bilgisi yükleniyor...
      </div>
    );
  }

  const suspectPhoto = activeSuspect.imageNormal || activeSuspect.imageInterrogation;
  const dialogueItems = activeSuspect.dialogueTree || [];
  const suspectRole = activeSuspect.role || (activeSuspect as any).occupation || 'Şüpheli';

  return (
    <div className="relative w-full h-[calc(100dvh-52px-54px)] md:h-[calc(100vh-52px)] mt-[52px] bg-zinc-950 flex flex-col overflow-hidden select-none font-police">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />

      {/* Top Common Bar: Suspect Selector & Mobile Tabs */}
      <div className="relative z-20 w-full bg-zinc-950/95 border-b border-zinc-800/80 px-3 sm:px-4 py-2 shrink-0 space-y-2">
        {/* Suspect Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>Şüpheliler:</span>
          </span>
          {suspects.map((s) => {
            const isSelected = activeSuspect.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSuspect(s.id)}
                className={`shrink-0 flex items-center gap-2 py-1 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 border-amber-400 text-zinc-950 shadow-md font-extrabold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span>{s.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-amber-800 text-amber-100' : 'bg-zinc-800 text-zinc-400'}`}>
                  {s.age}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile 2-Way Tab Bar (Sorgu Tutanağı vs Şüpheli Profili) */}
        <div className="flex md:hidden items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => { sounds.playPaper(); setMobileTab('deposition'); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'deposition'
                ? 'bg-[#fcf7ec] text-zinc-950 shadow font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-800" />
            <span>Resmi Sorgu Tutanağı</span>
          </button>
          <button
            onClick={() => { sounds.playPaper(); setMobileTab('profile'); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'profile'
                ? 'bg-amber-600 text-zinc-950 shadow font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-zinc-950" />
            <span>Profil & Biyografi</span>
          </button>
        </div>
      </div>

      {/* Main Dual-View Container */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Suspect Official Bio Dossier Card               */}
        {/* ============================================================ */}
        <div className={`relative z-10 w-full md:w-5/12 lg:w-4/12 border-b md:border-b-0 md:border-r border-zinc-800/80 p-3 sm:p-4 md:p-6 flex-col justify-between overflow-y-auto bg-zinc-950/80 backdrop-blur-xs flex-1 md:flex-initial ${
          mobileTab === 'profile' ? 'flex' : 'hidden md:flex'
        }`}>
          <div>

          {/* Suspect Photo & Biometric Card */}
          <div className="relative bg-zinc-900 border-2 border-zinc-700/80 rounded-xl p-4 shadow-xl overflow-hidden mb-4">
            {/* Red Classified Stamp */}
            <div className="absolute top-3 right-3 border-2 border-red-800/80 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded transform rotate-6 uppercase tracking-wider bg-red-950/40">
              GÖZALTINDA
            </div>

            <div className="flex items-center gap-4 mb-4">
              {/* Photo */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border-2 border-zinc-600 bg-zinc-950 shrink-0 shadow-inner">
                {suspectPhoto ? (
                  <img
                    src={suspectPhoto}
                    alt={activeSuspect.name}
                    className="w-full h-full object-cover filter contrast-110 grayscale"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-950">
                    <User className="w-10 h-10 opacity-50" />
                    <span className="text-[9px] font-bold mt-1">FOTO YOK</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-center text-[9px] text-zinc-300 py-0.5 font-bold">
                  #{activeSuspect.id.toUpperCase()}
                </div>
              </div>

              {/* Identity Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-typewriter text-base sm:text-lg font-bold text-zinc-100 truncate">
                  {activeSuspect.name}
                </h3>
                <p className="text-amber-400 font-bold text-xs mt-0.5 truncate">
                  {suspectRole}
                </p>
                <div className="mt-2 text-[11px] text-zinc-400 space-y-0.5">
                  <div><strong className="text-zinc-300">Yaş:</strong> {activeSuspect.age}</div>
                  <div><strong className="text-zinc-300">Dosya:</strong> {caseData?.id || 'Vaka #305'}</div>
                  <div className="text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Parmak İzi Alındı</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Suspect Motive & Alibi Info Cards */}
            <div className="space-y-2.5 pt-3 border-t border-zinc-800 text-xs">
              <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/80">
                <div className="text-red-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Şüphe & Olası Motivasyon:</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  {activeSuspect.motive || 'Maktul ile geçmişteki husumet ve menfaat çatışması.'}
                </p>
              </div>

              <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/80">
                <div className="text-amber-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Olay Gecesi Alibisi:</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  {activeSuspect.alibi || 'İlk ifadesinde olay saatinde başka bir yerde olduğunu iddia etmektedir.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accusation Button */}
        <button
          onClick={openAccusationModal}
          className="w-full py-3 px-4 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs rounded-xl shadow-lg border border-red-500/50 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <Gavel className="w-4 h-4 text-amber-300" />
          <span>İddianamede Bu Şüpheliyi Suçla</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: Official Police Deposition & Interrogation Log */}
      {/* ============================================================ */}
      <div className={`relative z-10 flex-1 p-2.5 sm:p-4 md:p-6 overflow-y-auto bg-zinc-900/40 flex-col justify-start ${
        mobileTab === 'deposition' ? 'flex' : 'hidden md:flex'
      }`}>
        {/* Official Document Paper Container */}
        <div 
          className="relative w-full max-w-4xl mx-auto bg-[#fcf7ec] text-zinc-950 rounded-lg shadow-2xl border-4 border-[#c7b28b] p-6 md:p-8 space-y-6"
          style={{
            backgroundImage: 'radial-gradient(#e8dcbe 8%, transparent 9%)',
            backgroundSize: '22px 22px',
            boxShadow: '0 15px 40px -10px rgba(0,0,0,0.8), inset 0 0 35px rgba(160, 120, 60, 0.15)'
          }}
        >
          {/* Header of Official Police Form */}
          <div className="border-b-2 border-zinc-900/60 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">
                  T.C. İSTANBUL EMNİYET MÜDÜRLÜĞÜ // ASAYİŞ ŞUBE CİNAYET MASASI
                </span>
                <h2 className="font-typewriter text-base sm:text-xl font-bold text-zinc-950 uppercase tracking-tight mt-1">
                  RESMİ İFADE VE SORGU TUTANAĞI
                </h2>
              </div>

              {/* Vintage Stamp */}
              <div className="self-start sm:self-auto border-3 border-red-800 text-red-800 px-3 py-1 rounded font-typewriter font-bold text-xs tracking-widest transform -rotate-2 uppercase bg-red-900/5 shadow-xs border-dashed">
                ONAYLI ZABIT
              </div>
            </div>

            {/* Official Case Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-zinc-400 font-police text-xs text-zinc-800">
              <div>
                <span className="font-bold text-zinc-950">ŞÜPHELİ:</span>
                <div className="truncate">{activeSuspect.name}</div>
              </div>
              <div>
                <span className="font-bold text-zinc-950">MESLEK / YAŞ:</span>
                <div className="truncate">{suspectRole} ({activeSuspect.age})</div>
              </div>
              <div>
                <span className="font-bold text-zinc-950">TARİH / MAHAL:</span>
                <div className="truncate">{caseData?.date || '14 Kasım 1994'}</div>
              </div>
              <div>
                <span className="font-bold text-zinc-950">SORGU AMİRİ:</span>
                <div>Cinayet Büro Amiri</div>
              </div>
            </div>
          </div>

          {/* Section 1: Initial Statement / Deposition */}
          <div className="bg-[#f9f2df] border border-[#d6c7a7] p-4 rounded-md shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-900 uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4 text-red-800" />
              <span>Bölüm 1: Şüphelinin Olay Gecesi İlk Beyanı</span>
            </div>
            <p className="font-police text-xs sm:text-sm text-zinc-900 leading-relaxed italic">
              "{activeSuspect.alibi || 'Olay gecesi hakkında sorulan ilk sorulara şüpheli tarafından verilen resmi beyandır.'}"
            </p>
          </div>

          {/* Section 2: Questions & Suspect Transcripts */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-zinc-300 pb-2">
              <h4 className="font-typewriter text-xs sm:text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-red-800 rounded-xs"></span>
                Bölüm 2: Sorgu Odası Soru ve Cevap Zabıtları ({dialogueItems.length})
              </h4>
              <span className="text-[11px] font-handwriting text-zinc-600 hidden sm:inline">
                *Tüm soru ve yanıtlar daktilo ile kayda geçirilmiştir
              </span>
            </div>

            {dialogueItems.length === 0 ? (
              <div className="text-center py-8 text-zinc-600 font-police text-xs">
                Bu şüpheliye ait henüz eklenmiş sorgu tutanağı bulunmuyor.
              </div>
            ) : (
              <div className="space-y-3.5">
                {dialogueItems.map((item, idx) => {
                  const answerText = item.response || 'Cevap verilmedi.';
                  return (
                    <div 
                      key={idx}
                      className="bg-white/70 border border-zinc-300/90 rounded-md p-4 shadow-xs space-y-2 hover:bg-white/90 transition-colors"
                    >
                      {/* Question */}
                      <div className="flex items-start gap-2 text-xs sm:text-sm">
                        <span className="font-typewriter font-bold text-red-900 shrink-0">
                          SORU 0{idx + 1}:
                        </span>
                        <p className="font-typewriter font-bold text-zinc-950">
                          {item.question}
                        </p>
                      </div>

                      {/* Answer */}
                      <div className="flex items-start gap-2 text-xs sm:text-sm pl-4 border-l-2 border-red-800/40 ml-1">
                        <span className="font-police font-bold text-zinc-700 shrink-0">
                          CEVAP:
                        </span>
                        <p className="font-police text-zinc-900 leading-relaxed">
                          "{answerText}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Official Signatures */}
          <div className="pt-6 border-t-2 border-dashed border-zinc-400 text-xs text-zinc-700">
            <p className="font-police text-[11px] text-zinc-600 italic mb-4">
              "İşbu ifade ve sorgu tutanağı şüphelinin huzurunda okunmuş, beyanlarının zaptedilen metinle birebir uyuştuğu tasdik edilerek imzalanmıştır."
            </p>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="border-t border-zinc-400 pt-2 text-center">
                <div className="font-handwriting text-lg sm:text-xl text-zinc-900 leading-none mb-1">
                  {activeSuspect.name}
                </div>
                <span className="font-police text-[10px] text-zinc-600 uppercase font-bold">
                  İFADE SAHİBİ (ŞÜPHELİ)
                </span>
              </div>

              <div className="border-t border-zinc-400 pt-2 text-center">
                <div className="font-police text-xs sm:text-sm font-bold text-red-900 leading-none mb-1 tracking-wider">
                  [MÜHÜR VE PARAF]
                </div>
                <span className="font-police text-[10px] text-zinc-600 uppercase font-bold">
                  SORUŞTURMA DEDEKTİFİ / AMİRİ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

