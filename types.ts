
export interface JournalEntry {
  id: string;
  type: 'text' | 'image';
  content: string; // text or base64
  timestamp: Date;
}

export interface AnalysisResult {
  sentiment: string;
  summary: string;
  comfortingMessage: string;
  suggestions: string[];
  stressLevel: 'low' | 'moderate' | 'high' | 'severe';
}

export enum AppState {
  HOME = 'HOME',
  JOURNALING = 'JOURNALING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  TALKING = 'TALKING',
  CRISIS = 'CRISIS'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
