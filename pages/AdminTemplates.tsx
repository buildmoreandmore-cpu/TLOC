
import React, { useState, useMemo } from 'react';
import { DISPUTE_TEMPLATES, BUREAU_ADDRESSES } from '../constants';
import { Shield, AlertTriangle, Scale, CheckCircle, Copy, X, Mail, FileText, Clock, DollarSign, Download, Send } from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  COLLECTION: { label: 'Collection', color: 'text-red-700', bgColor: 'bg-red-50' },
  BUREAU_DISPUTE: { label: 'Bureau Dispute', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  IDENTITY_THEFT: { label: 'Identity Theft', color: 'text-orange-700', bgColor: 'bg-orange-50' },
  GOODWILL: { label: 'Goodwill', color: 'text-green-700', bgColor: 'bg-green-50' },
  NEGOTIATION: { label: 'Negotiation', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  FOLLOW_UP: { label: 'Follow-Up', color: 'text-pink-700', bgColor: 'bg-pink-50' },
  VIOLATION: { label: 'Violation', color: 'text-red-700', bgColor: 'bg-red-100' },
  INQUIRY: { label: 'Inquiry', color: 'text-cyan-700', bgColor: 'bg-cyan-50' },
  LATE_PAYMENT: { label: 'Late Payment', color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  CREDITOR_DISPUTE: { label: 'Creditor Dispute', color: 'text-indigo-700', bgColor: 'bg-indigo-50' },
};

const MAIL_METHOD_CONFIG: Record<string, { label: string; color: string }> = {
  certified_required: { label: 'Certified Required', color: 'text-red-600' },
  certified_recommended: { label: 'Certified Recommended', color: 'text-yellow-600' },
  regular_ok: { label: 'Regular Mail OK', color: 'text-green-600' },
};

// Field configurations for all possible placeholders
const FIELD_CONFIG: Record<string, { label: string; placeholder: string; type: string; section: string }> = {
  // Your Information
  'CLIENT_NAME': { label: 'Full Name', placeholder: 'John Doe', type: 'text', section: 'Your Information' },
  'CLIENT_ADDRESS': { label: 'Street Address', placeholder: '123 Main Street', type: 'text', section: 'Your Information' },
  'CLIENT_CITY': { label: 'City', placeholder: 'Atlanta', type: 'text', section: 'Your Information' },
  'CLIENT_STATE': { label: 'State', placeholder: 'GA', type: 'text', section: 'Your Information' },
  'CLIENT_ZIP': { label: 'ZIP Code', placeholder: '30301', type: 'text', section: 'Your Information' },
  'LAST_4_SSN': { label: 'SSN (Last 4)', placeholder: '1234', type: 'text', section: 'Your Information' },
  'DOB': { label: 'Date of Birth', placeholder: '01/15/1980', type: 'text', section: 'Your Information' },
  'DATE_OF_BIRTH': { label: 'Date of Birth', placeholder: '01/15/1980', type: 'text', section: 'Your Information' },
  'CLIENT_EMAIL': { label: 'Email', placeholder: 'john@example.com', type: 'email', section: 'Your Information' },
  'CLIENT_PHONE': { label: 'Phone', placeholder: '(555) 123-4567', type: 'tel', section: 'Your Information' },
  'EMPLOYER_NAME': { label: 'Employer Name', placeholder: 'ABC Company', type: 'text', section: 'Your Information' },

  // Bureau Information
  'BUREAU_NAME': { label: 'Credit Bureau', placeholder: 'Select bureau', type: 'bureau', section: 'Bureau Information' },

  // Creditor/Collector Information
  'CREDITOR_NAME': { label: 'Creditor Name', placeholder: 'Capital One', type: 'text', section: 'Creditor Information' },
  'CREDITOR_ADDRESS': { label: 'Creditor Address', placeholder: '123 Creditor St, City, ST 12345', type: 'textarea', section: 'Creditor Information' },
  'COLLECTOR_NAME': { label: 'Collection Agency Name', placeholder: 'ABC Collections', type: 'text', section: 'Collector Information' },
  'COLLECTOR_ADDRESS': { label: 'Collector Address', placeholder: '123 Collector St, City, ST 12345', type: 'textarea', section: 'Collector Information' },
  'ORIGINAL_CREDITOR': { label: 'Original Creditor', placeholder: 'Original bank or company', type: 'text', section: 'Creditor Information' },
  'COMPANY_NAME': { label: 'Company Name', placeholder: 'Company that made inquiry', type: 'text', section: 'Company Information' },
  'COMPANY_ADDRESS': { label: 'Company Address', placeholder: '123 Company St, City, ST 12345', type: 'textarea', section: 'Company Information' },

  // Account Information
  'ACCOUNT_NUMBER': { label: 'Account Number', placeholder: 'XXXX-XXXX-1234', type: 'text', section: 'Account Information' },
  'BALANCE': { label: 'Balance', placeholder: '$1,234.56', type: 'text', section: 'Account Information' },
  'CLAIMED_BALANCE': { label: 'Claimed Balance', placeholder: '$1,234.56', type: 'text', section: 'Account Information' },
  'ACCOUNT_TYPE': { label: 'Account Type', placeholder: 'Credit Card, Auto Loan, etc.', type: 'text', section: 'Account Information' },
  'DATE_OPENED': { label: 'Date Opened', placeholder: '01/15/2020', type: 'text', section: 'Account Information' },
  'AMOUNT': { label: 'Amount', placeholder: '$1,234.56', type: 'text', section: 'Account Information' },

  // Dispute Details
  'CURRENT_REPORTED_INFO': { label: 'What Is Being Reported', placeholder: 'Describe current incorrect info', type: 'textarea', section: 'Dispute Details' },
  'CORRECT_INFO': { label: 'What Is Accurate', placeholder: 'Describe what should be reported', type: 'textarea', section: 'Dispute Details' },
  'EXPLANATION': { label: 'Explanation', placeholder: 'Explain the situation...', type: 'textarea', section: 'Dispute Details' },
  'REPORTED_STATUS': { label: 'Current Reported Status', placeholder: '30 days late, Charge-off, etc.', type: 'text', section: 'Dispute Details' },
  'SPECIFIC_INACCURACY': { label: 'Specific Inaccuracy', placeholder: 'Describe what is wrong', type: 'textarea', section: 'Dispute Details' },
  'CORRECT_INFORMATION': { label: 'Correct Information', placeholder: 'What it should say', type: 'textarea', section: 'Dispute Details' },
  'SPECIFIC_ITEM': { label: 'Specific Item Disputed', placeholder: 'Late payment, balance, etc.', type: 'text', section: 'Dispute Details' },

  // Inquiry Information
  'INQUIRY_COMPANY': { label: 'Company That Made Inquiry', placeholder: 'Company name', type: 'text', section: 'Inquiry Details' },
  'INQUIRY_DATE': { label: 'Date of Inquiry', placeholder: '01/15/2024', type: 'text', section: 'Inquiry Details' },

  // Late Payment Information
  'LATE_PAYMENT_DATES': { label: 'Late Payment Date(s)', placeholder: 'March 2024, April 2024', type: 'text', section: 'Late Payment Details' },
  'LATE_DATES': { label: 'Late Payment Date(s)', placeholder: 'March 2024, April 2024', type: 'text', section: 'Late Payment Details' },

  // Negotiation
  'SETTLEMENT_AMOUNT': { label: 'Settlement Amount Offered', placeholder: '$500.00', type: 'text', section: 'Settlement Details' },
  'GOAL': { label: 'Your Goal', placeholder: 'Purchase a home, refinance, etc.', type: 'text', section: 'Settlement Details' },

  // Re-insertion Violation
  'ORIGINAL_DISPUTE_DATE': { label: 'Original Dispute Date', placeholder: '01/15/2024', type: 'text', section: 'Re-insertion Timeline' },
  'DELETION_DATE': { label: 'Date Item Was Deleted', placeholder: '02/15/2024', type: 'text', section: 'Re-insertion Timeline' },
  'REINSERTION_DISCOVERY_DATE': { label: 'Date You Discovered Re-insertion', placeholder: '04/15/2024', type: 'text', section: 'Re-insertion Timeline' },

  // Method of Verification
  'DISPUTE_CONFIRMATION_NUMBER': { label: 'Dispute Confirmation Number', placeholder: 'EFX-12345678', type: 'text', section: 'Previous Dispute' },
  'DATE_OF_RESULTS': { label: 'Date Results Received', placeholder: '01/15/2024', type: 'text', section: 'Previous Dispute' },

  // Identity Theft
  'POLICE_REPORT_NUMBER': { label: 'Police Report Number', placeholder: '2024-123456', type: 'text', section: 'Identity Theft Details' },

  // Affidavit Fields
  'CALL_DATE': { label: 'Date of Phone Call', placeholder: '01/15/2024', type: 'text', section: 'Affidavit Details' },
  'REP_NAME': { label: 'Representative Name', placeholder: 'John from Customer Service', type: 'text', section: 'Affidavit Details' },

  // State placeholder
  'STATE': { label: 'State', placeholder: 'Georgia', type: 'text', section: 'Your Information' },
};

const AdminTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof DISPUTE_TEMPLATES[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'generate' | 'mailing'>('content');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Extract placeholders from template content
  const templatePlaceholders = useMemo(() => {
    if (!selectedTemplate) return [];
    const regex = /\[([A-Z_]+)\]/g;
    const matches = selectedTemplate.content.matchAll(regex);
    const placeholders = new Set<string>();
    for (const match of matches) {
      // Skip DATE as it's auto-filled
      if (match[1] !== 'DATE') {
        placeholders.add(match[1]);
      }
    }
    return Array.from(placeholders);
  }, [selectedTemplate]);

  // Group fields by section
  const groupedFields = useMemo(() => {
    const groups: Record<string, string[]> = {};
    templatePlaceholders.forEach(placeholder => {
      const config = FIELD_CONFIG[placeholder];
      if (config) {
        if (!groups[config.section]) {
          groups[config.section] = [];
        }
        // Avoid duplicates (DOB and DATE_OF_BIRTH are same)
        if (!groups[config.section].some(p => FIELD_CONFIG[p]?.label === config.label)) {
          groups[config.section].push(placeholder);
        }
      }
    });
    return groups;
  }, [templatePlaceholders]);

  const copyContent = async () => {
    if (!selectedTemplate) return;
    await navigator.clipboard.writeText(selectedTemplate.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const generateLetter = () => {
    if (!selectedTemplate) return;

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get bureau address if bureau is selected
    const bureauKey = (formData['BUREAU_NAME'] || 'equifax').toLowerCase().replace(' ', '') as keyof typeof BUREAU_ADDRESSES;
    const bureauAddress = BUREAU_ADDRESSES[bureauKey] || BUREAU_ADDRESSES.equifax;

    // Replace placeholders in template
    let letter = selectedTemplate.content.replace(/\[DATE\]/g, today);

    // Replace BUREAU placeholders
    letter = letter
      .replace(/\[BUREAU_NAME\]/g, bureauAddress.name)
      .replace(/\[BUREAU_ADDRESS\]/g, `${bureauAddress.address}\n${bureauAddress.cityStateZip}`);

    // Replace all other placeholders with form data
    templatePlaceholders.forEach(placeholder => {
      const value = formData[placeholder] || `[${placeholder}]`;
      const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
      letter = letter.replace(regex, value);
    });

    setGeneratedLetter(letter);
    setShowPreview(true);
  };

  const downloadLetter = () => {
    if (!generatedLetter || !selectedTemplate) return;
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const clientName = formData['CLIENT_NAME'] || 'Client';
    element.download = `${selectedTemplate.name.replace(/\s+/g, '_')}_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyGeneratedLetter = async () => {
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setFormData({});
    setGeneratedLetter('');
    setShowPreview(false);
  };

  const renderField = (placeholder: string) => {
    const config = FIELD_CONFIG[placeholder];
    if (!config) return null;

    if (config.type === 'bureau') {
      return (
        <div key={placeholder}>
          <label className="block text-sm font-medium text-slate-700 mb-1">{config.label}</label>
          <select
            value={formData[placeholder] || 'Equifax'}
            onChange={(e) => updateFormData(placeholder, e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white"
          >
            <option value="Equifax">Equifax</option>
            <option value="Experian">Experian</option>
            <option value="TransUnion">TransUnion</option>
            <option value="Innovis">Innovis</option>
          </select>
        </div>
      );
    }

    if (config.type === 'textarea') {
      return (
        <div key={placeholder} className="col-span-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">{config.label}</label>
          <textarea
            value={formData[placeholder] || ''}
            onChange={(e) => updateFormData(placeholder, e.target.value)}
            placeholder={config.placeholder}
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none"
          />
        </div>
      );
    }

    return (
      <div key={placeholder}>
        <label className="block text-sm font-medium text-slate-700 mb-1">{config.label}</label>
        <input
          type={config.type}
          value={formData[placeholder] || ''}
          onChange={(e) => updateFormData(placeholder, e.target.value)}
          placeholder={config.placeholder}
          maxLength={placeholder === 'LAST_4_SSN' ? 4 : undefined}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
        />
      </div>
    );
  };

  // Order sections logically
  const sectionOrder = [
    'Your Information',
    'Bureau Information',
    'Creditor Information',
    'Collector Information',
    'Company Information',
    'Account Information',
    'Inquiry Details',
    'Late Payment Details',
    'Dispute Details',
    'Previous Dispute',
    'Re-insertion Timeline',
    'Identity Theft Details',
    'Affidavit Details',
    'Settlement Details',
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Letter Templates</h1>
          <p className="text-slate-500 mt-1">Professional dispute letters with legal citations</p>
        </div>
      </div>

      {/* Federal Law Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
          <Shield className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-1">Your rights are protected by federal law</h3>
          <p className="text-slate-600 text-sm">
            The Fair Credit Reporting Act (FCRA) gives you the right to dispute inaccurate information.
            These letters cite the exact laws that protect you.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DISPUTE_TEMPLATES.map((template) => {
          const categoryConfig = CATEGORY_CONFIG[template.category] || { label: template.category, color: 'text-slate-700', bgColor: 'bg-slate-50' };
          const mailConfig = MAIL_METHOD_CONFIG[template.mailMethod];

          return (
            <div
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template);
                setActiveTab('generate');
                resetForm();
              }}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] ${categoryConfig.bgColor} ${categoryConfig.color} px-2 py-1 rounded font-bold uppercase`}>
                  {categoryConfig.label}
                </span>
                {template.potentialDamages && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ${template.potentialDamages}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 mb-2">{template.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{template.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <Scale className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium truncate">{template.legalBasis}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className={`text-xs font-medium ${mailConfig.color}`}>{mailConfig.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500">{template.successRate} Success</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Template Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs ${CATEGORY_CONFIG[selectedTemplate.category]?.bgColor || 'bg-slate-50'} ${CATEGORY_CONFIG[selectedTemplate.category]?.color || 'text-slate-700'} px-2 py-0.5 rounded font-bold uppercase`}>
                    {CATEGORY_CONFIG[selectedTemplate.category]?.label || selectedTemplate.category}
                  </span>
                  {selectedTemplate.potentialDamages && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                      ${selectedTemplate.potentialDamages} Potential Damages
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedTemplate.name}</h2>
              </div>
              <button
                onClick={() => { setSelectedTemplate(null); resetForm(); }}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-6">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'generate' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Send className="h-4 w-4" />
                Generate Letter
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === 'content' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                View Template
              </button>
              <button
                onClick={() => setActiveTab('mailing')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'mailing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Mail className="h-4 w-4" />
                Mailing Info
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {activeTab === 'generate' ? (
                <>
                  {!showPreview ? (
                    <div className="space-y-6">
                      {/* Dynamic Form Sections */}
                      {sectionOrder.map(section => {
                        const fields = groupedFields[section];
                        if (!fields || fields.length === 0) return null;

                        return (
                          <div key={section} className="bg-white border border-slate-200 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">{section}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {fields.map(renderField)}
                            </div>
                          </div>
                        );
                      })}

                      {/* Legal Basis Info */}
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Scale className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-blue-900">Legal Basis</h4>
                            <p className="text-sm text-blue-700">{selectedTemplate.legalBasis}</p>
                          </div>
                        </div>
                      </div>

                      {/* Generate Button */}
                      <button
                        onClick={generateLetter}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <Send className="h-5 w-5" />
                        Generate Letter
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Preview Generated Letter */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Letter generated successfully!</span>
                      </div>

                      <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 bg-white p-6 rounded-lg border border-slate-200 max-h-[400px] overflow-auto mb-4">
                        {generatedLetter}
                      </pre>

                      <div className="flex gap-3">
                        <button
                          onClick={downloadLetter}
                          className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                          <Download className="h-5 w-5" />
                          Download
                        </button>
                        <button
                          onClick={copyGeneratedLetter}
                          className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-2"
                        >
                          {copied ? <><CheckCircle className="h-5 w-5" /> Copied!</> : <><Copy className="h-5 w-5" /> Copy</>}
                        </button>
                        <button
                          onClick={() => setShowPreview(false)}
                          className="py-3 px-6 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
                        >
                          Edit
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : activeTab === 'content' ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                        <Scale className="h-4 w-4" /> Legal Basis
                      </h4>
                      <p className="text-sm text-blue-700">{selectedTemplate.legalBasis}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-amber-900 mb-1 flex items-center gap-2">
                        <Clock className="h-4 w-4" /> When to Use
                      </h4>
                      <p className="text-sm text-amber-700">{selectedTemplate.useCase}</p>
                    </div>
                  </div>

                  {selectedTemplate.attachments && (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-bold text-purple-900 mb-2">Required Attachments</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        {selectedTemplate.attachments.map((att, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5" /> {att}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 bg-slate-50 p-6 rounded-lg border border-slate-200 max-h-[400px] overflow-auto">
                    {selectedTemplate.content}
                  </pre>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-blue-900 mb-2">Certified Mail Instructions</h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li>• Send via <strong>USPS Certified Mail with Return Receipt Requested</strong></li>
                      <li>• Keep a copy of the letter and receipt for your records</li>
                      <li>• The return receipt (green card) provides proof of delivery</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-green-900 mb-3">USPS Cost Breakdown</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-white p-3 rounded border border-green-200 text-center">
                        <p className="font-medium text-green-800">Certified</p>
                        <p className="text-xl font-bold text-green-700">$4.10</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-200 text-center">
                        <p className="font-medium text-green-800">Return Receipt</p>
                        <p className="text-xl font-bold text-green-700">$3.35</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-200 text-center">
                        <p className="font-medium text-green-800">Postage</p>
                        <p className="text-xl font-bold text-green-700">$0.68</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200 flex justify-between">
                      <span className="font-bold text-green-900">Total:</span>
                      <span className="text-xl font-bold text-green-700">~$8.13</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 mb-4">Bureau Addresses</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(BUREAU_ADDRESSES).map(([key, bureau]) => (
                      <div key={key} className="bg-white border border-slate-200 rounded-lg p-4">
                        <h5 className="font-bold text-slate-900 mb-2">{bureau.name}</h5>
                        <p className="text-sm text-slate-600">{bureau.address}</p>
                        <p className="text-sm text-slate-600">{bureau.cityStateZip}</p>
                        <button
                          onClick={async () => {
                            await navigator.clipboard.writeText(`${bureau.name}\n${bureau.address}\n${bureau.cityStateZip}`);
                          }}
                          className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-slate-50 rounded-b-2xl">
              {activeTab === 'content' && (
                <button
                  onClick={copyContent}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition"
                >
                  {copied ? <><CheckCircle className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Template</>}
                </button>
              )}
              <button
                onClick={() => { setSelectedTemplate(null); resetForm(); }}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplates;
