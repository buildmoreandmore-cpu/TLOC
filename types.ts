
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;         // For SMS notifications
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
  status: 'needs_notary' | 'ready_to_mail' | 'processing' | 'in_transit' | 'delivered' | 'mailed' | 'awaiting_response' | 'response_received' | 'completed' | 'draft' | 'sent' | 'responded';
  dateMailed?: string;
  trackingNumber?: string;
  bureau?: string;
  responseDate?: string;
  responseOutcome?: 'deleted' | 'verified' | 'updated' | 'pending';
  notes?: string;
  // Mail provider fields
  mailProvider?: 'lob' | 'click2mail' | 'postgrid' | 'letterstream' | 'manual';
  mailingId?: string;          // Provider's mailing ID
  mailCost?: number;           // Cost in cents
  estimatedDelivery?: string;  // Expected delivery date (ISO string)
  actualDelivery?: string;     // Actual delivery date (ISO string)
  providerStatus?: string;     // Raw status from provider
  deadlineDate?: string;       // 30-day response deadline (ISO string)
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
