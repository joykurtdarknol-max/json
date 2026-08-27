import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  CaseData, 
  Contradiction, 
  SuspectData, 
  DispatchMission, 
  TimelineEvent 
} from '../types/case';
import { sounds } from '../services/audio';
import { getLoadedCaseById } from '../services/caseRegistry';
import confetti from 'canvas-confetti';

export type GameView = 'desk' | 'board' | 'interrogation' | 'case_closed';

export interface CustomNote {
  id: string;
  text: string;
  x: number;
  y: number;
}

export interface InspectingNote {
  id: string;
  title: string;
  text: string;
  isCustom: boolean;
}

export interface IncomingCall {
  caller: string;
  role: string;
  message: string;
  newEvidenceId?: string;
}

export interface GameState {
  // Navigation & View
  currentView: GameView;
  setView: (view: GameView) => void;

  // Active Dynamic Case Data
  activeCaseId: string;
  caseData: CaseData | null;
  isLoadingCase: boolean;
  solvedCaseIds: string[];
  markCaseSolved: (caseId: string) => void;
  loadCase: (caseData: CaseData) => void;
  loadCaseById: (caseId: string, customPath?: string) => Promise<boolean>;

  // Atmosphere & Audio
  lampOn: boolean;
  toggleLamp: () => void;
  isRainActive: boolean;
  toggleRain: () => void;
  isJazzActive: boolean;
  toggleJazz: () => void;
  startAmbientAudio: () => void;
  isUVActive: boolean;
  toggleUV: () => void;
  isMagnifierActive: boolean;
  toggleMagnifier: () => void;

  // Incoming Phone Calls
  phoneRinging: boolean;
  incomingCall: IncomingCall | null;
  triggerPhoneCall: (call: IncomingCall) => void;
  answerPhone: () => void;
  hangupPhone: () => void;

  // Case File Flipbook
  isCaseFileOpen: boolean;
  openCaseFile: (page?: number) => void;
  closeCaseFile: () => void;
  currentPage: number;
  setPage: (page: number) => void;

  // Inspecting Evidence Modal (Zoom/Examine/Unpin)
  inspectingEvidenceId: string | null;
  openInspectEvidence: (evidenceId: string) => void;
  closeInspectEvidence: () => void;

  // Inspecting Note Modal
  inspectingNote: InspectingNote | null;
  openInspectNote: (note: InspectingNote) => void;
  closeInspectNote: () => void;

  // Tape Player
  isPlayingTape: boolean;
  currentTapeId: string | null;
  playTape: (tapeId: string) => void;
  stopTape: () => void;

  // Board Pinned Items
  pinnedEvidenceIds: string[];
  pinEvidenceToBoard: (evidenceId: string) => void;
  unpinEvidenceFromBoard: (evidenceId: string) => void;
  isEvidencePinned: (evidenceId: string) => boolean;

  // Board Persistent Node Positions (Free Drag & Drop)
  boardNodePositions: Record<string, { x: number; y: number }>;
  setBoardNodePosition: (id: string, pos: { x: number; y: number }) => void;

  // Board Connecting Pins (Click-To-Connect)
  connectingSourceId: string | null;
  selectPinForConnection: (nodeId: string) => void;
  cancelPinConnection: () => void;

  // Board Red String Edge Management
  connectedPairs: [string, string][];
  connectEvidence: (evidenceA: string, evidenceB: string) => boolean;
  disconnectEvidence: (evidenceA: string, evidenceB: string) => void;
  isPairConnected: (evidenceA: string, evidenceB: string) => boolean;

  // Contradiction & Deduction Discoveries
  contradictions: Contradiction[];
  discoveredContradictionIds: string[];

  // Custom User Written Notes on Board
  customNotes: CustomNote[];
  addCustomNote: (text: string, x?: number, y?: number) => void;
  updateCustomNote: (id: string, text: string) => void;
  deleteCustomNote: (id: string) => void;

  // Timeline Events
  timelineEvents: TimelineEvent[];
  verifyTimelineEvent: (id: string) => void;

  // Dispatch Field Missions
  dispatchMissions: DispatchMission[];
  startDispatchMission: (id: string) => void;
  completeDispatchMission: (id: string) => void;

  // Interrogation
  suspects: SuspectData[];
  activeSuspectId: string | null;
  setActiveSuspect: (id: string | null) => void;
  askQuestion: (suspectId: string, questionIndex: number) => void;
  askFreeTextQuestion: (suspectId: string, text: string) => { response: string; stressDelta: number; breakthrough?: string };

