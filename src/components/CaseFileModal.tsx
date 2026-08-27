import React from 'react';
import { useGameStore } from '../store/gameStore';
import { sounds } from '../services/audio';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Pin, 
  Check, 
  Paperclip,
  ExternalLink,
  ShieldAlert,
  FileText,
  Bookmark,
  Search
} from 'lucide-react';

// Helper to render markdown content with typewriter and handwritten detective notes
const DynamicMarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  // Split into paragraph blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-4 font-police text-zinc-900 leading-relaxed text-xs md:text-sm">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // Header (### or ##)
        if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <div key={idx} className="border-b-2 border-zinc-800/60 pb-1.5 pt-2">
              <h3 className="font-typewriter text-sm md:text-base font-bold text-zinc-950 uppercase tracking-wide flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-red-800 rounded-xs"></span>
                {headerText}
              </h3>
            </div>
          );
        }

        // Detective handwritten note blockquote (> **Dedektif Notu:** ... or > ...)
        if (trimmed.startsWith('>')) {
          const noteText = trimmed.replace(/^>\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '');
          return (
            <div 
              key={idx} 
              className="relative my-3 p-3.5 bg-amber-100/90 border-l-4 border-red-700 shadow-sm rounded-r transform -rotate-0.5 text-red-950"
            >
              <div className="absolute -top-2.5 right-3 text-[10px] bg-red-800 text-amber-50 px-2 py-0.5 rounded font-police uppercase tracking-wider font-bold shadow-xs">
                Dedektif Notu
              </div>
              <p className="font-handwriting text-base md:text-lg leading-snug">
                {noteText.replace(/^Dedektif Notu:\s*/i, '')}
              </p>
            </div>
          );
        }

        // Bullet or numbered lists
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
          const items = trimmed.split('\n');
          return (
            <ul key={idx} className="space-y-2 pl-2">
              {items.map((item, itemIdx) => {
                const itemClean = item.replace(/^[-*]\s*|^\d+\.\s*/, '');
                // Highlight **bold** inside item
                const parts = itemClean.split(/(\*\*.*?\*\*)/g);
                return (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <span className="text-red-800 font-bold select-none text-xs mt-0.5">▪</span>
                    <span className="text-zinc-900">
                      {parts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={pIdx} className="font-bold text-zinc-950 font-typewriter">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return part;
                      })}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Regular paragraph with bold support
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx} className="text-zinc-900">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-bold text-zinc-950 font-typewriter">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
};

export const CaseFileModal: React.FC = () => {
  const { 
    isCaseFileOpen, 
    closeCaseFile, 
    currentPage, 
    setPage, 
    pinEvidenceToBoard, 
    isEvidencePinned,
    openInspectEvidence,
    setView,
    caseData 
  } = useGameStore();

  if (!isCaseFileOpen) return null;

  const filePages = caseData?.filePages || [];
  const totalPages = filePages.length || 1;
  const activePageData = filePages.find((p, idx) => (p.pageNumber ?? idx + 1) === currentPage) || filePages[0];
  
  // Find associated evidences for this page
  const pageEvidences = (caseData?.evidences || []).filter(
    (e) => activePageData?.associatedEvidenceIds?.includes(e.id)
  );

  const handleNext = () => {
    if (currentPage < totalPages) {
      sounds.playPaper();
      setPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      sounds.playPaper();
      setPage(currentPage - 1);
    }
  };

  const handleTabClick = (pageNum: number) => {
    if (pageNum !== currentPage) {
      sounds.playPaper();
      setPage(pageNum);
    }
  };

  const handlePin = (evidenceId: string) => {
    sounds.playPin();
    pinEvidenceToBoard(evidenceId);
  };

  const caseIdDisplay = caseData?.id?.replace(/^case_/, '') || '104';
  const rawTitle = caseData?.title || 'DOSYA';
  const cleanTitle = rawTitle.replace(/^vaka\s*#\w+:\s*/i, '').replace(/^vaka\s*#\w+\s*\/\/\s*/i, '');
  const activeContent = activePageData?.contentMarkdown || (activePageData as any)?.content || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={closeCaseFile} />

      {/* Physical Manila Folder Wrapper */}
      <div 
        className="relative w-full max-w-5xl max-h-[96dvh] sm:max-h-[92vh] flex flex-col bg-[#dfcca4] text-zinc-900 rounded-t-xl rounded-b-lg shadow-2xl border-2 sm:border-4 border-[#bca06c] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), inset 0 0 40px rgba(140, 100, 40, 0.25)'
        }}
      >
        {/* Top Protruding Manila Tabs Bar */}
        <div className="bg-[#cca972] border-b-2 border-[#b08e56] px-2 sm:px-4 pt-1.5 sm:pt-2 flex items-center justify-between gap-1.5 overflow-x-auto select-none">
          {/* Main Case Tab & Page Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <div className="flex items-center gap-1.5 bg-[#ecd9b8] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-t-md border-t-2 border-x-2 border-[#b08e56] shadow-xs shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 text-red-800" />
              <span className="font-police font-bold text-[11px] sm:text-xs text-zinc-950 uppercase tracking-wider truncate max-w-[120px] sm:max-w-[240px]">
                VAKA #{caseIdDisplay} // {cleanTitle}
              </span>
            </div>

            {/* Sub Tabs for Each Page (Mobile & Desktop) */}
            <div className="flex items-center gap-1 pl-1 shrink-0">
              {filePages.map((page, idx) => {
                const pageNum = page.pageNumber ?? (idx + 1);
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handleTabClick(pageNum)}
                    className={`px-2 sm:px-3 py-1 text-xs font-police font-bold rounded-t transition-all cursor-pointer border-t border-x ${
                      isActive
                        ? 'bg-[#fcf7ec] text-red-900 border-[#9e7f4c] shadow-sm -mb-px pb-1.5'
                        : 'bg-[#cca972]/80 hover:bg-[#deb77e] text-zinc-800 border-[#b08e56]'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Bookmark className={`w-3 h-3 ${isActive ? 'text-red-700' : 'text-zinc-600'}`} />
                      <span>S.{pageNum}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={closeCaseFile}
            className="text-zinc-800 hover:text-red-900 hover:bg-[#b8955e] p-1.5 rounded transition-colors cursor-pointer"
            title="Dosyayı Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Dossier Paper (Typed Crime Report) */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-[#fcf7ec] relative"
          style={{
            backgroundImage: 'radial-gradient(#e5d8be 8%, transparent 9%)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Metal Binder Clip Graphic on Left/Top Corner */}
          <div className="absolute top-2 left-6 hidden md:flex items-center gap-1 opacity-70 pointer-events-none select-none z-10">
            <Paperclip className="w-6 h-6 text-zinc-600 transform -rotate-45" />
            <span className="font-police text-[10px] text-zinc-500 uppercase tracking-widest">
              EK: ADLİ EVRAK #0{currentPage}
            </span>
          </div>

          {/* Document Header Section */}
          <div className="border-b-2 border-zinc-900/50 pb-4 mb-5 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-police text-[11px] font-bold text-red-900 tracking-widest uppercase bg-red-950/10 px-2 py-0.5 rounded border border-red-900/30">
                    {activePageData?.classification || 'GİZLİ // ADLİ KOLLUK RAPORU'}
                  </span>
                  <span className="text-[11px] font-police text-zinc-600">
                    SAYFA {currentPage} / {totalPages}
                  </span>
                </div>
                <h1 className="font-typewriter text-lg md:text-xl font-bold text-zinc-950 uppercase tracking-tight mt-1.5">
                  {activePageData?.title || caseData?.title}
                </h1>
              </div>

              {/* Dynamic Vintage Rubber Stamp */}
              <div className="self-start md:self-auto border-3 border-red-800/90 text-red-800 px-3.5 py-1 rounded font-typewriter font-bold text-xs tracking-widest transform -rotate-3 uppercase bg-red-900/5 shadow-xs border-dashed">
                {activePageData?.classification ? activePageData.classification.replace('//', '•') : 'RESMİ DELİL DOSYASI'}
              </div>
            </div>

            {/* Official Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-300 font-police text-xs text-zinc-700">
              <div>
                <span className="font-bold text-zinc-900">TARİH: </span>
                <span>{caseData?.date || 'Belirtilmemiş'}</span>
              </div>
              <div>
                <span className="font-bold text-zinc-900">KONUM: </span>
                <span>{caseData?.location || 'Olay Yeri'}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="font-bold text-zinc-900">STATÜ: </span>
                <span className="text-amber-900 font-semibold">SORUŞTURMA DEVAM EDİYOR</span>
              </div>
            </div>
          </div>

          {/* Dynamic Content Area (Markdown & Handwritten Notes) */}
          <div className="bg-[#fdfaf2] p-4 md:p-6 rounded border border-zinc-300/80 shadow-xs relative">
            <DynamicMarkdownContent content={activeContent} />
          </div>

          {/* Paperclipped Evidence Section (Polaroids & Attachments) */}
          {pageEvidences.length > 0 && (
            <div className="mt-6 pt-5 border-t-2 border-dashed border-zinc-400">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-red-800" />
                  <h3 className="font-typewriter text-xs md:text-sm font-bold text-zinc-950 uppercase tracking-wider">
                    BU SAYFAYA İLİŞTİRİLMİŞ DELİLLER & FOTOĞRAFLAR ({pageEvidences.length})
                  </h3>
                </div>
                <span className="text-xs font-handwriting text-zinc-600 hidden sm:inline">
                  *Delilin üzerine tıklayarak büyüteç ve UV ışıkla detaylı inceleyebilirsiniz
                </span>
              </div>

              {/* Grid of Polaroid/Evidence Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pageEvidences.map((evidence) => {
                  const isPinned = isEvidencePinned(evidence.id);
                  const evidenceImg = evidence.image || (evidence as any).assetUrl;

                  return (
                    <div
                      key={evidence.id}
                      onClick={() => openInspectEvidence(evidence.id)}
                      className="relative bg-[#faf7f0] hover:bg-[#fffdf8] border border-[#d6c7a7] hover:border-amber-700/70 rounded p-3.5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
                      style={{
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 0 15px rgba(200, 170, 120, 0.1)'
                      }}
                      title="Detaylı incelemek için tıklayın"
                    >
                      {/* Visual Paperclip on top of evidence */}
                      <div className="absolute -top-3 left-4 z-10 text-zinc-500 opacity-90 drop-shadow-xs">
                        <Paperclip className="w-5 h-5 transform -rotate-12" />
                      </div>

                      <div className="flex items-start gap-3.5 pt-1">
                        {/* Evidence Photo / Polaroid */}
                        {evidenceImg ? (
                          <div className="relative shrink-0 bg-white p-1 pb-2 rounded-xs border border-zinc-300 shadow-sm transform group-hover:rotate-1 transition-transform">
                            <img
                              src={evidenceImg}
                              alt={evidence.title}
                              className="w-16 h-16 object-cover rounded-xs border border-zinc-200 filter contrast-105"
                            />
                            <div className="text-[9px] font-handwriting text-center text-zinc-600 mt-0.5 truncate max-w-[64px]">
                              #DELİL
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 shrink-0 bg-amber-950/10 border border-amber-900/30 rounded flex flex-col items-center justify-center text-amber-950 p-1 text-center">
                            <FileText className="w-5 h-5 opacity-70" />
                            <span className="font-police font-bold text-[9px] mt-0.5">RESMİ EVRAK</span>
                          </div>
                        )}

                        {/* Evidence Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-typewriter font-bold text-xs md:text-sm text-zinc-950 truncate group-hover:text-amber-900 transition-colors">
                              {evidence.title}
                            </h4>
                          </div>
                          <p className="font-police text-xs text-zinc-700 mt-1 line-clamp-2 leading-relaxed">
                            {evidence.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Bottom Bar: Inspect & Pin */}
                      <div className="mt-3 pt-2.5 border-t border-zinc-200/80 flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInspectEvidence(evidence.id);
                          }}
                          className="flex items-center gap-1 text-[11px] font-police font-bold text-amber-900 hover:text-amber-700 bg-amber-100/60 hover:bg-amber-100/90 px-2 py-1 rounded transition-colors cursor-pointer"
                        >
                          <Search className="w-3 h-3 text-amber-800" />
                          <span>İncele</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePin(evidence.id);
                          }}
                          disabled={isPinned}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-police font-bold transition-all cursor-pointer ${
                            isPinned
                              ? 'bg-emerald-800 text-emerald-100 cursor-default opacity-85 shadow-inner'
                              : 'bg-red-800 hover:bg-red-700 text-white shadow-md active:scale-95'
                          }`}
                        >
                          {isPinned ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Panoya Çakıldı</span>
                            </>
                          ) : (
                            <>
                              <Pin className="w-3.5 h-3.5 text-amber-300" />
                              <span>Panoya İğnele</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>


        {/* Physical Manila Folder Bottom Bar */}
        <div className="bg-[#cca972] px-5 py-3 border-t-2 border-[#b08e56] flex items-center justify-between select-none">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded font-police font-bold text-xs bg-zinc-900 hover:bg-zinc-800 text-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Önceki Sayfa</span>
          </button>

          <div className="font-typewriter text-xs font-bold text-zinc-900 tracking-wider">
            SAYFA {currentPage} / {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeCaseFile();
                setView('board');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded font-police font-bold text-xs bg-amber-900 hover:bg-amber-800 text-amber-100 transition-all cursor-pointer shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Panoya Git</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded font-police font-bold text-xs bg-zinc-900 hover:bg-zinc-800 text-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow"
            >
              <span>Sonraki Sayfa</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

