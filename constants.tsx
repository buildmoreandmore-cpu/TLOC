
import React from 'react';
import { Client, Template, DisputeLetter } from './types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
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
    phone: '(555) 987-6543',
    token: 'client-token-xyz',
    score: 620,
    status: 'onboarding',
    joinedDate: '2024-02-10',
    negativeItems: []
  }
];

// Bureau mailing addresses for certified mail
export const BUREAU_ADDRESSES = {
  equifax: {
    name: 'Equifax Information Services LLC',
    address: 'P.O. Box 740256',
    cityStateZip: 'Atlanta, GA 30374-0256',
  },
  experian: {
    name: 'Experian',
    address: 'P.O. Box 4500',
    cityStateZip: 'Allen, TX 75013',
  },
  transunion: {
    name: 'TransUnion LLC',
    address: 'P.O. Box 2000',
    cityStateZip: 'Chester, PA 19016',
  },
  innovis: {
    name: 'Innovis Consumer Assistance',
    address: 'P.O. Box 1358',
    cityStateZip: 'Columbus, OH 43216-1358',
  },
};

export const DISPUTE_TEMPLATES: Template[] = [
  {
    id: 'debt_validation',
    name: 'Debt Validation Letter',
    category: 'COLLECTION',
    description: 'Demands collector prove the debt is valid with original creditor documentation. Many collectors cannot provide this.',
    legalBasis: 'FDCPA § 809(b), 15 U.S.C. § 1692g',
    useCase: 'Send within 30 days of first contact from a collector. Forces them to prove the debt is valid before they can continue collection.',
    mailMethod: 'certified_recommended',
    successRate: 'High',
    content: `[DATE]

[COLLECTOR_NAME]
[COLLECTOR_ADDRESS]

Re: Debt Validation Request
Account Reference: [ACCOUNT_NUMBER]

Dear Sir/Madam,

I am writing in response to your communication regarding the above-referenced account. Under the Fair Debt Collection Practices Act, 15 U.S.C. § 1692g, I am requesting validation of this alleged debt.

Please provide the following documentation:

1. Complete documentation proving I owe this debt
2. Original signed contract or agreement between myself and the original creditor
3. Complete payment history from the original creditor
4. Proof of your authority to collect this debt in my state
5. Your collection agency license number for [STATE]
6. Name and address of the original creditor
7. Amount of the original debt and itemization of how you arrived at the current balance
8. Proof that the statute of limitations has not expired

Until you provide proper validation as requested above, you must:
- Cease all collection activities
- Not report this debt to any credit bureau
- Not sell or transfer this debt

Be advised that if you continue collection activities without providing validation, I will file complaints with the Consumer Financial Protection Bureau (CFPB), Federal Trade Commission (FTC), and [STATE] Attorney General's Office.

This is not a refusal to pay, but a request to verify that this debt is valid and that you have the legal right to collect it.

Sincerely,

_______________________________
[CLIENT_NAME]
[CLIENT_ADDRESS]

Sent via Certified Mail #: _______________`
  },
  {
    id: 'bureau_dispute_not_mine',
    name: 'Bureau Dispute - Account Not Mine',
    category: 'BUREAU_DISPUTE',
    description: 'Disputes an account as not belonging to you. Bureau must verify with creditor or delete within 30 days.',
    legalBasis: 'FCRA § 611, 15 U.S.C. § 1681i',
    useCase: 'Use when an account appears on your credit report that you do not recognize and did not open.',
    mailMethod: 'certified_recommended',
    successRate: 'High',
    content: `[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

Re: Dispute of Account - Not My Account
Social Security Number: XXX-XX-[LAST_4_SSN]

Dear Sir or Madam:

I am writing to dispute an account appearing on my credit report that does not belong to me.

MY INFORMATION:
Name: [CLIENT_NAME]
Address: [CLIENT_ADDRESS]
SSN: XXX-XX-[LAST_4_SSN]
Date of Birth: [DOB]

DISPUTED ACCOUNT:
Creditor Name: [CREDITOR_NAME]
Account Number: [ACCOUNT_NUMBER]
Balance Reported: [BALANCE]

I hereby state under penalty of perjury that:
1. I have never opened an account with this creditor
2. I have never authorized anyone to open an account in my name with this creditor
3. I do not recognize this account
4. This account does not belong to me

Under the Fair Credit Reporting Act, 15 U.S.C. § 1681i, you are required to:
1. Conduct a reasonable investigation within 30 days
2. Forward all relevant information to the furnisher
3. Delete the item if it cannot be verified as belonging to me

If your investigation determines this account belongs to me, please provide documentation proving:
- A signed application or contract bearing my signature
- Proof of my identity used to open the account
- Any documentation showing I authorized this account

Enclosed please find:
• Copy of my driver's license
• Copy of Social Security card
• Proof of current address

If you cannot verify that this account belongs to me, please delete it immediately from my credit file.

Sincerely,

_______________________________
[CLIENT_NAME]

Enclosures: As stated above`
  },
  {
    id: 'bureau_dispute_inaccurate',
    name: 'Bureau Dispute - Inaccurate Information',
    category: 'BUREAU_DISPUTE',
    description: 'Disputes specific inaccuracies in how an account is being reported (wrong balance, dates, status, etc.).',
    legalBasis: 'FCRA § 611, § 623, 15 U.S.C. § 1681i, 15 U.S.C. § 1681s-2',
    useCase: 'Use when you recognize the account but the information being reported is incorrect.',
    mailMethod: 'certified_recommended',
    successRate: 'Medium',
    content: `[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

Re: Dispute of Inaccurate Information
Social Security Number: XXX-XX-[LAST_4_SSN]

Dear Sir or Madam:

I am writing to dispute inaccurate information appearing on my credit report regarding the following account:

ACCOUNT INFORMATION:
Creditor Name: [CREDITOR_NAME]
Account Number: [ACCOUNT_NUMBER]

INACCURATE INFORMATION:
What is being reported: [CURRENT_REPORTED_INFO]
What is accurate: [CORRECT_INFO]
Reason this is inaccurate: [EXPLANATION]

Under the Fair Credit Reporting Act, 15 U.S.C. § 1681i, you are required to:
1. Conduct a reasonable investigation into my dispute within 30 days
2. Forward all relevant information I provide to the furnisher
3. Consider all relevant information
4. Modify, delete, or permanently block the reporting of information found to be inaccurate

Additionally, under 15 U.S.C. § 1681e(b), you are required to follow reasonable procedures to assure maximum possible accuracy.

I request that you:
1. Investigate this dispute
2. Correct the inaccurate information
3. Send me the results of your investigation
4. Provide me with an updated copy of my credit report

Enclosed please find:
• Supporting documentation proving the inaccuracy
• Copy of my identification

Please correct this inaccurate information immediately.

Sincerely,

_______________________________
[CLIENT_NAME]
[CLIENT_ADDRESS]

Enclosures: As stated above`
  },
  {
    id: 'bureau_dispute_identity_theft',
    name: 'Identity Theft Dispute',
    category: 'IDENTITY_THEFT',
    description: 'Files identity theft claim for fastest removal. Bureau must block within 4 business days with proper documentation.',
    legalBasis: 'FCRA § 605(b), 15 U.S.C. § 1681c-2',
    useCase: 'Use when accounts were opened fraudulently due to identity theft. Requires FTC Identity Theft Affidavit and police report for fastest processing.',
    mailMethod: 'certified_required',
    successRate: 'High',
    attachments: ['FTC Identity Theft Affidavit', 'Police Report', 'Government ID'],
    content: `[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

Re: Identity Theft Dispute - Request for Block
FCRA Section 605B
Social Security Number: XXX-XX-[LAST_4_SSN]

Dear Fraud Department:

I am a victim of identity theft and am writing to dispute fraudulent information appearing on my credit report. Under Section 605B of the Fair Credit Reporting Act, I am requesting that you block the following fraudulent account(s) from my credit file.

MY INFORMATION:
Name: [CLIENT_NAME]
Address: [CLIENT_ADDRESS]
SSN: XXX-XX-[LAST_4_SSN]
Date of Birth: [DOB]

FRAUDULENT ACCOUNT(S) TO BE BLOCKED:
Creditor Name: [CREDITOR_NAME]
Account Number: [ACCOUNT_NUMBER]
Date Opened: [DATE_OPENED]
Amount: [AMOUNT]

I hereby certify under penalty of perjury that:
1. I did not open or authorize this account
2. I am a victim of identity theft
3. The information provided in the attached Identity Theft Report is true

ENCLOSED DOCUMENTATION:
1. FTC Identity Theft Report/Affidavit (IdentityTheft.gov)
2. Police Report (Report #: [POLICE_REPORT_NUMBER])
3. Copy of government-issued photo ID
4. Proof of address (utility bill)

Under Section 605B of the FCRA, you are required to:
• Block the fraudulent information within 4 business days of receiving this request
• Notify the furnisher that the information resulted from identity theft
• Not report the blocked information

Please also place an extended fraud alert on my credit file.

Sincerely,

_______________________________
[CLIENT_NAME]

Enclosures: As listed above`
  },
  {
    id: 'goodwill_letter',
    name: 'Goodwill Deletion Request',
    category: 'GOODWILL',
    description: 'Requests removal as a courtesy for customers with otherwise good payment history. Works best with original creditors.',
    legalBasis: 'No legal requirement - this is a courtesy request',
    useCase: 'Use when you have a late payment on an account that is otherwise in good standing, especially if you have a long positive history with the creditor.',
    mailMethod: 'regular_ok',
    successRate: 'Medium',
    content: `[DATE]

[CREDITOR_NAME]
[CREDITOR_ADDRESS]

Re: Goodwill Adjustment Request
Account Number: [ACCOUNT_NUMBER]

Dear Customer Relations Department:

I am writing to request a goodwill adjustment to my account. I have been a valued customer of [CREDITOR_NAME] for [X] years and am hoping you will consider removing a late payment notation from my credit report.

ACCOUNT DETAILS:
Account Number: [ACCOUNT_NUMBER]
Late Payment Date(s): [LATE_PAYMENT_DATES]

The late payment(s) occurred due to [EXPLANATION - e.g., unexpected medical emergency, temporary job loss, family emergency, etc.].

Since that time, I have:
• Maintained perfect payment history
• Kept my account in good standing
• [OTHER POSITIVE ACTIONS - e.g., set up autopay, increased my credit limit, etc.]

I am currently working to improve my credit profile in order to [GOAL - e.g., purchase a home, refinance my mortgage, qualify for better rates]. This single negative mark is significantly impacting my credit score and my ability to achieve my financial goals.

I understand this is a discretionary decision and that you are under no obligation to grant this request. However, given my otherwise excellent payment history with your company, I am hoping you will consider this request as a gesture of goodwill to a loyal customer.

If approved, please update my account with all three credit bureaus (Equifax, Experian, and TransUnion) to reflect the removal of the late payment notation.

Thank you for your time and consideration. I truly appreciate your review of this request and look forward to continuing my relationship with [CREDITOR_NAME].

Sincerely,

_______________________________
[CLIENT_NAME]
[CLIENT_ADDRESS]
[CLIENT_PHONE]
[CLIENT_EMAIL]`
  },
  {
    id: 'pay_for_delete',
    name: 'Pay-for-Delete Negotiation',
    category: 'NEGOTIATION',
    description: 'Offers payment in exchange for complete deletion from credit reports. Get agreement in writing before paying.',
    legalBasis: 'No specific law - contractual agreement between parties',
    useCase: 'Use when you owe a debt and want to negotiate complete deletion rather than just "Paid" status. Most effective with collection agencies and junk debt buyers.',
    mailMethod: 'regular_ok',
    successRate: 'Medium',
    content: `[DATE]

[COLLECTOR/CREDITOR_NAME]
[ADDRESS]

Re: Settlement Offer with Deletion Agreement
Account Number: [ACCOUNT_NUMBER]
Original Creditor: [ORIGINAL_CREDITOR]
Claimed Balance: [CLAIMED_BALANCE]

Dear Collections Manager:

I am writing regarding the above-referenced account. I am prepared to resolve this matter and am requesting a "pay for delete" agreement.

I propose the following terms:

SETTLEMENT AMOUNT: $[SETTLEMENT_AMOUNT]
(This represents [XX]% of the claimed balance)

In exchange for my payment, you agree to:
1. Accept $[SETTLEMENT_AMOUNT] as payment in full satisfaction of this debt
2. Delete ALL references to this account from Equifax, Experian, TransUnion, and Innovis within 30 days of receiving payment
3. Not sell, assign, or transfer this account to any other party
4. Provide written confirmation of this agreement before I submit payment

PAYMENT TERMS:
• I will provide certified funds within 10 business days of receiving your written agreement
• Payment will be made via cashier's check or money order only
• Payment is contingent upon receiving signed agreement first

Please respond in writing with your acceptance or counter-proposal. This offer expires 30 days from the date of this letter.

IMPORTANT: I will NOT agree to "update to paid" or "settled" status. The only acceptable resolution is COMPLETE DELETION from all credit bureaus.

Do not contact me by phone. All communication must be in writing.

Sincerely,

_______________________________
[CLIENT_NAME]
[CLIENT_ADDRESS]`
  },
  {
    id: 'method_of_verification',
    name: 'Method of Verification Demand',
    category: 'FOLLOW_UP',
    description: 'Demands bureau disclose exactly how they verified disputed information. Use after receiving a "verified" response.',
    legalBasis: 'FCRA § 611(a)(7), 15 U.S.C. § 1681i(a)(7)',
    useCase: 'Send after you receive dispute results stating an item was "verified" without explanation. Forces the bureau to disclose their verification procedures.',
    mailMethod: 'certified_required',
    successRate: 'High',
    content: `[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

Re: Request for Method of Verification
Previous Dispute Reference: [DISPUTE_CONFIRMATION_NUMBER]
Social Security Number: XXX-XX-[LAST_4_SSN]

Dear Sir or Madam:

I recently received the results of my credit dispute dated [DATE_OF_RESULTS]. Your investigation concluded that the following item was "verified" without providing sufficient detail about how this verification was conducted.

DISPUTED ITEM:
Creditor Name: [CREDITOR_NAME]
Account Number: [ACCOUNT_NUMBER]
Item Disputed: [SPECIFIC_ITEM]

Pursuant to the Fair Credit Reporting Act, 15 U.S.C. § 611(a)(7), I am exercising my right to request a description of the procedure used to determine the accuracy and completeness of the disputed information, including:

1. The business name and address of any furnisher contacted
2. The telephone number of the furnisher, if reasonably available
3. A description of the verification method used by the furnisher
4. What documentation or evidence was provided by the furnisher
5. Who at your agency reviewed this documentation
6. The specific results of the reinvestigation

THE STATUTE REQUIRES YOU PROVIDE THIS INFORMATION WITHIN 15 DAYS OF RECEIVING MY REQUEST.

Additionally, I dispute the accuracy of your verification. A generic "verified" response does not satisfy your obligation to conduct a "reasonable investigation" as required by § 1681i(a)(1)(A).

If you cannot provide adequate documentation of your verification procedures, I request that the disputed item be immediately deleted from my credit file.

Sincerely,

_______________________________
[CLIENT_NAME]
[CLIENT_ADDRESS]

Enclosures:
• Copy of original dispute letter
• Copy of dispute results received`
  },
  {
    id: 'reinsertion_violation',
    name: 'Re-Insertion Violation Letter',
    category: 'VIOLATION',
    description: 'Demands removal AND $1,000 statutory damages for re-inserting a previously deleted item without proper 5-day notice. Bureaus must notify you within 5 business days of re-inserting deleted information - if they did not, this is an automatic FCRA violation.',
    legalBasis: 'FCRA § 611(a)(5)(B), 15 U.S.C. § 1681i(a)(5), § 1681n',
    useCase: 'Use when a previously deleted item reappears on your credit report and you did NOT receive written notice within 5 days of the re-insertion. This is a powerful letter because most bureaus fail to send the required notice, making this an automatic $1,000 violation case.',
    mailMethod: 'certified_required',
    successRate: 'High',
    potentialDamages: 1000,
    attachments: ['Copy of government-issued ID', 'Proof of address', 'Original deletion confirmation (if available)', 'Current credit report showing re-insertion'],
    content: `[DATE]

[CLIENT_NAME]
[CLIENT_ADDRESS]
[CLIENT_CITY], [CLIENT_STATE] [CLIENT_ZIP]

[BUREAU_NAME]
[BUREAU_ADDRESS]

Re: NOTICE OF FCRA § 611 VIOLATION - RE-INSERTION OF PREVIOUSLY DELETED INFORMATION
Account: [CREDITOR_NAME] [ACCOUNT_NUMBER]

To Whom It May Concern:

This letter serves as formal notice that you have VIOLATED THE FAIR CREDIT REPORTING ACT (FCRA) by re-inserting previously deleted information onto my credit report without complying with the mandatory requirements of 15 U.S.C. § 1681i(a)(5).

═══════════════════════════════════════════════════════════════════════
TIMELINE OF EVENTS:
═══════════════════════════════════════════════════════════════════════

• Original Dispute Filed: [ORIGINAL_DISPUTE_DATE]
• Item Deleted from Credit File: [DELETION_DATE]
• Re-Insertion Discovered: [REINSERTION_DISCOVERY_DATE]

I disputed the above-referenced account on [ORIGINAL_DISPUTE_DATE]. Following your investigation, this item was DELETED from my credit file, as confirmed by my credit report dated [DELETION_DATE].

I have now discovered that this same item has been RE-INSERTED onto my credit report as of [REINSERTION_DISCOVERY_DATE].

═══════════════════════════════════════════════════════════════════════
NOTICE VIOLATION:
═══════════════════════════════════════════════════════════════════════

I did NOT receive any written notification of this re-insertion within 5 business days, or at any time.

This is a direct violation of FCRA § 611(a)(5)(B), which states:

    "If any information that has been deleted from a consumer's file pursuant
    to subparagraph (A) is reinserted in the file, the consumer reporting agency
    shall notify the consumer of the reinsertion in writing not later than 5
    business days after the reinsertion..."

Under 15 U.S.C. § 1681n, I am entitled to STATUTORY DAMAGES OF $100 TO $1,000 for your willful noncompliance with the FCRA, plus punitive damages and attorney's fees as the court may allow.

═══════════════════════════════════════════════════════════════════════
LEGAL REQUIREMENTS YOU HAVE VIOLATED:
═══════════════════════════════════════════════════════════════════════

FCRA § 611(a)(5)(A) - Certification Requirement:
    "If any information is deleted from a consumer's file pursuant to
    subparagraph (A), the information may not be reinserted in the file by
    the consumer reporting agency unless the person who furnishes the
    information certifies that the information is complete and accurate."

FCRA § 611(a)(5)(B) - Notice Requirement:
    The bureau must provide written notice within 5 business days including:
    (i) statement that disputed information has been reinserted;
    (ii) name, address, and telephone number of the furnisher;
    (iii) notice of the consumer's right to add a statement disputing the information.

═══════════════════════════════════════════════════════════════════════
DEMANDS:
═══════════════════════════════════════════════════════════════════════

I demand that you immediately take the following actions:

1. IMMEDIATELY DELETE the re-inserted item from my credit file.

2. PROVIDE WRITTEN CONFIRMATION of the deletion within 15 days of receipt of this letter.

3. PROVIDE THE NAME, ADDRESS, AND TELEPHONE NUMBER of the furnisher who purportedly certified this information as "complete and accurate" per § 611(a)(5)(A).

4. REMIT $1,000 IN STATUTORY DAMAGES for your willful violation of FCRA § 611(a)(5)(B) within 30 days.

═══════════════════════════════════════════════════════════════════════
NOTICE OF INTENT TO PURSUE REMEDIES:
═══════════════════════════════════════════════════════════════════════

If this matter is not resolved within 15 days of your receipt of this letter, I intend to:

• File a formal complaint with the Consumer Financial Protection Bureau (CFPB)
• File a complaint with the Federal Trade Commission (FTC)
• Pursue all available civil remedies under 15 U.S.C. § 1681n (willful noncompliance) and § 1681o (negligent noncompliance), including statutory damages, punitive damages, and attorney's fees

Please govern yourself accordingly.


Respectfully,



_______________________________
[CLIENT_NAME]


Enclosures:
• Copy of government-issued identification
• Copy of proof of address
• Copy of original deletion confirmation (if available)
• Copy of current credit report showing re-insertion

═══════════════════════════════════════════════════════════════════════
SENT VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED
═══════════════════════════════════════════════════════════════════════`
  },
  {
    id: 'unauthorized_inquiry_bureau',
    name: 'Unauthorized Inquiry Dispute (Bureau)',
    category: 'INQUIRY',
    description: 'Disputes a hard inquiry that you did not authorize. Bureau must verify permissible purpose or remove.',
    legalBasis: 'FCRA § 604, 15 U.S.C. § 1681b',
    useCase: 'Use when you see a hard inquiry from a company you never applied for credit with.',
    mailMethod: 'regular_ok',
    successRate: 'High',
    content: `[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

Re: Removal of Unauthorized Hard Inquiry
Social Security Number: XXX-XX-[LAST_4_SSN]

Dear Sir or Madam:

I am writing to dispute an unauthorized hard inquiry appearing on my credit report. I did not authorize this inquiry and request its immediate removal.

UNAUTHORIZED INQUIRY DETAILS:
Company Name: [INQUIRY_COMPANY]
Date of Inquiry: [INQUIRY_DATE]

I hereby certify that:
1. I did NOT apply for credit with this company
2. I did NOT authorize anyone to apply on my behalf
3. I have NO knowledge of this inquiry

Under the Fair Credit Reporting Act, Section 604 (15 U.S.C. § 1681b), a credit report may only be obtained for a "permissible purpose." Pulling a credit report without permissible purpose is a violation of federal law.

I request that you:
1. Investigate this unauthorized inquiry
2. Provide documentation of the permissible purpose claimed
3. Remove this inquiry if no valid permissible purpose exists
4. Provide written confirmation of removal

If your investigation confirms this inquiry was unauthorized, please also provide me with the contact information for the company so I may pursue this violation directly.

Sincerely,

_______________________________
[CLIENT_NAME]
[CLIENT_ADDRESS]

Enclosures:
• Copy of ID
• Copy of credit report showing inquiry`
  },
  {
    id: 'unauthorized_inquiry_creditor',
    name: 'Unauthorized Inquiry Demand (Creditor)',
    category: 'INQUIRY',
    description: 'Demands the creditor prove they had permissible purpose to access your credit report, or request they remove the inquiry.',
    legalBasis: 'FCRA § 604, 15 U.S.C. § 1681b',
    useCase: 'Send directly to the company that made the unauthorized inquiry demanding they prove their permissible purpose.',
    mailMethod: 'regular_ok',
    successRate: 'High',
    content: `[DATE]

[COMPANY_NAME]
[COMPANY_ADDRESS]

Re: Demand for Proof of Permissible Purpose - Unauthorized Credit Inquiry
Date of Inquiry: [INQUIRY_DATE]

Dear Sir or Madam:

I recently reviewed my credit report and discovered that your company accessed my credit file on [INQUIRY_DATE]. I did not apply for credit with your company and did not authorize this inquiry.

Under the Fair Credit Reporting Act, Section 604 (15 U.S.C. § 1681b), you may only access a consumer's credit report for a permissible purpose, including:
• In response to a credit application by the consumer
• For a legitimate business transaction initiated by the consumer
• For employment purposes (with consumer authorization)

I DID NOT:
• Apply for credit with your company
• Initiate any business transaction with your company
• Authorize anyone to apply on my behalf

I demand that you:
1. Provide written documentation of the permissible purpose you had to access my credit
2. If no permissible purpose exists, immediately contact all credit bureaus to remove this inquiry
3. Provide written confirmation that the inquiry has been removed

If you cannot provide documentation of a legitimate permissible purpose within 15 days, I will:
• File a complaint with the Consumer Financial Protection Bureau
• File a complaint with the Federal Trade Commission
• Consider legal action under the FCRA for willful noncompliance

Unauthorized access to a credit report is a federal offense punishable by fines and civil liability.

Sincerely,

_______________________________
[CLIENT_NAME]
[CLIENT_ADDRESS]`
  },
  {
    id: 'late_payment_dispute',
    name: 'Late Payment Dispute',
    category: 'LATE_PAYMENT',
    description: 'Disputes late payment reporting as unverifiable. Many creditors cannot provide exact documentation of late dates.',
    legalBasis: 'FCRA § 611, § 623, 15 U.S.C. § 1681i',
    useCase: 'Use to dispute late payments, especially on closed accounts where creditors may have difficulty verifying exact payment dates.',
    mailMethod: 'certified_recommended',
    successRate: 'Medium',
    content: `[DATE]

[BUREAU_NAME]
[BUREAU_ADDRESS]

Re: Dispute of Late Payment Reporting
Social Security Number: XXX-XX-[LAST_4_SSN]

Dear Sir or Madam:

I am writing to dispute the late payment information being reported on the following account:

ACCOUNT INFORMATION:
Creditor Name: [CREDITOR_NAME]
Account Number: [ACCOUNT_NUMBER]
Late Payment Date(s) Reported: [LATE_DATES]

I dispute this late payment reporting for the following reasons:
[SELECT/CUSTOMIZE AS APPLICABLE]
• My records show payment was made on time
• The late date being reported is inaccurate
• I was never notified of a late payment during this period
• The payment was received before the grace period expired
• This account was current during the period shown as late

Under the Fair Credit Reporting Act, you are required to conduct a reasonable investigation and the creditor must verify the exact dates and circumstances of the alleged late payment.

I request that you:
1. Investigate this dispute
2. Require the furnisher to provide documentation proving the payment was late
3. Delete or correct the late payment notation if it cannot be verified
4. Provide me with the results of your investigation

If the furnisher cannot provide specific documentation proving the payment was received late, this information must be deleted.

Sincerely,

_______________________________
[CLIENT_NAME]
[CLIENT_ADDRESS]

Enclosures:
• Supporting documentation (if available)`
  },
  {
    id: 'direct_creditor_dispute',
    name: 'Direct Creditor/Furnisher Dispute',
    category: 'CREDITOR_DISPUTE',
    description: 'Disputes directly with the company reporting the information. Furnishers have a legal duty to investigate.',
    legalBasis: 'FCRA § 623, 15 U.S.C. § 1681s-2',
    useCase: 'Use to dispute inaccurate information directly with the original creditor or furnisher. They must investigate and report corrections to all bureaus.',
    mailMethod: 'certified_recommended',
    successRate: 'Medium',
    content: `[DATE]

[CREDITOR_NAME]
[CREDITOR_ADDRESS]

Re: Direct Dispute of Credit Reporting
Account Number: [ACCOUNT_NUMBER]

Dear Credit Reporting Department:

I am writing to dispute inaccurate information that your company is reporting to the credit bureaus regarding my account.

ACCOUNT INFORMATION:
Account Number: [ACCOUNT_NUMBER]
Account Type: [ACCOUNT_TYPE]
Current Reported Status: [REPORTED_STATUS]

DISPUTED INFORMATION:
The following information is inaccurate: [SPECIFIC_INACCURACY]
The correct information should be: [CORRECT_INFORMATION]
Reason this is incorrect: [EXPLANATION]

Under the Fair Credit Reporting Act, 15 U.S.C. § 1681s-2(b), as a furnisher of information you are required to:

1. Conduct an investigation with respect to the disputed information
2. Review all relevant information provided by the consumer
3. Report the results of the investigation to the consumer reporting agency
4. If the investigation finds the information is inaccurate, incomplete, or cannot be verified, report this to every CRA to which you reported
5. Modify, delete, or permanently block reporting of information found to be inaccurate

Additionally, under § 1681s-2(a)(1)(A), you have a duty not to report information you know or have reasonable cause to believe is inaccurate.

I request that you:
1. Investigate this dispute
2. Correct the inaccurate information
3. Report the correction to Equifax, Experian, TransUnion, and Innovis
4. Provide me with written confirmation of the correction

Please respond within 30 days as required by law.

Sincerely,

_______________________________
[CLIENT_NAME]
[CLIENT_ADDRESS]

Enclosures:
• Supporting documentation
• Copy of credit report showing inaccurate information`
  },
  {
    id: 'opt_out_letter',
    name: 'Opt-Out Letter',
    category: 'CREDITOR_DISPUTE',
    description: 'Exercise your privacy rights under 15 U.S.C. § 6802(b) to stop creditors from sharing your nonpublic personal information.',
    legalBasis: '15 U.S.C. § 6802(b) - Gramm-Leach-Bliley Act',
    useCase: 'Use when you want to stop a creditor from sharing your personal information with third parties or for marketing purposes. Also useful for requesting account status be updated to "Paid as Agreed".',
    mailMethod: 'regular_ok',
    successRate: 'Medium',
    content: `[DATE]

[CLIENT_NAME]
[CLIENT_ADDRESS]
[CLIENT_CITY], [CLIENT_STATE] [CLIENT_ZIP]

[CREDITOR_NAME]
[CREDITOR_ADDRESS]

RE: Opt-Out Request Pursuant to 15 U.S. Code § 6802(b)

Dear Sir/Madam:

I am writing to exercise my right to opt-out of the sharing and utilization of my nonpublic personal information, as provided for under 15 U.S. Code § 6802(b). This letter serves as formal notification of my request that your institution cease using or sharing my personal information for any purpose beyond the necessary servicing of my account.

ACCOUNT INFORMATION:
Account Number: [ACCOUNT_NUMBER]
Account Holder: [CLIENT_NAME]

I HEREBY REQUEST THAT YOU:

1. Cease sharing my nonpublic personal information with any nonaffiliated third parties

2. Remove my information from any marketing lists or databases shared with other companies

3. Stop using my information for any purpose other than servicing my existing account

4. Update my account status to reflect "Paid as Agreed" moving forward (if applicable)

5. Provide written confirmation of this opt-out request within 10 days

LEGAL BASIS:

Under 15 U.S.C. § 6802(b), financial institutions must provide consumers with the opportunity to opt-out of the sharing of nonpublic personal information with nonaffiliated third parties. I am exercising this right.

Please confirm receipt of this request in writing within 10 days of receiving this letter, as well as the steps your institution will take to ensure compliance with this opt-out request.

Sincerely,



_______________________________
[CLIENT_NAME]
[CLIENT_ADDRESS]`
  },
  {
    id: 'identity_affidavit',
    name: 'Affidavit of Identity & Correction Request',
    category: 'IDENTITY_THEFT',
    description: 'Sworn affidavit to correct personal information mismatches on credit reports. Use when bureaus have wrong name, address, or other identifying information.',
    legalBasis: 'FCRA § 611, § 623 - Accuracy of Consumer Reports',
    useCase: 'Use when credit bureaus or furnishers are reporting personal information that does not match your government-issued identification. This notarized affidavit demands correction of your identifying information.',
    mailMethod: 'certified_required',
    successRate: 'High',
    attachments: ['Government-issued photo ID', 'Proof of current address', 'Social Security card (optional)'],
    content: `═══════════════════════════════════════════════════════════════════════
                    AFFIDAVIT OF IDENTITY & CORRECTION REQUEST
═══════════════════════════════════════════════════════════════════════

                         Affidavit of [CLIENT_NAME]

              I, [CLIENT_NAME], being duly sworn, declare:


1. I am a natural person domiciled in [CLIENT_CITY], [CLIENT_STATE].

2. I am the individual associated with the consumer file identified by
   SSN ending in [LAST_4_SSN] and DOB [DATE_OF_BIRTH].

3. The consumer reporting agencies and/or furnishers are reporting personal
   information that does not match my government-issued identification.

4. The correct identifying information is:

   - Full Legal Name: [CLIENT_NAME]
   - Current Address: [CLIENT_ADDRESS], [CLIENT_CITY], [CLIENT_STATE] [CLIENT_ZIP]
   - Date of Birth: [DATE_OF_BIRTH]
   - Employer: [EMPLOYER_NAME]

5. I hereby swear under penalty of perjury that the enclosed documents
   reflect my true and accurate information.

6. I demand that the consumer reporting agencies and furnishers correct
   all reporting immediately to reflect this information.



Signed: _____________________________     Date: _____________________________

Printed Name: [CLIENT_NAME]



═══════════════════════════════════════════════════════════════════════
                         NOTARY ACKNOWLEDGMENT
═══════════════════════════════════════════════════════════════════════

State of _______________
County of ______________

Subscribed and sworn before me this _____ day of _____________, 20___
by [CLIENT_NAME].



Notary Public: _____________________________

My Commission Expires: _____________________________



                            [NOTARY SEAL]`
  },
  {
    id: 'late_payment_affidavit',
    name: 'Sworn Affidavit - Unverifiable Late Payment',
    category: 'LATE_PAYMENT',
    description: 'Notarized sworn statement declaring that a creditor cannot verify late payment reporting. Powerful evidence when combined with creditor dispute.',
    legalBasis: 'FCRA § 1681e(b), § 1681i - Maximum Possible Accuracy',
    useCase: 'Use after speaking with a creditor who admits they cannot verify late payment dates. Document the call details (date, representative name) and submit this notarized affidavit to bureaus.',
    mailMethod: 'certified_required',
    successRate: 'High',
    attachments: ['Notes from phone call with creditor', 'Credit report showing inconsistent reporting'],
    content: `═══════════════════════════════════════════════════════════════════════
      SWORN AFFIDAVIT - UNVERIFIABLE/MISLEADING LATE-PAYMENT REPORTING
═══════════════════════════════════════════════════════════════════════

                I, [CLIENT_NAME], being duly sworn, declare:


1. I am the natural person associated with [CREDITOR_NAME] account
   [ACCOUNT_NUMBER]; DOB [DATE_OF_BIRTH], SSN last 4: [LAST_4_SSN].

2. On [CALL_DATE], I spoke with [CREDITOR_NAME], and a representative
   named [REP_NAME] stated that "their system is unable to go back far
   enough to verify the reporting in question."

3. Because the late-payment entry/entries cannot be verified by the
   furnisher, they are UNVERIFIABLE AND MISLEADING for credit reporting
   purposes.

4. The late-payment reporting has been INCONSISTENT ACROSS EQUIFAX,
   EXPERIAN, AND TRANSUNION, which violates FCRA's "maximum possible
   accuracy" standard.

5. I request and affirm that any such unverifiable late-payment
   entry/entries must be DELETED OR CORRECTED across all CRAs, and that
   [CREDITOR_NAME] must CEASE FURNISHING unverifiable information.

6. I affirm that the foregoing statements are true and correct to the
   best of my knowledge.



Signature: _____________________________     Date: _____________________________

[CLIENT_NAME]



═══════════════════════════════════════════════════════════════════════
                         NOTARY ACKNOWLEDGMENT
═══════════════════════════════════════════════════════════════════════

State of _______________
County of ______________

Subscribed and sworn before me this _____ day of _____________, 20___
by [CLIENT_NAME].



Notary Public: _____________________________

My Commission Expires: _____________________________



                            [NOTARY SEAL]`
  }
];

