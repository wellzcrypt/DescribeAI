export interface GeneratedDescription {
  id: string;
  productName: string;
  features: string;
  tone: string;
  output: string;
  timestamp: number;
}

export type Tone = 'Professional' | 'Persuasive' | 'Friendly' | 'Creative' | 'Urgent';

export interface HistoryItem {
  id: string;
  productName: string;
  features?: string;
  output: string;
  tone: string;
  timestamp: number;
}
