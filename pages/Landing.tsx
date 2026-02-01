
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Search, FileText, Scale, ShieldCheck, ArrowRight, CheckCircle, Upload, Camera, X, Loader2, DollarSign, Clock, Mail } from 'lucide-react';

const Landing: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [showContactForm, setShowContactForm] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...droppedFiles].slice(0, 10));
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles].slice(0, 10));
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (files.length === 0) return;
    setShowContactForm(true);
  };

  const handleSubmitForAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      setShowContactForm(false);
    }, 2500);
  };
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6 z-10">
              <h1 className="text-5xl md:text-7xl font-black text-black leading-[0.95] tracking-tighter mb-8">
                Your Credit Score Is a Reflection of Your Credit Report...
                <span className="text-blue-600"> Let's Fix That.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                Professional credit repair services using legally-backed dispute letters. We cite the exact federal laws that protect your rights.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#analyzer" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition active:scale-95 shadow-xl shadow-blue-100 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Free Credit Analysis
                </a>
                <Link to="/contact" className="px-6 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition">
                  Get Started
                </Link>
              </div>
              <p className="mt-4 text-sm text-slate-500 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Upload your credit report and get a personalized action plan in minutes
              </p>
            </div>
            <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
              <div className="relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500 rounded-xl">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">8 Letter Types</h3>
                        <p className="text-slate-500">Professional dispute letters for every situation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500 rounded-xl">
                        <Scale className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Legally Backed</h3>
                        <p className="text-slate-500">Every letter cites FCRA & federal law</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-500 rounded-xl">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Certified Mail</h3>
                        <p className="text-slate-500">Proper documentation & tracking</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Federal Law Banner */}
      <section className="py-8 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
              <ShieldCheck className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Your rights are protected by federal law
              </h3>
              <p className="text-slate-600">
                The Fair Credit Reporting Act (FCRA) gives you the right to dispute inaccurate information.
                These letters cite the exact laws that protect you. Credit bureaus must investigate within 30 days or remove the item.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Report Analyzer - Lead Generation */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900" id="analyzer">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <DollarSign className="w-4 h-4" />
              Free Credit Analysis
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Upload Your Credit Report
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We'll analyze it and tell you <strong className="text-white">exactly</strong> which letters to send,
              in what order, to fix every negative item.
            </p>
          </div>

          {!showResults ? (
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {!showContactForm ? (
                <>
                  {/* Dropzone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      id="credit-report-upload"
                    />
                    <label htmlFor="credit-report-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                      <p className="text-slate-700 font-medium text-lg">
                        {isDragging ? 'Drop files here' : 'Drag & drop your credit report'}
                      </p>
                      <p className="text-slate-500 text-sm mt-2">
                        PDF or screenshots (PNG, JPG) • Up to 10 files
                      </p>
                      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                        Browse Files
                      </button>
                    </label>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <p className="text-sm font-medium text-slate-700">Files to analyze:</p>
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {file.type === 'application/pdf' ? (
                              <FileText className="w-5 h-5 text-red-500" />
                            ) : (
                              <Camera className="w-5 h-5 text-blue-500" />
                            )}
                            <span className="text-sm text-slate-700 truncate max-w-xs">{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Analyze Button */}
                  <button
                    onClick={handleAnalyze}
                    disabled={files.length === 0}
                    className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition ${
                      files.length > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Analyze My Credit Report
                  </button>

                  {/* What We Detect */}
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-3">What we detect:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-600">
                      {['Collections', 'Charge-offs', 'Late Payments', 'Hard Inquiries', 'Public Records', 'Judgments'].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 text-center mt-6">
                    🔒 Your credit report is processed securely and never shared.
                  </p>
                </>
              ) : (
                /* Contact Form */
                <form onSubmit={handleSubmitForAnalysis} className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Almost there!</h3>
                    <p className="text-slate-500">Enter your info to receive your personalized action plan</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Your Report...
                      </>
                    ) : (
                      'Get My Free Analysis'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="w-full py-2 text-slate-500 hover:text-slate-700 font-medium"
                  >
                    ← Back
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Results Preview */
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Analysis Complete!</h3>
                <p className="text-slate-500">We found items that can be addressed with our dispute letters</p>
              </div>

              {/* Sample Results */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl text-center">
                  <p className="text-3xl font-black text-red-600">3-5</p>
                  <p className="text-sm text-slate-600">Negative Items Found</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center">
                  <p className="text-3xl font-black text-blue-600">4-6</p>
                  <p className="text-sm text-slate-600">Letters Recommended</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center">
                  <p className="text-3xl font-black text-green-600">$1,000+</p>
                  <p className="text-sm text-slate-600">Potential Damages</p>
                </div>
              </div>

              {/* Sample Action Items */}
              <div className="space-y-3 mb-8">
                <h4 className="font-bold text-slate-900">Your Personalized Action Plan:</h4>
                {[
                  { priority: 1, title: 'Re-Insertion Violation', desc: 'Item came back without notice - $1,000 violation', color: 'green' },
                  { priority: 2, title: 'Collection Account Dispute', desc: 'Debt validation letter required', color: 'blue' },
                  { priority: 3, title: 'Late Payment Dispute', desc: 'Challenge unverifiable late reporting', color: 'yellow' },
                ].map((item) => (
                  <div key={item.priority} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`w-7 h-7 rounded-full bg-${item.color}-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                      {item.priority}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Next Step:</strong> One of our credit specialists will contact you within 24 hours to review your personalized action plan and discuss next steps.
                </p>
              </div>

              <Link
                to="/contact"
                className="block w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition text-center"
              >
                Schedule Your Free Consultation
              </Link>
            </div>
          )}

          {/* Don't have a report? */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 mb-2">Don't have your credit report?</p>
            <a
              href="https://www.annualcreditreport.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Get your free report at AnnualCreditReport.com →
            </a>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-black mb-1">8</h3>
              <p className="text-slate-600 font-medium">Letter Types</p>
            </div>
            <div className="bg-purple-50 p-8 rounded-[2rem] border border-purple-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-4">
                <Scale className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-black mb-1">FCRA</h3>
              <p className="text-slate-600 font-medium">Legal Citations</p>
            </div>
            <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-black mb-1">30</h3>
              <p className="text-slate-600 font-medium">Day Investigation</p>
            </div>
            <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-4">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-black mb-1">100%</h3>
              <p className="text-slate-600 font-medium">Certified Mail</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tight mb-4">Professional Dispute Letter Services</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">We provide 8 types of legally-backed dispute letters to address every credit repair situation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Bureau Dispute", desc: "FCRA § 1681i", color: "blue" },
              { icon: AlertTriangle, title: "Identity Theft", desc: "FCRA § 605(b)", color: "orange" },
              { icon: Search, title: "Verification", desc: "FCRA § 611(a)(7)", color: "pink" },
              { icon: FileText, title: "Creditor Dispute", desc: "FCRA § 1681s-2(b)", color: "blue" },
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition">
                <div className={`p-3 bg-${service.color}-500 rounded-xl w-fit mb-4`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1">{service.title}</h3>
                <p className="text-sm text-slate-500">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              View All 8 Services
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-black mb-4">Ready to Fix Your Credit?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get a free consultation and learn how our legally-backed dispute letters can help improve your credit report.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition">
              Get Your Free Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