  // Accusation & Verdict
  isAccusationOpen: boolean;
  openAccusationModal: () => void;
  closeAccusationModal: () => void;
  submitAccusation: (culpritId: string, weaponId: string, motive: string) => boolean;

  // Unsolved Case Files Objectives & Envelopes
  unlockedEnvelopeIds: string[];
  completeObjective: (objectiveId: string) => void;
  isObjectiveCompleted: (objectiveId: string) => boolean;

  // Side-by-Side Document Comparison
  isComparisonOpen: boolean;
  sideBySideDocLeft: string | null;
  sideBySideDocRight: string | null;
  openComparison: (leftDocId?: string, rightDocId?: string) => void;
  closeComparison: () => void;
  setComparisonDocs: (left: string | null, right: string | null) => void;
  setSideBySideDocs: (left: string | null, right: string | null) => void;

  // Save / Load / Reset
  restartCase: () => void;
  exportSaveData: () => string;
  importSaveData: (jsonData: string) => boolean;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // View Router
      currentView: 'desk',
      setView: (view) => {
        sounds.playTapeClick();
        set({ currentView: view });
      },

      // Active Case
      activeCaseId: 'case_104',
      caseData: null,
      isLoadingCase: false,
      solvedCaseIds: [],
      markCaseSolved: (caseId: string) => {
        const current = get().solvedCaseIds || [];
        if (!current.includes(caseId)) {
          set({ solvedCaseIds: [...current, caseId] });
        }
      },

      loadCase: (caseData: CaseData) => {
        const defaultPinned = (caseData.evidences || [])
          .filter((e) => e.isPinnedByDefault)
          .map((e) => e.id);

        set({
          activeCaseId: caseData.id,
          caseData,
          isLoadingCase: false,
          suspects: caseData.suspects || [],
          activeSuspectId: caseData.suspects?.[0]?.id || null,
          contradictions: caseData.contradictions || [],
          timelineEvents: caseData.timeline || [],
          dispatchMissions: caseData.dispatchMissions || [],
          pinnedEvidenceIds: defaultPinned,
          connectedPairs: [],
          discoveredContradictionIds: [],
          customNotes: [],
          boardNodePositions: {},
          connectingSourceId: null,
          inspectingEvidenceId: null,
          isPlayingTape: false,
          currentTapeId: null,
          currentView: 'desk',
          currentPage: 1,
        });
      },

      loadCaseById: async (caseId: string, customPath?: string) => {
        set({ isLoadingCase: true });
        try {
          // 1. If a full HTTP URL is provided (e.g. from GitHub manifest)
          if (customPath && (customPath.startsWith('http://') || customPath.startsWith('https://'))) {
            const res = await fetch(customPath);
            if (res.ok) {
              const data: CaseData = await res.json();
              get().loadCase(data);
              return true;
            }
          }

          // 2. Try instant auto-discovered local registry
          const localBundled = getLoadedCaseById(caseId);
          if (localBundled) {
            get().loadCase(localBundled);
            return true;
          }

          // 3. Otherwise fetch from local static files
          const localPath = customPath || `/cases/${caseId}.json`;
          const res = await fetch(localPath);
          if (res.ok) {
            const data: CaseData = await res.json();
            get().loadCase(data);
            return true;
          }

          // 4. Try remote GitHub repository fallbacks
          const githubUrls = [
            `https://raw.githubusercontent.com/joykurtdarknol-max/json/main/cases/${caseId}.json`,
            `https://raw.githubusercontent.com/joykurtdarknol-max/json/main/${caseId}.json`,
            `https://raw.githubusercontent.com/joykurtdarknol-max/json/master/cases/${caseId}.json`,
            `https://raw.githubusercontent.com/joykurtdarknol-max/json/master/${caseId}.json`,
          ];

          for (const url of githubUrls) {
            try {
              const gRes = await fetch(url);
              if (gRes.ok) {
                const data: CaseData = await gRes.json();
                get().loadCase(data);
                return true;
              }
            } catch {}
          }

          throw new Error(`Could not load case ${caseId} from local or remote sources`);
        } catch (err) {
          console.error(`Failed to load case ${caseId}:`, err);
          set({ isLoadingCase: false });
          return false;
        }
      },

