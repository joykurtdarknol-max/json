export interface EnvelopeObjective {
  id: string;
  envelopeName: 'ZARF A' | 'ZARF B' | 'ZARF C';
  title: string;
  description: string;
  requiredContradictionId?: string;
  isUnlocked: boolean;
  unlockedEvidenceIds: string[];
  rewardMessage?: string;
}

export interface CaseDocument {
  id: string;
  documentType: 'police_deposition' | 'autopsy' | 'receipt' | 'chat_log' | 'bank_statement' | 'crime_scene_sketch' | 'handwritten_letter';
  title: string;
  officialHeader?: string;
  documentNo?: string;
  dateStr?: string;
  issuer?: string;
  contentMarkdown?: string;
  rawItems?: Record<string, unknown>;
  confidentialStamp?: boolean;
  stamps?: string[];
  handwrittenFieldNotes?: string[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  category: 'suspect' | 'victim' | 'forensic' | 'document' | 'audio' | 'object' | 'dispatch';
  description: string;
  dateStr?: string;
  image?: string;
  handwrittenNote?: string;
  sourceLocation: string;
  hiddenClueUV?: string;
  hiddenClueMagnifier?: string;
  isPinnedByDefault?: boolean;
  officialDocumentNo?: string;
  transcriptMarkdown?: string;
  forensicAnalysisMarkdown?: string;
  cyberHtsLogMarkdown?: string;
  documents?: CaseDocument[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  associatedEvidenceId?: string;
  isVerified: boolean;
}

export interface DispatchMission {
  id: string;
  title: string;
  targetLocation: string;
  team: 'forensic' | 'dive_team' | 'bank_audit' | 'patrol';
  description: string;
  durationSec: number;
  status: 'available' | 'in_progress' | 'completed';
  resultEvidenceId: string;
  resultReport: string;
}

export interface Contradiction {
  id: string;
  evidenceA: string;
  evidenceB: string;
  hypothesisTitle: string;
  hypothesisText: string;
  discovered: boolean;
}

export interface DialogueItem {
  question: string;
  tactic: 'good_cop' | 'bad_cop' | 'evidence';
  response: string;
  requiredEvidence?: string;
  stressDelta: number;
  breakthrough?: string;
}

export interface FreeformKeywordMatch {
  keywords: string[];
  response: string;
  stressDelta: number;
  breakthrough?: string;
}

export interface SuspectData {
  id: string;
  name: string;
  age: number;
  role: string;
  imageNormal?: string;
  imageInterrogation?: string;
  alibi: string;
  motive: string;
  stressLevel: number;
  confessed: boolean;
  confessionStage: 'denial' | 'admitted_presence' | 'admitted_fight' | 'full_confession';
  defaultResponse?: string;
  dialogueTree: DialogueItem[];
  freeformKeywords?: FreeformKeywordMatch[];
}

export interface FilePage {
  pageNumber: number;
  title: string;
  classification: string;
  contentMarkdown: string;
  associatedEvidenceIds: string[];
}

export interface WeaponOption {
  id: string;
  name: string;
  description: string;
}

export interface AudioTape {
  id: string;
  title: string;
  subtitle: string;
  associatedEvidenceId?: string;
}

export interface CaseDirectoryContact {
  id: string;
  name: string;
  role: string;
  status: string;
  viewTarget?: 'interrogation' | 'desk' | 'board';
}

export interface CaseData {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  summary: string;
  weapons: WeaponOption[];
  audioTapes?: AudioTape[];
  directory?: CaseDirectoryContact[];
  suspects: SuspectData[];
  evidences: EvidenceItem[];
  timeline: TimelineEvent[];
  dispatchMissions: DispatchMission[];
  contradictions: Contradiction[];
  filePages: FilePage[];
  objectives?: EnvelopeObjective[];
  documents?: CaseDocument[];
  solution: {
    culpritId: string;
    murderWeaponId: string;
    criticalEvidenceId: string;
    keyMotive: string;
    correctVerdictSummary: string;
  };
  newspaper?: {
    newspaperName: string;
    issueInfo: string;
    headline: string;
    article: string;
    commendationTitle: string;
    commendationBody: string;
  };
}

export interface CaseManifestItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  summary: string;
  thumbnail?: string;
  isAvailable: boolean;
  tag: string;
  filePath: string;
}
