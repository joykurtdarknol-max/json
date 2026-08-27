import React, { useCallback, useState, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  PanOnScrollMode,
  type Node, 
  type Edge, 
  type Connection,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useGameStore } from '../store/gameStore';
import { PolaroidNode, DocumentNode, PostItNode } from './board/CustomNodes';
import { RedStringEdge } from './board/RedStringEdge';
import { 
  ArrowDown, 
  FolderOpen, 
  Pin, 
  X, 
  Scissors,
  StickyNote,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { sounds } from '../services/audio';

const nodeTypes = {
  polaroid: PolaroidNode,
  document: DocumentNode,
  postit: PostItNode,
};

const edgeTypes = {
  redString: RedStringEdge,
};

export const BoardView: React.FC = () => {
  const { 
    pinnedEvidenceIds, 
    connectedPairs, 
    connectEvidence, 
    disconnectEvidence,
    discoveredContradictionIds,
    openCaseFile,
    pinEvidenceToBoard,
    customNotes,
    addCustomNote,
    boardNodePositions,
    setBoardNodePosition,
    connectingSourceId,
    cancelPinConnection,
    setView,
    caseData
  } = useGameStore();

  const [isScissorsActive, setIsScissorsActive] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Default coordinate if not placed before (generous natural grid across full board)
  const getDefaultPosition = (idx: number) => {
    const cols = 4;
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    return {
      x: 100 + col * 260,
      y: 90 + row * 260
    };
  };

  // Sync pinned evidences, hypotheses, and custom notes into React Flow nodes using persistent boardNodePositions
  useEffect(() => {
    const newNodes: Node[] = [];

    // 1. Pinned Evidences
    pinnedEvidenceIds.forEach((id, idx) => {
      const evidence = caseData?.evidences?.find((e) => e.id === id);
      if (!evidence) return;

      const pos = boardNodePositions[id] || getDefaultPosition(idx);
      const isPolaroid = evidence.category === 'suspect' || evidence.category === 'object' || evidence.category === 'dispatch';

      newNodes.push({
        id: evidence.id,
        type: isPolaroid ? 'polaroid' : 'document',
        position: pos,
        data: { evidence },
      });
    });

    // 2. Discovered Contradictions (Post-Its)
    discoveredContradictionIds.forEach((cId, idx) => {
      const contradiction = caseData?.contradictions?.find((c) => c.id === cId);
      if (!contradiction) return;

      const pos = boardNodePositions[`postit_${contradiction.id}`] || { x: 320 + (idx * 160), y: 200 + (idx * 30) };

      newNodes.push({
        id: `postit_${contradiction.id}`,
        type: 'postit',
        position: pos,
        data: {
          title: contradiction.hypothesisTitle,
          text: contradiction.hypothesisText,
        },
      });
    });

    // 3. Custom User Written Notes
    customNotes.forEach((note, idx) => {
      const pos = boardNodePositions[note.id] || { x: 420 + (idx * 30), y: 180 + (idx * 30) };

      newNodes.push({
        id: note.id,
        type: 'postit',
        position: pos,
        data: {
          title: 'DEDEKTİF NOTU',
          text: note.text,
        },
      });
    });

    setNodes(newNodes);
  }, [pinnedEvidenceIds, discoveredContradictionIds, customNotes, boardNodePositions, caseData, setNodes]);

  // Sync red string edges
  useEffect(() => {
    const newEdges: Edge[] = connectedPairs.map(([source, target], idx) => ({
      id: `edge_${source}_${target}_${idx}`,
      source,
      target,
      sourceHandle: 'pin',
      targetHandle: 'pin',
      type: 'redString',
    }));
    setEdges(newEdges);
  }, [connectedPairs, setEdges]);

  // Track Node Drag End to persist positions across screen switches!
  const handleNodeDragStop = useCallback((_: unknown, node: Node) => {
    setBoardNodePosition(node.id, node.position);
  }, [setBoardNodePosition]);

  // Connect two pins
  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        connectEvidence(params.source, params.target);
      }
    },
    [connectEvidence]
  );

  // Snip with Scissors
  const onEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    if (isScissorsActive && edge.source && edge.target) {
      disconnectEvidence(edge.source, edge.target);
    }
  };

  const handleAddCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      addCustomNote(newNoteText);
      setNewNoteText('');
      setShowNoteInput(false);
    }
  };

  const unpinnedEvidences = (caseData?.evidences || []).filter(
    (e) => !pinnedEvidenceIds.includes(e.id)
  );

  return (
    <div className="relative w-full h-[calc(100dvh-52px-54px)] md:h-[calc(100vh-52px)] mt-[52px] bg-[#1a0f05] overflow-hidden select-none wood-frame-border cork-surface">
      {/* Overhead detective spotlight & ambient vignette */}
      <div className="absolute inset-0 pointer-events-none cork-vignette z-0" />
      <div className="absolute inset-0 pointer-events-none film-grain opacity-20 z-0" />

      {/* ============================================================ */}
      {/* TOP BAR OVERLAY: Return to Desk & Tool Controls              */}
      {/* ============================================================ */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20 flex items-center justify-between pointer-events-none flex-wrap gap-1.5">
        <div className="flex items-center gap-1.5 pointer-events-auto flex-wrap">
          <button
            onClick={() => setView('desk')}
            className="flex items-center gap-1.5 bg-amber-950/90 hover:bg-amber-900 text-amber-200 border border-amber-600/60 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xl backdrop-blur-md font-police font-bold text-xs tracking-wider transition-all transform hover:-translate-y-0.5 cursor-pointer"
            title="Masaya Geri Dön"
          >
            <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="hidden sm:inline">Masaya Dön</span>
          </button>

          {/* Scissors Mode Toggle Button */}
          <button
            onClick={() => {
              sounds.playScissors();
              setIsScissorsActive(!isScissorsActive);
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl shadow-xl backdrop-blur-md font-police font-bold text-xs border transition-all cursor-pointer ${
              isScissorsActive
                ? 'bg-red-700 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}
            title="Makas modu açıkken herhangi bir kırmızı ipe tıklayarak kesebilirsiniz"
          >
            <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span>{isScissorsActive ? '✂️ Kes (Aktif)' : 'İp Kes'}</span>
          </button>

          {/* Add Custom Note Button */}
          <button
            onClick={() => setShowNoteInput(!showNoteInput)}
            className="flex items-center gap-1.5 bg-yellow-950/80 hover:bg-yellow-900 text-yellow-200 border border-yellow-600/50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl shadow-xl backdrop-blur-md font-police font-bold text-xs cursor-pointer transition-all"
            title="Not Ekle"
          >
            <StickyNote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
            <span>+ Not</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => openCaseFile(1)}
            className="flex items-center gap-1.5 bg-amber-900/90 hover:bg-amber-800 text-amber-100 border border-amber-600/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xl backdrop-blur-md font-police font-bold text-xs cursor-pointer transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span>Dosyayı Aç</span>
          </button>
        </div>
      </div>

      {/* CLICK-TO-CONNECT ACTIVE BANNER */}
      {connectingSourceId && (
        <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-30 bg-amber-500 text-zinc-950 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-police font-bold text-[11px] sm:text-xs shadow-2xl flex items-center gap-2 animate-bounce border-2 border-zinc-950 max-w-[90vw] text-center">
          <span className="truncate">📍 1. Raptiye Seçildi! 2. Raptiyeye tıklayın</span>
          <button
            onClick={cancelPinConnection}
            className="text-zinc-950 hover:text-red-900 font-extrabold text-xs ml-1 cursor-pointer shrink-0"
            title="İptal Et"
          >
            ✕
          </button>
        </div>
      )}

      {/* NEW NOTE INPUT POPUP */}
      {showNoteInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#fef08a] border-4 border-yellow-500 w-full max-w-sm rounded-xl p-5 text-zinc-950 shadow-2xl font-police space-y-3">
            <div className="flex items-center justify-between border-b border-yellow-600/30 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-950">
                SARI POST-IT // DEDEKTİF NOTU
              </span>
              <button onClick={() => setShowNoteInput(false)} className="text-zinc-700 hover:text-red-900 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomNote} className="space-y-3">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Panoya yapıştırmak istediğin dedektiflik teorisini veya notunu yaz..."
                rows={3}
                className="w-full p-2.5 bg-yellow-100/80 border border-yellow-600/40 rounded-lg text-xs font-handwriting text-zinc-950 font-bold focus:outline-none focus:border-amber-700 resize-none leading-relaxed"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteInput(false)}
                  className="px-3 py-1.5 text-xs text-zinc-700 hover:text-zinc-950 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer"
                >
                  Panoya İğnele 📌
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN REACT FLOW INFINITE CANVAS                              */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={handleNodeDragStop}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={{ x: 30, y: 30, zoom: 0.7 }}
          minZoom={0.2}
          maxZoom={2.5}
          nodesDraggable={true}
          elementsSelectable={false}
          selectionOnDrag={false}
          panOnDrag={true}
          panOnScroll={true}
          panOnScrollMode={PanOnScrollMode.Free}
          zoomOnPinch={true}
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
          className="bg-transparent"
        >
          <Background gap={32} size={1.5} color="rgba(0,0,0,0.06)" />
        </ReactFlow>
      </div>

      {/* BOTTOM EVIDENCE DRAWER (Collapsible) */}
      {unpinnedEvidences.length > 0 && (
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-4 right-2 sm:right-4 z-20 transition-all duration-300">
          <div className="bg-zinc-950/95 border border-amber-600/40 rounded-xl p-2.5 backdrop-blur-md shadow-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-police text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5" />
                Masada Kalan Deliller ({unpinnedEvidences.length})
              </span>
              <button
                onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer flex items-center gap-1 text-[11px] font-police"
              >
                <span>{isDrawerCollapsed ? 'Çekmeceyi Aç' : 'Gizle'}</span>
                {isDrawerCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!isDrawerCollapsed && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {unpinnedEvidences.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => pinEvidenceToBoard(e.id)}
                    className="shrink-0 flex items-center gap-1.5 bg-zinc-900 hover:bg-amber-950/60 border border-zinc-700 hover:border-amber-500/50 px-2.5 py-1 rounded-lg text-xs font-police text-zinc-200 transition-all cursor-pointer"
                  >
                    <Pin className="w-3 h-3 text-amber-400" />
                    <span>+ {e.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