      // Atmosphere
      lampOn: true,
      toggleLamp: () => {
        sounds.playLightSwitch();
        set((state) => ({ lampOn: !state.lampOn }));
      },
      isRainActive: true,
      toggleRain: () => {
        const active = sounds.toggleRain();
        set({ isRainActive: active });
      },
      isJazzActive: true,
      toggleJazz: () => {
        const active = sounds.toggleJazz();
        set({ isJazzActive: active });
      },
      startAmbientAudio: () => {
        const rain = sounds.startRain();
        const jazz = sounds.startJazz();
        set({ isRainActive: rain, isJazzActive: jazz });
      },
      isUVActive: false,
      toggleUV: () => {
        sounds.playLightSwitch();
        set((state) => ({ isUVActive: !state.isUVActive }));
      },
      isMagnifierActive: false,
      toggleMagnifier: () => {
        sounds.playPaper();
        set((state) => ({ isMagnifierActive: !state.isMagnifierActive }));
      },

      // Phone
      phoneRinging: false,
      incomingCall: null,
      triggerPhoneCall: (call) => {
        sounds.playPhoneRing();
        set({ phoneRinging: true, incomingCall: call });
      },
      answerPhone: () => {
        sounds.stopPhoneRing();
        sounds.playRadioStatic();
        set({ phoneRinging: false });
      },
      hangupPhone: () => {
        sounds.playTapeClick();
        set({ incomingCall: null, phoneRinging: false });
      },

      // Case File Flipbook
      isCaseFileOpen: false,
      openCaseFile: (page = 1) => {
        sounds.playPaper();
        set({ isCaseFileOpen: true, currentPage: page });
      },
      closeCaseFile: () => {
        sounds.playPaper();
        set({ isCaseFileOpen: false });
      },
      currentPage: 1,
      setPage: (page) => {
        sounds.playPaper();
        set({ currentPage: page });
      },

      // Inspect Evidence
      inspectingEvidenceId: null,
      openInspectEvidence: (evidenceId) => {
        sounds.playPaper();
        set({ inspectingEvidenceId: evidenceId });
      },
      closeInspectEvidence: () => {
        sounds.playPaper();
        set({ inspectingEvidenceId: null });
      },

      // Inspect Note
      inspectingNote: null,
      openInspectNote: (note) => {
        sounds.playPaper();
        set({ inspectingNote: note });
      },
      closeInspectNote: () => {
        sounds.playPaper();
        set({ inspectingNote: null });
      },

      // Tape Player
      isPlayingTape: false,
      currentTapeId: null,
      playTape: (tapeId) => {
        sounds.playTapeClick();
        set({ isPlayingTape: true, currentTapeId: tapeId });
      },
      stopTape: () => {
        sounds.playTapeClick();
        set({ isPlayingTape: false, currentTapeId: null });
      },

      // Board Pinned Items
      pinnedEvidenceIds: [],
      pinEvidenceToBoard: (evidenceId) => {
        const { pinnedEvidenceIds } = get();
        if (!pinnedEvidenceIds.includes(evidenceId)) {
          sounds.playPin();
          set({ pinnedEvidenceIds: [...pinnedEvidenceIds, evidenceId] });
        }
      },
      unpinEvidenceFromBoard: (evidenceId) => {
        const { pinnedEvidenceIds, connectedPairs, boardNodePositions } = get();
        sounds.playPin();
        const newPositions = { ...boardNodePositions };
        delete newPositions[evidenceId];

        set({
          pinnedEvidenceIds: pinnedEvidenceIds.filter((id) => id !== evidenceId),
          connectedPairs: connectedPairs.filter(([a, b]) => a !== evidenceId && b !== evidenceId),
          boardNodePositions: newPositions,
          inspectingEvidenceId: null,
        });
      },
      isEvidencePinned: (evidenceId) => get().pinnedEvidenceIds.includes(evidenceId),

      // Board Persistent Positions
      boardNodePositions: {},
      setBoardNodePosition: (id, pos) => {
        set((state) => ({
          boardNodePositions: {
            ...state.boardNodePositions,
            [id]: pos,
          },
        }));
      },

      // Click-To-Connect Pin Selection
      connectingSourceId: null,
      selectPinForConnection: (nodeId) => {
        const { connectingSourceId, connectEvidence } = get();
        if (!connectingSourceId) {
          sounds.playTapeClick();
          set({ connectingSourceId: nodeId });
        } else if (connectingSourceId === nodeId) {
          sounds.playTapeClick();
          set({ connectingSourceId: null });
        } else {
          connectEvidence(connectingSourceId, nodeId);
          set({ connectingSourceId: null });
        }
      },
      cancelPinConnection: () => {
        set({ connectingSourceId: null });
      },

