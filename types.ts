
export interface Client {
  id: string;
  name: string;
  email: string;
  token: string;
  score: number;
  status: 'active' | 'onboarding' | 'completed';
  joinedDate: string;
  negativeItems: NegativeItem[];
}

export interface NegativeItem {
  id: string;
  creditor: string;
  type: string;
  balance: number;
  status: string;
  dateReported: string;
}

export interface DisputeLetter {
  id: string;
  clientId: string;
  clientName: string;
  templateId: string;
  content: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'responded';
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  legalBasis: string;
  useCase: string;
  mailMethod: 'certified_required' | 'certified_recommended' | 'regular_ok';
  successRate: 'High' | 'Medium' | 'Low';
  content: string;
  attachments?: string[];
  potentialDamages?: number;
}

export interface AppState {
  clients: Client[];
  letters: DisputeLetter[];
}

export interface SnowballPlan {
  month: string;
  action: string;
  focusDebt: string;
  estimatedRemainingTotal: number;
}
