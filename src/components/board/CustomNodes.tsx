import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { EvidenceItem } from '../../types/case';
import { useGameStore } from '../../store/gameStore';
import { Eye, Fingerprint } from 'lucide-react';

// 1. Compact Polaroid Node
export const PolaroidNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const evidence = data.evidence as EvidenceItem;
  const { openInspectEvidence, connectingSourceId, selectPinForConnection } = useGameStore();

  const isConnectingSource = connectingSourceId === id;

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectPinForConnection(id);
  };

  return (
    <div 
      className={`group relative w-36 bg-[#fbfaf5] p-2.5 pt-4 rounded-sm shadow-xl transition-all select-none hover:shadow-2xl ${
        selected ? 'ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''
      } ${isConnectingSource ? 'ring-4 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-105' : ''}`}
    >
      {/* 3D Realistic Pushpin Head (Layered over the string) */}
      <div 
        onClick={handlePinClick}
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
        title="İp bağlamak için raptiyeye tıklayın"
      >
        <div className={`w-5 h-5 rounded-full border-2 border-white shadow-[0_3px_6px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform hover:scale-125 active:scale-95 ${
          isConnectingSource ? 'bg-amber-400 animate-pulse ring-4 ring-amber-300' : 'bg-red-700 hover:bg-red-600'
        }`}>
          <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-inner" />
        </div>
      </div>

      {/* Unified Handles precisely at Pushpin Center */}
      <Handle
        type="target"
        position={Position.Top}
        id="pin"
        style={{
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 22,
          height: 22,
          background: 'transparent',
          border: 'none',
          zIndex: 30,
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="pin"
        style={{
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 22,
          height: 22,
          background: 'transparent',
          border: 'none',
          zIndex: 30,
        }}
      />

      {/* Card Content - Click to Inspect */}
      <div onClick={() => openInspectEvidence(evidence.id)} className="cursor-pointer">
        {/* Photo or Evidence Tag Area */}
        {evidence.image ? (
          <div className="w-full h-24 bg-zinc-900 rounded-sm overflow-hidden border border-zinc-300 shadow-inner">
            <img
              src={evidence.image}
              alt={evidence.title}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        ) : (
          <div className="w-full h-24 bg-[#ebe2cb] border-2 border-dashed border-[#b8a47e] rounded-sm p-2 flex flex-col justify-between shadow-inner text-zinc-900">
            <div className="flex items-center justify-between text-[8px] font-police font-bold text-zinc-700">
              <span className="bg-red-950 text-white px-1 py-0.5 rounded">DELİL</span>
              <Fingerprint className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <p className="font-typewriter text-[9px] font-semibold text-zinc-800 line-clamp-3 text-center leading-tight">
              {evidence.description || evidence.title}
            </p>
            <div className="text-[7px] font-police text-zinc-600 border-t border-zinc-400/60 pt-0.5 text-center uppercase tracking-wider">
              {evidence.category}
            </div>
          </div>
        )}

        {/* Caption */}
        <div className="mt-1.5 text-center">
          <h4 className="font-police font-bold text-[11px] text-zinc-950 truncate">
            {evidence.title}
          </h4>
          {evidence.handwrittenNote && (
            <p className="font-handwriting text-blue-900 text-xs font-bold truncate">
              "{evidence.handwrittenNote}"
            </p>
          )}
        </div>

        {/* Hover Inspect Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center text-white z-20 pointer-events-none">
          <div className="flex items-center gap-1 bg-zinc-900/90 px-2 py-1 rounded text-[10px] font-police font-bold">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>İncele / Sök</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Compact Document Node
export const DocumentNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const evidence = data.evidence as EvidenceItem;
  const { openInspectEvidence, connectingSourceId, selectPinForConnection } = useGameStore();

  const isConnectingSource = connectingSourceId === id;

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectPinForConnection(id);
  };

  return (
    <div 
      className={`group relative w-40 bg-[#f4ebd0] p-3 pt-4 rounded shadow-xl transition-all select-none aged-paper hover:shadow-2xl ${
        selected ? 'ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''
      } ${isConnectingSource ? 'ring-4 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-105' : ''}`}
    >
      {/* 3D Pushpin */}
      <div 
        onClick={handlePinClick}
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
        title="İp bağlamak için raptiyeye tıklayın"
      >
        <div className={`w-5 h-5 rounded-full border-2 border-white shadow-[0_3px_6px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform hover:scale-125 active:scale-95 ${
          isConnectingSource ? 'bg-amber-400 animate-pulse ring-4 ring-amber-300' : 'bg-red-700 hover:bg-red-600'
        }`}>
          <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-inner" />
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="pin"
        style={{
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 22,
          height: 22,
          background: 'transparent',
          border: 'none',
          zIndex: 30,
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="pin"
        style={{
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 22,
          height: 22,
          background: 'transparent',
          border: 'none',
          zIndex: 30,
        }}
      />

      <div onClick={() => openInspectEvidence(evidence.id)} className="cursor-pointer">
        <div className="border-b border-zinc-400 pb-1 mb-1">
          <span className="text-[9px] font-police font-bold uppercase tracking-wider bg-red-900 text-white px-1.5 py-0.2 rounded">
            {evidence.category === 'forensic' ? 'OTOPSİ' : 'BELGE'}
          </span>
          <h4 className="font-typewriter font-bold text-xs text-zinc-950 mt-1 truncate">
            {evidence.title}
          </h4>
        </div>

        <p className="font-typewriter text-[10px] text-zinc-800 line-clamp-2 leading-tight">
          {evidence.description}
        </p>

        {evidence.handwrittenNote && (
          <p className="font-handwriting text-red-900 text-xs font-bold mt-1.5 truncate border-t border-zinc-300 pt-1">
            *{evidence.handwrittenNote}
          </p>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center text-white z-20 pointer-events-none">
          <div className="flex items-center gap-1 bg-zinc-900/90 px-2 py-1 rounded text-[10px] font-police font-bold">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>İncele / Sök</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Compact Yellow Post-It Node
export const PostItNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { connectingSourceId, selectPinForConnection, deleteCustomNote, openInspectNote } = useGameStore();
  const isConnectingSource = connectingSourceId === id;
  const isCustom = id.startsWith('custom_note_');

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectPinForConnection(id);
  };

  const handleNoteClick = () => {
    openInspectNote({
      id,
      title: (data.title as string) || 'DEDEKTİF NOTU',
      text: (data.text as string) || '',
      isCustom,
    });
  };

  return (
    <div 
      className={`group relative w-44 bg-[#fef08a] p-3 pt-4 rounded shadow-xl transition-all select-none border-t-4 border-yellow-400 hover:shadow-2xl ${
        selected ? 'ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''
      } ${isConnectingSource ? 'ring-4 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-105' : ''}`}
    >
      {/* 3D Pushpin */}
      <div 
        onClick={handlePinClick}
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
        title="İp bağlamak için raptiyeye tıklayın"
      >
        <div className={`w-5 h-5 rounded-full border-2 border-white shadow-[0_3px_6px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform hover:scale-125 active:scale-95 ${
          isConnectingSource ? 'bg-amber-400 animate-pulse ring-4 ring-amber-300' : 'bg-red-700 hover:bg-red-600'
        }`}>
          <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-inner" />
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="pin"
        style={{
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 22,
          height: 22,
          background: 'transparent',
          border: 'none',
          zIndex: 30,
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="pin"
        style={{
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 22,
          height: 22,
          background: 'transparent',
          border: 'none',
          zIndex: 30,
        }}
      />

      {isCustom && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteCustomNote(id);
          }}
          className="absolute top-1 right-1 text-zinc-500 hover:text-red-900 font-bold text-xs p-1 cursor-pointer z-20"
          title="Notu Panodan Sil"
        >
          ✕
        </button>
      )}

      {/* Clickable Note Body */}
      <div 
        onClick={handleNoteClick}
        className="cursor-pointer group/body"
        title="Notu büyütmek ve düzenlemek için tıklayın"
      >
        <h5 className="font-police font-bold text-[10px] text-red-950 uppercase tracking-wider mb-1 truncate pr-4 group-hover/body:text-red-700 transition-colors">
          {data.title as string}
        </h5>

        <p className="font-handwriting text-zinc-950 text-xs font-bold leading-tight line-clamp-4 group-hover/body:opacity-90">
          {data.text as string}
        </p>
      </div>
    </div>
  );
};
