import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { sounds } from './services/audio';
import { HeaderNav } from './components/HeaderNav';
import { DeskView } from './components/DeskView';
import { BoardView } from './components/BoardView';
import { InterrogationRoom } from './components/InterrogationRoom';
import { CaseClosedView } from './components/CaseClosedView';
import { CaseFileModal } from './components/CaseFileModal';
import { AccusationModal } from './components/AccusationModal';
import { InspectEvidenceModal } from './components/InspectEvidenceModal';
import { TimelineModal } from './components/TimelineModal';
import { DispatchModal } from './components/DispatchModal';
import { CaseArchiveModal } from './components/CaseArchiveModal';
import { InspectNoteModal } from './components/InspectNoteModal';

export function App() {
  const { 
    currentView, 
    caseData, 
    activeCaseId, 
    loadCaseById,
    startAmbientAudio
  } = useGameStore();

  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // Automatically load the active case JSON on app initialization (default to case_201 if available)
  useEffect(() => {
    if (!caseData) {
      loadCaseById(activeCaseId || 'case_201');
    }
  }, [caseData, activeCaseId, loadCaseById]);

  // Automatically start ambient noir jazz & rain on app launch / first interaction
  useEffect(() => {
    startAmbientAudio();

    const handleFirstGesture = () => {
      sounds.unlockAudio();
      startAmbientAudio();
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('pointerdown', handleFirstGesture);
    };
  }, [startAmbientAudio]);

  // Aggregate all available documents for side-by-side comparison
  return (
    <div className="relative w-screen h-screen bg-zinc-950 text-zinc-100 overflow-hidden select-none font-sans">
      {/* Top Single Streamlined Header Bar */}
      <HeaderNav 
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onOpenArchive={() => setIsArchiveOpen(true)}
        onOpenDispatch={() => setIsDispatchOpen(true)}
      />

      {/* Main View Router */}
      <main className="w-full h-full">
        {currentView === 'desk' && <DeskView />}
        {currentView === 'board' && <BoardView />}
        {currentView === 'interrogation' && <InterrogationRoom />}
        {currentView === 'case_closed' && <CaseClosedView />}
      </main>

      {/* Modals & Overlays */}
      <CaseFileModal />
      <AccusationModal />
      <InspectEvidenceModal />
      <InspectNoteModal />
      <TimelineModal isOpen={isTimelineOpen} onClose={() => setIsTimelineOpen(false)} />
      <DispatchModal isOpen={isDispatchOpen} onClose={() => setIsDispatchOpen(false)} />
      <CaseArchiveModal isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} />
    </div>
  );
}

export default App;

