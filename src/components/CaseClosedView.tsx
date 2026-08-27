import React from 'react';
import { useGameStore } from '../store/gameStore';
import { RotateCcw, CheckCircle2, Award } from 'lucide-react';

export const CaseClosedView: React.FC = () => {
  const { restartCase, caseData } = useGameStore();

  const newspaper = caseData?.newspaper;

  return (
    <div className="relative w-full h-[calc(100vh-52px)] mt-[52px] bg-zinc-950 flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="absolute inset-0 bg-radial-gradient from-zinc-800/30 via-zinc-950/80 to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />

      {/* Vintage Newspaper / Court Verdict Card */}
      <div className="relative z-10 w-full max-w-2xl bg-[#f4ecd8] text-zinc-950 rounded-xl shadow-2xl border-4 border-[#c2ae87] p-6 md:p-8 space-y-6 aged-paper animate-in zoom-in-95 duration-300">
        {/* Newspaper Top Bar */}
        <div className="border-b-4 border-zinc-950 pb-3 text-center space-y-1">
          <div className="flex items-center justify-between text-[11px] font-police font-bold text-zinc-700 border-b border-zinc-800/40 pb-1">
            <span>{newspaper?.issueInfo || 'GÜNLÜK ASAYİŞ BÜLTENİ'}</span>
            <span>{caseData?.date || ''}</span>
          </div>
          <h1 className="font-cinzel text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950">
            {newspaper?.newspaperName || 'HÜR ASAYİŞ GAZETESİ'}
          </h1>
        </div>

        {/* Headline */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-police font-bold uppercase tracking-wider">
            <span className="bg-emerald-900 text-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              DEDEKTİF ZAFERİ // DAVA ÇÖZÜLDÜ
            </span>
          </div>
          <h2 className="font-typewriter text-xl md:text-2xl font-bold text-zinc-950">
            {newspaper?.headline || `${caseData?.title}: DAVA ÇÖZÜLDÜ!`}
          </h2>
        </div>

        {/* Newspaper Article Body */}
        <div className="space-y-4 font-typewriter text-xs md:text-sm text-zinc-800 leading-relaxed border-t border-b border-zinc-400 py-4">
          <p>
            {newspaper?.article || caseData?.solution?.correctVerdictSummary || 'Dedektifimizin kusursuz delil zinciri ve sorgu odasındaki taktikleri sayesinde dava çözüldü.'}
          </p>

          <div className="p-3.5 bg-emerald-950/10 border-l-4 border-emerald-700 text-emerald-950 font-bold text-xs space-y-1">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-800" />
              <span>{newspaper?.commendationTitle || 'BAŞKOMİSERLİK TAKDİRNAMESİ'}</span>
            </div>
            <p className="font-police text-[11px] font-normal text-zinc-700">
              {newspaper?.commendationBody || 'Olay yeri incelemesindeki yüksek titizlik, mantar panodaki hipotez eşleştirmeleri ve resmi iddianamenin sağlamlığı sebebiyle tebrik ederiz.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-police text-zinc-600 font-bold">
            ARŞİV KAYIT NO: #{caseData?.id?.toUpperCase() || 'CASE'}
          </span>

          <button
            onClick={restartCase}
            className="flex items-center gap-2 px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-police font-bold text-xs rounded-lg shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Vakayı Baştan Oyna</span>
          </button>
        </div>
      </div>
    </div>
  );
};