      // Connecting Pins (Red Strings)
      connectedPairs: [],
      connectEvidence: (evidenceA, evidenceB) => {
        const { connectedPairs, isPairConnected, contradictions, discoveredContradictionIds } = get();
        if (evidenceA === evidenceB || isPairConnected(evidenceA, evidenceB)) {
          return false;
        }

        sounds.playPin();
        const newPairs: [string, string][] = [...connectedPairs, [evidenceA, evidenceB]];

        // Check if this connection triggers a deduction/contradiction
        let discoveredTitle: string | null = null;
        let newContradictionId: string | null = null;

        contradictions.forEach((c) => {
          if (!discoveredContradictionIds.includes(c.id)) {
            const matchNormal = c.evidenceA === evidenceA && c.evidenceB === evidenceB;
            const matchReverse = c.evidenceA === evidenceB && c.evidenceB === evidenceA;
            if (matchNormal || matchReverse) {
              discoveredTitle = c.hypothesisTitle;
              newContradictionId = c.id;
            }
          }
        });

        if (discoveredTitle && newContradictionId) {
          sounds.playEureka();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#dc2626', '#f59e0b', '#fbbf24'],
          });

          set({
            connectedPairs: newPairs,
            discoveredContradictionIds: [...discoveredContradictionIds, newContradictionId],
          });
          return true;
        }

        set({ connectedPairs: newPairs });
        return true;
      },

      disconnectEvidence: (evidenceA, evidenceB) => {
        sounds.playScissors();
        set((state) => ({
          connectedPairs: state.connectedPairs.filter(
            ([a, b]) => !(a === evidenceA && b === evidenceB) && !(a === evidenceB && b === evidenceA)
          ),
        }));
      },

      isPairConnected: (evidenceA, evidenceB) => {
        return get().connectedPairs.some(
          ([a, b]) => (a === evidenceA && b === evidenceB) || (a === evidenceB && b === evidenceA)
        );
      },

      // Contradictions
      contradictions: [],
      discoveredContradictionIds: [],

      // Custom User Notes
      customNotes: [],
      addCustomNote: (text, x = 400, y = 200) => {
        sounds.playTypewriter();
        const newNote: CustomNote = {
          id: `custom_note_${Date.now()}`,
          text,
          x,
          y,
        };
        set((state) => ({
          customNotes: [...state.customNotes, newNote],
          boardNodePositions: {
            ...state.boardNodePositions,
            [newNote.id]: { x, y },
          },
        }));
      },
      updateCustomNote: (id, text) => {
        sounds.playTypewriter();
        set((state) => ({
          customNotes: state.customNotes.map((n) => (n.id === id ? { ...n, text } : n)),
          inspectingNote: state.inspectingNote?.id === id ? { ...state.inspectingNote, text } : state.inspectingNote,
        }));
      },
      deleteCustomNote: (id) => {
        sounds.playPaper();
        const { boardNodePositions } = get();
        const newPositions = { ...boardNodePositions };
        delete newPositions[id];

        set((state) => ({
          customNotes: state.customNotes.filter((n) => n.id !== id),
          connectedPairs: state.connectedPairs.filter(([a, b]) => a !== id && b !== id),
          boardNodePositions: newPositions,
          inspectingNote: state.inspectingNote?.id === id ? null : state.inspectingNote,
        }));
      },

      // Timeline
      timelineEvents: [],
      verifyTimelineEvent: (id) => {
        sounds.playEureka();
        set((state) => ({
          timelineEvents: state.timelineEvents.map((ev) =>
            ev.id === id ? { ...ev, isVerified: true } : ev
          ),
        }));
      },

      // Field Dispatch
      dispatchMissions: [],
      startDispatchMission: (id) => {
        sounds.playRadioStatic();
        set((state) => ({
          dispatchMissions: state.dispatchMissions.map((m) =>
            m.id === id ? { ...m, status: 'in_progress' } : m
          ),
        }));

        // Trigger completion timer
        const mission = get().dispatchMissions.find((m) => m.id === id);
        const duration = (mission?.durationSec || 5) * 1000;

        setTimeout(() => {
          get().completeDispatchMission(id);
        }, duration);
      },

      completeDispatchMission: (id) => {
        const mission = get().dispatchMissions.find((m) => m.id === id);
        if (!mission) return;

        // Auto pin newly discovered evidence to the board
        if (mission.resultEvidenceId) {
          get().pinEvidenceToBoard(mission.resultEvidenceId);
        }

        set((state) => ({
          dispatchMissions: state.dispatchMissions.map((m) =>
            m.id === id ? { ...m, status: 'completed' } : m
          ),
        }));

        // Ring detective telephone with radio report!
        get().triggerPhoneCall({
          caller: `SAHA BİRİMİ // ${mission.targetLocation}`,
          role: 'Olay Yeri İnceleme Ekip Lideri',
          message: mission.resultReport,
          newEvidenceId: mission.resultEvidenceId,
        });
      },

      // Suspects & Interrogation
      suspects: [],
      activeSuspectId: null,
      setActiveSuspect: (id) => {
        sounds.playPaper();
        set({ activeSuspectId: id });
      },

      askQuestion: (suspectId, questionIndex) => {
        const suspect = get().suspects.find((s) => s.id === suspectId);
        if (!suspect || !suspect.dialogueTree[questionIndex]) return;

        const dialogue = suspect.dialogueTree[questionIndex];
        sounds.playTapeClick();

        const newStress = Math.min(100, Math.max(0, suspect.stressLevel + dialogue.stressDelta));
        const isConfessing = newStress >= 85 || (dialogue.breakthrough !== undefined);

        if (newStress > 70) {
          sounds.playHeartbeat();
        }

        set((state) => ({
          suspects: state.suspects.map((s) => {
            if (s.id === suspectId) {
              return {
                ...s,
                stressLevel: newStress,
                confessed: isConfessing,
                confessionStage: newStress >= 85 ? 'full_confession' : s.confessionStage,
              };
            }
            return s;
          }),
        }));
      },

      // 100% Dynamic Free-form question evaluation from JSON
      askFreeTextQuestion: (suspectId, text) => {
        const suspect = get().suspects.find((s) => s.id === suspectId);
        sounds.playTapeClick();

        if (!suspect) {
          return { response: '...', stressDelta: 0 };
        }

        const lower = text.toLowerCase().trim();
        let response = suspect.defaultResponse || 'Bu soruya yanıt vermek istemiyorum. Avukatım olmadan konuşmayacağım.';
        let stressDelta = 5;
        let breakthrough: string | undefined = undefined;

        // Dynamically find keyword match in suspect's freeformKeywords array from JSON
        if (suspect.freeformKeywords && Array.isArray(suspect.freeformKeywords)) {
          for (const match of suspect.freeformKeywords) {
            const hasKeyword = match.keywords.some((kw) => lower.includes(kw.toLowerCase()));
            if (hasKeyword) {
              response = match.response;
              stressDelta = match.stressDelta;
              breakthrough = match.breakthrough;
              break;
            }
          }
        }

        const newStress = Math.min(100, Math.max(0, suspect.stressLevel + stressDelta));
        const isConfessing = newStress >= 85 || (breakthrough !== undefined);

        set((state) => ({
          suspects: state.suspects.map((s) =>
            s.id === suspectId
              ? {
                  ...s,
                  stressLevel: newStress,
                  confessed: isConfessing,
                  confessionStage: newStress >= 85 ? 'full_confession' : s.confessionStage,
                }
              : s
          ),
        }));

        return { response, stressDelta, breakthrough };
      },

      // Accusation (Evaluated dynamically against caseData.solution)
      isAccusationOpen: false,
      openAccusationModal: () => {
        sounds.playGavel();
        set({ isAccusationOpen: true });
      },
      closeAccusationModal: () => {
        set({ isAccusationOpen: false });
      },
      submitAccusation: (culpritId, weaponId, _motive) => {
        const { caseData } = get();
        sounds.playGavel();

        const correctCulprit = caseData?.solution?.culpritId;
        const correctWeapon = caseData?.solution?.murderWeaponId;

        const isCorrect = culpritId === correctCulprit && weaponId === correctWeapon;

        if (isCorrect) {
          sounds.playEureka();
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#10b981', '#fbbf24', '#ffffff', '#ef4444'],
          });
          const currentSolved = get().solvedCaseIds || [];
          const newSolved = caseData?.id && !currentSolved.includes(caseData.id)
            ? [...currentSolved, caseData.id]
            : currentSolved;
          set({ currentView: 'case_closed', isAccusationOpen: false, solvedCaseIds: newSolved });
          return true;
        } else {
          alert('❌ İddianame Yetersiz Delil Sebebiyle Reddedildi! Şüpheliyi veya cinayet silahını yeniden değerlendirin.');
          return false;
        }
      },

      // Unsolved Case Files Objectives & Envelopes
      unlockedEnvelopeIds: ['obj_1', 'envelope_a'],
      completeObjective: (objectiveId: string) => {
        const { unlockedEnvelopeIds, caseData, pinEvidenceToBoard } = get();
        if (unlockedEnvelopeIds.includes(objectiveId)) return;

        sounds.playEureka();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6'],
        });

        // Find objective and unlock associated evidences
        const obj = caseData?.objectives?.find((o) => o.id === objectiveId);
        if (obj?.unlockedEvidenceIds) {
          obj.unlockedEvidenceIds.forEach((evId) => pinEvidenceToBoard(evId));
        }

        set({ unlockedEnvelopeIds: [...unlockedEnvelopeIds, objectiveId] });
      },
      isObjectiveCompleted: (objectiveId: string) => get().unlockedEnvelopeIds.includes(objectiveId),

      // Side-by-Side Document Comparison
      isComparisonOpen: false,
      sideBySideDocLeft: null,
      sideBySideDocRight: null,
      openComparison: (leftDocId, rightDocId) => {
        sounds.playPaper();
        set({
          isComparisonOpen: true,
          sideBySideDocLeft: leftDocId || null,
          sideBySideDocRight: rightDocId || null,
        });
      },
      closeComparison: () => {
        sounds.playPaper();
        set({ isComparisonOpen: false });
      },
      setComparisonDocs: (left, right) => {
        set({ sideBySideDocLeft: left, sideBySideDocRight: right });
      },
      setSideBySideDocs: (left, right) => {
        set({ sideBySideDocLeft: left, sideBySideDocRight: right });
      },

      // Save & Reset
      restartCase: () => {
        const { caseData, loadCase } = get();
        if (caseData) {
          loadCase(caseData);
        } else {
          get().loadCaseById('case_104');
        }
      },

      exportSaveData: () => {
        const state = get();
        const exportObj = {
          version: '2.0',
          timestamp: new Date().toISOString(),
          activeCaseId: state.activeCaseId,
          caseData: state.caseData,
          pinnedEvidenceIds: state.pinnedEvidenceIds,
          connectedPairs: state.connectedPairs,
          discoveredContradictionIds: state.discoveredContradictionIds,
          customNotes: state.customNotes,
          boardNodePositions: state.boardNodePositions,
          timelineEvents: state.timelineEvents,
          dispatchMissions: state.dispatchMissions,
          suspects: state.suspects,
        };

        const jsonStr = JSON.stringify(exportObj, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `antigravity_${state.activeCaseId}_save.json`;
        a.click();
        URL.revokeObjectURL(url);
        return jsonStr;
      },

      importSaveData: (jsonData: string) => {
        try {
          const parsed = JSON.parse(jsonData);
          if (parsed && (parsed.caseData || parsed.evidences || parsed.activeCaseId)) {
            sounds.playEureka();

            if (parsed.caseData) {
              set({
                caseData: parsed.caseData,
                activeCaseId: parsed.activeCaseId || parsed.caseData.id,
                pinnedEvidenceIds: parsed.pinnedEvidenceIds || [],
                connectedPairs: parsed.connectedPairs || [],
                discoveredContradictionIds: parsed.discoveredContradictionIds || [],
                customNotes: parsed.customNotes || [],
                boardNodePositions: parsed.boardNodePositions || {},
                timelineEvents: parsed.timelineEvents || parsed.caseData.timeline || [],
                dispatchMissions: parsed.dispatchMissions || parsed.caseData.dispatchMissions || [],
                suspects: parsed.suspects || parsed.caseData.suspects || [],
              });
            } else if (parsed.evidences) {
              get().loadCase(parsed as CaseData);
            }
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'antigravity_detective_dynamic_save',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeCaseId: state.activeCaseId,
        caseData: state.caseData,
        pinnedEvidenceIds: state.pinnedEvidenceIds,
        connectedPairs: state.connectedPairs,
        discoveredContradictionIds: state.discoveredContradictionIds,
        customNotes: state.customNotes,
        boardNodePositions: state.boardNodePositions,
        timelineEvents: state.timelineEvents,
        dispatchMissions: state.dispatchMissions,
        suspects: state.suspects,
        lampOn: state.lampOn,
        solvedCaseIds: state.solvedCaseIds,
      }),
    }
  )
);