export const INITIAL_LETTERS: DisputeLetter[] = [
  {
    id: 'L1',
    clientId: '1',
    clientName: 'John Doe',
    templateId: 'debt_validation',
    content: 'Dear Credit Bureau, I dispute the Capital One account...',
    createdAt: '2024-01-20',
    status: 'sent'
  }
];

// Template document requirements for mail service
export interface TemplateRequirement {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

export interface TemplateRequirements {
  templateId: string;
  templateName: string;
  requirements: TemplateRequirement[];
  requiresNotarization: boolean;
  canSendViaCloudMail: boolean;
  notes?: string;
}

// Document requirements mapping by template type
export const TEMPLATE_REQUIREMENTS: Record<string, TemplateRequirements> = {
  // Identity Theft templates
  bureau_dispute_identity_theft: {
    templateId: 'bureau_dispute_identity_theft',
    templateName: 'Identity Theft Dispute',
    requirements: [
      { id: 'ftc_affidavit', label: 'FTC Identity Theft Affidavit', description: 'File at IdentityTheft.gov', required: true },
      { id: 'police_report', label: 'Police Report', description: 'Local police department report', required: true },
      { id: 'gov_id', label: 'Government-issued ID', description: 'Driver\'s license or passport copy', required: true },
      { id: 'proof_of_address', label: 'Proof of Address', description: 'Utility bill or bank statement', required: false },
    ],
    requiresNotarization: false,
    canSendViaCloudMail: true,
    notes: 'Bureau must block within 4 business days with proper documentation',
  },

  // Affidavit templates (require notarization)
  identity_affidavit: {
    templateId: 'identity_affidavit',
    templateName: 'Affidavit of Identity & Correction Request',
    requirements: [
      { id: 'gov_id', label: 'Government-issued ID', description: 'Driver\'s license or passport copy', required: true },
      { id: 'proof_of_address', label: 'Proof of Address', description: 'Utility bill or bank statement', required: true },
      { id: 'ssn_card', label: 'Social Security Card', description: 'Copy of SSN card (optional)', required: false },
    ],
    requiresNotarization: true,
    canSendViaCloudMail: false,
    notes: 'Must be notarized before mailing - download and mail manually',
  },

  late_payment_affidavit: {
    templateId: 'late_payment_affidavit',
    templateName: 'Sworn Affidavit - Unverifiable Late Payment',
    requirements: [
      { id: 'call_notes', label: 'Phone Call Notes', description: 'Notes from creditor call with date, rep name', required: true },
      { id: 'credit_report', label: 'Credit Report', description: 'Report showing inconsistent reporting', required: true },
    ],
    requiresNotarization: true,
    canSendViaCloudMail: false,
    notes: 'Must be notarized before mailing - download and mail manually',
  },

  // Bureau dispute templates
  bureau_dispute_not_mine: {
    templateId: 'bureau_dispute_not_mine',
    templateName: 'Bureau Dispute - Account Not Mine',
    requirements: [
      { id: 'gov_id', label: 'Government-issued ID', description: 'Driver\'s license or passport copy', required: true },
      { id: 'proof_of_address', label: 'Proof of Address', description: 'Utility bill or bank statement', required: true },
    ],
    requiresNotarization: false,
    canSendViaCloudMail: true,
  },

  bureau_dispute_inaccurate: {
    templateId: 'bureau_dispute_inaccurate',
    templateName: 'Bureau Dispute - Inaccurate Information',
    requirements: [
      { id: 'gov_id', label: 'Government-issued ID', description: 'Driver\'s license or passport copy', required: true },
      { id: 'supporting_docs', label: 'Supporting Documentation', description: 'Evidence proving the inaccuracy', required: false },
    ],
    requiresNotarization: false,
    canSendViaCloudMail: true,
  },

  // Re-insertion template
  reinsertion_violation: {
    templateId: 'reinsertion_violation',
    templateName: 'Re-Insertion Violation Letter',
    requirements: [
      { id: 'gov_id', label: 'Government-issued ID', description: 'Driver\'s license or passport copy', required: true },
      { id: 'proof_of_address', label: 'Proof of Address', description: 'Utility bill or bank statement', required: true },
      { id: 'original_deletion', label: 'Original Deletion Confirmation', description: 'Letter confirming item was deleted', required: true },
      { id: 'current_report', label: 'Current Credit Report', description: 'Report showing re-insertion', required: true },
    ],
    requiresNotarization: false,
    canSendViaCloudMail: true,
    notes: 'Potential $1,000 statutory damages',
  },

  // Method of verification
  method_of_verification: {
    templateId: 'method_of_verification',
    templateName: 'Method of Verification Demand',
    requirements: [
      { id: 'original_dispute', label: 'Original Dispute Letter', description: 'Copy of your original dispute', required: true },
      { id: 'dispute_results', label: 'Dispute Results', description: 'Bureau\'s verification response', required: true },
    ],
    requiresNotarization: false,
    canSendViaCloudMail: true,
  },

  // Debt validation
  debt_validation: {
    templateId: 'debt_validation',
    templateName: 'Debt Validation Letter',
    requirements: [],
    requiresNotarization: false,
    canSendViaCloudMail: true,
    notes: 'Send within 30 days of first collector contact',
  },

  // Goodwill and negotiation
  goodwill_letter: {
    templateId: 'goodwill_letter',
    templateName: 'Goodwill Deletion Request',
    requirements: [],
    requiresNotarization: false,
    canSendViaCloudMail: true,
    notes: 'Courtesy request - works best with original creditors',
  },

  pay_for_delete: {
    templateId: 'pay_for_delete',
    templateName: 'Pay-for-Delete Negotiation',
    requirements: [],
    requiresNotarization: false,
    canSendViaCloudMail: true,
    notes: 'Get agreement in writing before paying',
  },

  // Inquiry disputes
  unauthorized_inquiry_bureau: {
    templateId: 'unauthorized_inquiry_bureau',
    templateName: 'Unauthorized Inquiry Dispute (Bureau)',
    requirements: [
      { id: 'gov_id', label: 'Government-issued ID', description: 'Driver\'s license or passport copy', required: true },
      { id: 'credit_report', label: 'Credit Report', description: 'Report showing the inquiry', required: true },
    ],
    requiresNotarization: false,
    canSendViaCloudMail: true,
  },

  unauthorized_inquiry_creditor: {
    templateId: 'unauthorized_inquiry_creditor',
    templateName: 'Unauthorized Inquiry Demand (Creditor)',
    requirements: [],
    requiresNotarization: false,
    canSendViaCloudMail: true,
  },

  // Late payment dispute
  late_payment_dispute: {
    templateId: 'late_payment_dispute',
    templateName: 'Late Payment Dispute',
    requirements: [
      { id: 'supporting_docs', label: 'Supporting Documentation', description: 'Payment records or statements', required: false },
    ],
    requiresNotarization: false,
    canSendViaCloudMail: true,
  },

  // Direct creditor dispute
  direct_creditor_dispute: {
    templateId: 'direct_creditor_dispute',
    templateName: 'Direct Creditor/Furnisher Dispute',
    requirements: [
      { id: 'supporting_docs', label: 'Supporting Documentation', description: 'Evidence of inaccuracy', required: false },
      { id: 'credit_report', label: 'Credit Report', description: 'Report showing inaccurate info', required: true },
    ],
    requiresNotarization: false,
    canSendViaCloudMail: true,
  },

  // Opt-out letter
  opt_out_letter: {
    templateId: 'opt_out_letter',
    templateName: 'Opt-Out Letter',
    requirements: [],
    requiresNotarization: false,
    canSendViaCloudMail: true,
  },
};

// Helper to get requirements for a template
export function getTemplateRequirements(templateId: string): TemplateRequirements | null {
  return TEMPLATE_REQUIREMENTS[templateId] || null;
}

// Helper to check if template requires notarization
export function templateRequiresNotarization(templateId: string): boolean {
  const requirements = TEMPLATE_REQUIREMENTS[templateId];
  return requirements?.requiresNotarization ?? false;
}

// Helper to check if template can be sent via cloud mail
export function canSendViaCloudMail(templateId: string): boolean {
  const requirements = TEMPLATE_REQUIREMENTS[templateId];
  return requirements?.canSendViaCloudMail ?? true;
}
