
import React, { useState } from 'react';
import { DISPUTE_TEMPLATES, BUREAU_ADDRESSES } from '../constants';
import { Shield, AlertTriangle, Scale, CheckCircle, Copy, X, Mail, FileText, Clock, DollarSign } from 'lucide-react';

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

const AdminTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof DISPUTE_TEMPLATES[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'mailing'>('content');

  const copyContent = async () => {
    if (!selectedTemplate) return;
    await navigator.clipboard.writeText(selectedTemplate.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            These letters cite the exact laws that protect you. Credit bureaus must investigate within 30 days or remove the item.
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
                setActiveTab('content');
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
              <p className="text-sm text-slate-500 mb-4 min-h-[3rem] line-clamp-2">{template.description}</p>

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
                onClick={() => setSelectedTemplate(null)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-6">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === 'content'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Letter Content
              </button>
              <button
                onClick={() => setActiveTab('mailing')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === 'mailing'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Mail className="h-4 w-4" />
                Certified Mail Info
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {activeTab === 'content' ? (
                <>
                  {/* Legal Basis & Use Case */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                        <Scale className="h-4 w-4" />
                        Legal Basis
                      </h4>
                      <p className="text-sm text-blue-700">{selectedTemplate.legalBasis}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-amber-900 mb-1 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        When to Use
                      </h4>
                      <p className="text-sm text-amber-700">{selectedTemplate.useCase}</p>
                    </div>
                  </div>

                  {/* Success Rate & Mail Method */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{selectedTemplate.successRate} Success Rate</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className={`text-sm font-medium ${MAIL_METHOD_CONFIG[selectedTemplate.mailMethod].color}`}>
                        {MAIL_METHOD_CONFIG[selectedTemplate.mailMethod].label}
                      </span>
                    </div>
                  </div>

                  {/* Attachments if any */}
                  {selectedTemplate.attachments && (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-bold text-purple-900 mb-2">Required Attachments</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        {selectedTemplate.attachments.map((att, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5" />
                            {att}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Re-Insertion Guide - Only show for reinsertion_violation template */}
                  {selectedTemplate.id === 'reinsertion_violation' && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Does Your Client Have a Re-Insertion Case? ($1,000 Potential)
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                          <div>
                            <p className="font-medium text-green-800">Did they dispute an item in the past?</p>
                            <p className="text-green-600">Could be a collection, charge-off, late payment, inquiry, or any negative item</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                          <div>
                            <p className="font-medium text-green-800">Was the item successfully deleted/removed?</p>
                            <p className="text-green-600">Check for deletion confirmation letter or if item disappeared from report</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                          <div>
                            <p className="font-medium text-green-800">Is that same item back on their credit report now?</p>
                            <p className="text-green-600">Pull current credit report and check if the item reappeared</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                          <div>
                            <p className="font-medium text-green-800">Did they receive written notice within 5 days?</p>
                            <p className="text-green-600">Bureaus MUST notify within 5 business days of re-inserting</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-green-100 rounded-lg">
                        <p className="font-bold text-green-900">
                          If YES to #1-3 and NO to #4 = <span className="text-green-700">$1,000 VIOLATION CASE!</span>
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          The bureau re-inserted the item WITHOUT proper notice. This is an automatic FCRA § 611 violation entitling your client to statutory damages.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Placeholder Notice */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Placeholders:</strong> Replace text in [BRACKETS] with actual client information when generating letters.
                    </p>
                  </div>

                  {/* Letter Content */}
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 bg-slate-50 p-6 rounded-lg border border-slate-200 max-h-[400px] overflow-auto">
                    {selectedTemplate.content}
                  </pre>
                </>
              ) : (
                <>
                  {/* Certified Mail Instructions */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-blue-900 mb-2">Certified Mail Instructions</h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li>• Send all dispute letters via <strong>USPS Certified Mail with Return Receipt Requested</strong></li>
                      <li>• Keep a copy of the letter and the certified mail receipt for your records</li>
                      <li>• The return receipt (green card) provides proof of delivery</li>
                      <li>• Tracking number format: 9407 3000 0000 0000 0000 00</li>
                    </ul>
                  </div>

                  {/* Mailing Cost Breakdown */}
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-green-900 mb-3">USPS Certified Mail Cost Breakdown</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white p-3 rounded border border-green-200">
                        <p className="font-medium text-green-800">Certified Mail Fee</p>
                        <p className="text-2xl font-bold text-green-700">$4.10</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-200">
                        <p className="font-medium text-green-800">Return Receipt</p>
                        <p className="text-2xl font-bold text-green-700">$3.35</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-200">
                        <p className="font-medium text-green-800">First-Class Postage</p>
                        <p className="text-2xl font-bold text-green-700">$0.68</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200 flex justify-between items-center">
                      <span className="font-bold text-green-900">Total per letter:</span>
                      <span className="text-xl font-bold text-green-700">~$8.13</span>
                    </div>
                    <p className="text-xs text-green-600 mt-2">* Prices as of 2024 - rates may vary</p>
                  </div>

                  {/* When to Use Certified Mail */}
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      When to Use Certified Mail
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-3">
                        <div className="w-28 font-bold text-red-700">ALWAYS</div>
                        <div className="flex-1 text-amber-700">
                          When demanding money ($1,000 damages), for identity theft cases, re-insertion violations, or if you might file a CFPB complaint or lawsuit
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-28 font-bold text-yellow-700">RECOMMENDED</div>
                        <div className="flex-1 text-amber-700">
                          For bureau disputes and method of verification requests - creates paper trail
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-28 font-bold text-green-700">OPTIONAL</div>
                        <div className="flex-1 text-amber-700">
                          For goodwill requests and simple creditor disputes without damage claims
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bureau Addresses */}
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Credit Bureau Mailing Addresses</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(BUREAU_ADDRESSES).map(([key, bureau]) => (
                      <div key={key} className="bg-white border border-slate-200 rounded-lg p-4">
                        <h5 className="font-bold text-slate-900 mb-2">{bureau.name}</h5>
                        <p className="text-sm text-slate-600">{bureau.address}</p>
                        <p className="text-sm text-slate-600">{bureau.cityStateZip}</p>
                        <button
                          onClick={async () => {
                            const fullAddress = `${bureau.name}\n${bureau.address}\n${bureau.cityStateZip}`;
                            await navigator.clipboard.writeText(fullAddress);
                          }}
                          className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Copy address
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Number Placeholder */}
                  <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h4 className="font-bold text-slate-900 mb-3">Record Tracking Numbers</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.keys(BUREAU_ADDRESSES).map((key) => (
                        <div key={key}>
                          <label className="text-xs text-slate-500 mb-1 block capitalize">{key} Tracking #</label>
                          <input
                            type="text"
                            placeholder="9407 3000 0000 0000 0000 00"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                          />
                        </div>
                      ))}
                    </div>
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
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Template
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => setSelectedTemplate(null)}
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
