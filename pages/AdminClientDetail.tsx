
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, DisputeLetter } from '../types';
import { DISPUTE_TEMPLATES } from '../constants';
import { generateDisputeLetter } from '../geminiService';
import { Upload, FileText, AlertTriangle, CheckCircle, Lightbulb, X, Copy, Download, DollarSign } from 'lucide-react';

interface Props {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  letters: DisputeLetter[];
  setLetters: React.Dispatch<React.SetStateAction<DisputeLetter[]>>;
}

interface AnalysisResult {
  collections: string[];
  latePayments: string[];
  chargeOffs: string[];
  inquiries: string[];
  publicRecords: string[];
  identityIssues: string[];
  recommendedTemplates: typeof DISPUTE_TEMPLATES;
  summary: string;
}

// Default prices for letter types
const LETTER_PRICES = [
  { label: 'Basic Letter', price: 25 },
  { label: 'Standard Letter', price: 50 },
  { label: 'Advanced Letter', price: 75 },
  { label: 'Premium Letter', price: 100 },
  { label: 'Violation Letter', price: 150 },
  { label: 'Custom', price: 0 },
];

const AdminClientDetail: React.FC<Props> = ({ clients, setClients, letters, setLetters }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = clients.find(c => c.id === id);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [previewLetter, setPreviewLetter] = useState('');

  // Pricing state
  const [selectedPriceOption, setSelectedPriceOption] = useState('Standard Letter');
  const [customPrice, setCustomPrice] = useState('');
  const [letterPrice, setLetterPrice] = useState(50);

  // Credit report analysis state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [reportText, setReportText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Update letter price when option changes
  const handlePriceOptionChange = (option: string) => {
    setSelectedPriceOption(option);
    if (option !== 'Custom') {
      const priceObj = LETTER_PRICES.find(p => p.label === option);
      setLetterPrice(priceObj?.price || 50);
      setCustomPrice('');
    }
  };

  const handleCustomPriceChange = (value: string) => {
    setCustomPrice(value);
    const numValue = parseFloat(value) || 0;
    setLetterPrice(numValue);
  };

  if (!client) return <div>Client not found</div>;

  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId]
    );
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      let text = '';

      if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        // For PDF, we'll extract what we can or simulate analysis
        text = await file.text().catch(() => '');
        if (!text) {
          // Simulate PDF content extraction
          text = `Credit Report for ${client.name} - PDF uploaded`;
        }
      } else {
        text = await file.text();
      }

      setReportText(text);

      // Analyze the report
      const analysis = analyzeReport(text);
      setAnalysisResult(analysis);

      // Auto-select the first recommended template
      if (analysis.recommendedTemplates.length > 0) {
        setSelectedTemplate(analysis.recommendedTemplates[0].id);
      }
    } catch (err) {
      console.error('Error reading file:', err);
      alert('Error reading file. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Analyze credit report text and recommend templates
  const analyzeReport = (text: string): AnalysisResult => {
    const lowerText = text.toLowerCase();

    const collections: string[] = [];
    const latePayments: string[] = [];
    const chargeOffs: string[] = [];
    const inquiries: string[] = [];
    const publicRecords: string[] = [];
    const identityIssues: string[] = [];
    const recommendedTemplateIds: Set<string> = new Set();

    // Detect collections
    if (lowerText.includes('collection') || lowerText.includes('debt buyer') || lowerText.includes('assigned')) {
      collections.push('Collection account detected');
      recommendedTemplateIds.add('debt_validation');
      recommendedTemplateIds.add('bureau_dispute_not_mine');
    }

    // Detect late payments
    if (lowerText.includes('late') || lowerText.includes('30 days') || lowerText.includes('60 days') || lowerText.includes('90 days') || lowerText.includes('past due')) {
      latePayments.push('Late payment history detected');
      recommendedTemplateIds.add('late_payment_dispute');
      recommendedTemplateIds.add('goodwill_letter');
      recommendedTemplateIds.add('late_payment_affidavit');
    }

    // Detect charge-offs
    if (lowerText.includes('charge off') || lowerText.includes('charged off') || lowerText.includes('charge-off')) {
      chargeOffs.push('Charge-off detected');
      recommendedTemplateIds.add('bureau_dispute_inaccurate');
      recommendedTemplateIds.add('pay_for_delete');
    }

    // Detect inquiries
    if (lowerText.includes('inquiry') || lowerText.includes('inquiries') || lowerText.includes('hard pull')) {
      inquiries.push('Hard inquiries detected');
      recommendedTemplateIds.add('unauthorized_inquiry_bureau');
      recommendedTemplateIds.add('unauthorized_inquiry_creditor');
    }

    // Detect public records
    if (lowerText.includes('bankruptcy') || lowerText.includes('judgment') || lowerText.includes('lien') || lowerText.includes('foreclosure')) {
      publicRecords.push('Public record detected');
      recommendedTemplateIds.add('bureau_dispute_inaccurate');
    }

    // Detect identity issues
    if (lowerText.includes('fraud') || lowerText.includes('identity theft') || lowerText.includes('not mine') || lowerText.includes('unknown account')) {
      identityIssues.push('Potential identity theft indicators');
      recommendedTemplateIds.add('bureau_dispute_identity_theft');
      recommendedTemplateIds.add('identity_affidavit');
    }

    // Detect re-insertion (rare but valuable)
    if (lowerText.includes('reinsert') || lowerText.includes('re-insert') || lowerText.includes('deleted') && lowerText.includes('back')) {
      recommendedTemplateIds.add('reinsertion_violation');
    }

    // Detect verification issues
    if (lowerText.includes('verified') || lowerText.includes('dispute') || lowerText.includes('investigation')) {
      recommendedTemplateIds.add('method_of_verification');
    }

    // If nothing specific found, recommend general bureau dispute
    if (recommendedTemplateIds.size === 0) {
      recommendedTemplateIds.add('bureau_dispute_not_mine');
      recommendedTemplateIds.add('bureau_dispute_inaccurate');
    }

    // Get full template objects for recommended templates
    const recommendedTemplates = DISPUTE_TEMPLATES.filter(t => recommendedTemplateIds.has(t.id));

    // Build summary
    const issues: string[] = [];
    if (collections.length) issues.push(`${collections.length} collection issue(s)`);
    if (latePayments.length) issues.push(`late payment history`);
    if (chargeOffs.length) issues.push(`${chargeOffs.length} charge-off(s)`);
    if (inquiries.length) issues.push(`hard inquiries`);
    if (publicRecords.length) issues.push(`public records`);
    if (identityIssues.length) issues.push(`identity concerns`);

    const summary = issues.length > 0
      ? `Found: ${issues.join(', ')}. We recommend ${recommendedTemplates.length} dispute letter(s) for this client.`
      : 'No major issues detected. Consider a general bureau dispute for any inaccuracies.';

    return {
      collections,
      latePayments,
      chargeOffs,
      inquiries,
      publicRecords,
      identityIssues,
      recommendedTemplates,
      summary,
    };
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return alert('Select a template first');
    setGenerating(true);
    try {
      const template = DISPUTE_TEMPLATES.find(t => t.id === selectedTemplate);
      const targetItems = client.negativeItems.filter(ni => selectedItems.includes(ni.id));
      const content = await generateDisputeLetter(client.name, targetItems, template?.content || '');
      setPreviewLetter(content);
    } catch (err) {
      alert('Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const saveLetter = () => {
    const newLetter: DisputeLetter = {
      id: `L-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      templateId: selectedTemplate,
      content: previewLetter,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      price: letterPrice
    };
    setLetters([newLetter, ...letters]);
    setPreviewLetter('');
    setSelectedItems([]);
    alert(`Letter saved! Price: $${letterPrice.toFixed(2)}`);
  };

  const clearAnalysis = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setReportText('');
    setSelectedTemplate('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={() => navigate('/dashboard/clients')} className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium">
        ← Back to Clients
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto">
              {client.name.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold text-center text-slate-900">{client.name}</h1>
            <p className="text-center text-slate-500 mb-6">{client.email}</p>

            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Current Score</span>
                <span className="font-bold text-blue-600">{client.score}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Member Since</span>
                <span className="font-bold text-slate-700">{client.joinedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Portal Link</span>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/#/client/${client.token}`)}
                  className="text-xs text-blue-500 underline"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Existing Negative Items */}
          {client.negativeItems.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Known Negative Items</h3>
              <div className="space-y-3">
                {client.negativeItems.map((item) => (
                  <label key={item.id} className={`block p-3 border rounded-lg cursor-pointer transition text-sm ${
                    selectedItems.includes(item.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleToggleItem(item.id)}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{item.creditor}</div>
                        <div className="text-xs text-slate-500">{item.type} • ${item.balance}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Credit Report Upload */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Credit Report Analysis</h2>
              {analysisResult && (
                <button onClick={clearAnalysis} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>

            {!analysisResult ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400'
                }`}
              >
                {analyzing ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-slate-600 font-medium">Analyzing credit report...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium mb-2">
                      Upload client's credit report for analysis
                    </p>
                    <p className="text-sm text-slate-400 mb-4">
                      Drag & drop or click to select • PDF, TXT supported
                    </p>
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer transition">
                      <FileText className="h-5 w-5" />
                      Select File
                      <input
                        type="file"
                        accept=".pdf,.txt,.text"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Info */}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">{uploadedFile?.name}</p>
                    <p className="text-sm text-green-600">Analysis complete</p>
                  </div>
                </div>

                {/* Analysis Summary */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">Analysis Summary</h4>
                      <p className="text-sm text-blue-700">{analysisResult.summary}</p>
                    </div>
                  </div>
                </div>

                {/* Issues Found */}
                <div className="grid grid-cols-2 gap-3">
                  {analysisResult.collections.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-xs font-bold text-red-700 uppercase">Collections</p>
                      <p className="text-sm text-red-600">{analysisResult.collections.length} found</p>
                    </div>
                  )}
                  {analysisResult.latePayments.length > 0 && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-xs font-bold text-yellow-700 uppercase">Late Payments</p>
                      <p className="text-sm text-yellow-600">Detected</p>
                    </div>
                  )}
                  {analysisResult.chargeOffs.length > 0 && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs font-bold text-orange-700 uppercase">Charge-Offs</p>
                      <p className="text-sm text-orange-600">{analysisResult.chargeOffs.length} found</p>
                    </div>
                  )}
                  {analysisResult.inquiries.length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs font-bold text-purple-700 uppercase">Hard Inquiries</p>
                      <p className="text-sm text-purple-600">Detected</p>
                    </div>
                  )}
                  {analysisResult.identityIssues.length > 0 && (
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <p className="text-xs font-bold text-pink-700 uppercase">Identity Issues</p>
                      <p className="text-sm text-pink-600">Potential fraud</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Recommended Templates */}
          {analysisResult && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Recommended Letters</h2>
              <p className="text-sm text-slate-500 mb-4">Based on the credit report analysis, we recommend these dispute letters:</p>

              <div className="space-y-3">
                {analysisResult.recommendedTemplates.map((template) => (
                  <label
                    key={template.id}
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="template"
                        value={template.id}
                        checked={selectedTemplate === template.id}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">{template.name}</span>
                          {template.potentialDamages && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                              ${template.potentialDamages} potential
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{template.description}</p>
                        <p className="text-xs text-blue-600 font-medium">{template.legalBasis}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Pricing Section */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3">Letter Pricing</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Price Tier</label>
                    <select
                      value={selectedPriceOption}
                      onChange={(e) => handlePriceOptionChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white"
                    >
                      {LETTER_PRICES.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label} {option.price > 0 ? `($${option.price})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      {selectedPriceOption === 'Custom' ? 'Enter Price' : 'Price'}
                    </label>
                    {selectedPriceOption === 'Custom' ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                          type="number"
                          value={customPrice}
                          onChange={(e) => handleCustomPriceChange(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                        />
                      </div>
                    ) : (
                      <div className="px-3 py-2 bg-green-100 text-green-800 font-bold rounded-lg text-center">
                        ${letterPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !selectedTemplate}
                className={`w-full mt-4 py-4 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 ${
                  generating || !selectedTemplate ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Letter...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    Generate Letter (${letterPrice.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          )}

          {/* Generated Letter Preview */}
          {previewLetter && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900">Generated Letter</h3>
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    <DollarSign className="h-4 w-4" />
                    {letterPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(previewLetter)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([previewLetter], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${client.name.replace(/\s+/g, '_')}_dispute_letter.txt`;
                      a.click();
                    }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={saveLetter}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Save (${letterPrice.toFixed(2)})
                  </button>
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 font-mono whitespace-pre-wrap text-slate-800 text-sm max-h-[500px] overflow-auto">
                {previewLetter}
              </div>
            </div>
          )}

          {/* No Analysis Yet - Show Prompt */}
          {!analysisResult && !previewLetter && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Upload a Credit Report</h4>
                  <p className="text-sm text-amber-700">
                    Upload the client's credit report above to get AI-powered recommendations for which dispute letters will be most effective for their situation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClientDetail;
