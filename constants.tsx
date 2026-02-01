
import React from 'react';
import { Client, Template, DisputeLetter } from './types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    token: 'client-token-abc',
    score: 580,
    status: 'active',
    joinedDate: '2024-01-15',
    negativeItems: [
      { id: 'ni1', creditor: 'Capital One', type: 'Late Payment', balance: 0, status: 'Charged Off', dateReported: '2023-11-01' },
      { id: 'ni2', creditor: 'LVNV Funding', type: 'Collection', balance: 1200, status: 'Open', dateReported: '2023-12-15' }
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    token: 'client-token-xyz',
    score: 620,
    status: 'onboarding',
    joinedDate: '2024-02-10',
    negativeItems: []
  }
];

export const DISPUTE_TEMPLATES: Template[] = [
  {
    id: 'temp1',
    name: 'Standard Validation Request',
    description: 'Demand proof that a debt is valid under FDCPA.',
    content: `[Date]

[Creditor/Bureau Name]
[Address]

Re: Account #[Account Number]

To whom it may concern,

I am writing to formally dispute the following item on my credit report. I do not recognize this account or the balance reported. Under the Fair Credit Reporting Act, I am requesting that you provide full validation of this debt.

If you cannot provide proof of this debt, please remove it from my credit file immediately.

Sincerely,
[Client Name]`
  },
  {
    id: 'temp2',
    name: 'Method of Verification',
    description: 'Ask how they verified the information.',
    content: `[Date]

[Bureau Name]
[Address]

Re: Dispute Method of Verification

I recently disputed an item on my credit report and was told it was "verified." Please provide the specific method of verification used, including the contact person and information for the source of this data.

Failure to provide this information violates my rights under the FCRA.

Sincerely,
[Client Name]`
  },
  {
    id: 'temp3',
    name: 'Goodwill Deletion Request',
    description: 'Ask for a courtesy removal of a late payment.',
    content: `[Date]

[Creditor Name]
[Address]

Re: Account #[Account Number]

I have been a loyal customer for years. I am writing to ask for a "goodwill" removal of the late payment reported on [Date]. This was an isolated incident due to [Reason]. I value my relationship with you and hope you can assist me.

Sincerely,
[Client Name]`
  },
  {
    id: 'temp4',
    name: 'Identity Theft Dispute',
    description: 'For accounts opened fraudulently.',
    content: `[Date]

[Bureau Name]
[Address]

Re: Identity Theft Dispute - Account #[Account Number]

I am a victim of identity theft. I did not open the referenced account. Attached is a copy of my FTC Identity Theft Report. Please block this information from my credit report within 4 business days as required by law.

Sincerely,
[Client Name]`
  },
  {
    id: 'temp5',
    name: 'Medical Debt Dispute',
    description: 'Specialized dispute for medical collections.',
    content: `[Date]

[Bureau Name]
[Address]

Re: Medical Collection #[Account Number]

I am disputing this medical collection. Under HIPAA regulations, medical information should not be shared without proper authorization. Please verify that this reporting complies with all privacy laws or remove it.

Sincerely,
[Client Name]`
  },
  {
    id: 'temp6',
    name: 'Public Record Dispute',
    description: 'Challenge judgments or tax liens.',
    content: `[Date]

[Bureau Name]
[Address]

Re: Public Record #[Case Number]

The public record item listed on my report is inaccurate. I am requesting that you verify this information with the original source. Most bureaus no longer report these items due to the National Consumer Assistance Plan.

Sincerely,
[Client Name]`
  }
];

export const INITIAL_LETTERS: DisputeLetter[] = [
  {
    id: 'L1',
    clientId: '1',
    clientName: 'John Doe',
    templateId: 'temp1',
    content: 'Dear Credit Bureau, I dispute the Capital One account...',
    createdAt: '2024-01-20',
    status: 'sent'
  }
];
