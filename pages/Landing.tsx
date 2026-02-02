
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Search, FileText, Scale, ShieldCheck, ArrowRight, CheckCircle, Upload, Camera, X, Loader2, DollarSign, Users } from 'lucide-react';

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
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      setShowContactForm(false);
    }, 2500);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6 z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black leading-[0.95] tracking-tighter mb-4 sm:mb-6 lg:mb-8">
                Take Control of Your
                <span className="text-blue-600"> Credit Future.</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 lg:mb-10 max-w-xl leading-relaxed">
                Three Level Credit helps you understand, dispute, and improve your credit report through our proven three-level approach.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a href="#analyzer" className="px-5 sm:px-6 lg:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-bold text-base sm:text-lg hover:bg-blue-700 transition active:scale-95 shadow-xl shadow-blue-100 flex items-center justify-center gap-2">
                  <Upload className="h-5 w-5" />
                  Free Credit Analysis
                </a>
                <Link to="/contact" className="px-5 sm:px-6 py-3 sm:py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-50 transition text-center">
                  Get Started
                </Link>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-slate-500 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                Get your personalized credit improvement plan today
              </p>
            </div>
            <div className="lg:col-span-6 mt-10 lg:mt-0 relative">
              <div className="relative z-10">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-8 border border-slate-100">
                  <h3 className="font-black text-lg sm:text-xl mb-4 sm:mb-6 text-slate-900">The Three Level Approach</h3>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base sm:text-lg flex-shrink-0">1</div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg">Analyze</h3>
                        <p className="text-slate-500 text-sm sm:text-base">We identify every issue on your report</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-base sm:text-lg flex-shrink-0">2</div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg">Dispute</h3>
                        <p className="text-slate-500 text-sm sm:text-base">Professional letters sent on your behalf</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black text-base sm:text-lg flex-shrink-0">3</div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg">Elevate</h3>
                        <p className="text-slate-500 text-sm sm:text-base">Build and maintain better credit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-1 hidden lg:block"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-4 sm:py-8 -mt-8 sm:-mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-slate-900 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
              <span className="font-bold text-sm sm:text-base">Your Rights Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              <span className="font-bold text-sm sm:text-base">Certified Mail Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
              <span className="font-bold text-sm sm:text-base">Dedicated Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Report Analyzer */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900" id="analyzer">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <DollarSign className="w-4 h-4" />
              Free Credit Analysis
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">
              Upload Your Credit Report
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto">
              Get a personalized action plan showing exactly what's hurting your score and how to fix it.
            </p>
          </div>

          {!showResults ? (
            <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8">
              {!showContactForm ? (
                <>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-5 sm:p-8 text-center cursor-pointer transition-all ${
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
                      <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-slate-400 mb-3 sm:mb-4" />
                      <p className="text-slate-700 font-medium text-base sm:text-lg">
                        {isDragging ? 'Drop files here' : 'Drag & drop your credit report'}
                      </p>
                      <p className="text-slate-500 text-xs sm:text-sm mt-2">
                        PDF or screenshots (PNG, JPG) • Up to 10 files
                      </p>
                      <button className="mt-3 sm:mt-4 px-5 sm:px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm sm:text-base">
                        Browse Files
                      </button>
                    </label>
                  </div>

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

                  <button
                    onClick={handleAnalyze}
                    disabled={files.length === 0}
                    className={`w-full mt-5 sm:mt-6 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition ${
                      files.length > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Analyze My Credit Report
                  </button>

                  <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-2 sm:mb-3">We help with:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs sm:text-sm text-slate-600">
                      {['Collections', 'Late Payments', 'Charge-offs', 'Hard Inquiries', 'Inaccurate Info', 'Identity Issues'].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 text-center mt-6">
                    Your information is processed securely and never shared.
                  </p>
                </>
              ) : (
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
            <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Analysis Complete!</h3>
                <p className="text-sm sm:text-base text-slate-500">We found opportunities to improve your credit</p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl text-center">
                  <p className="text-xl sm:text-3xl font-black text-red-600">3-5</p>
                  <p className="text-xs sm:text-sm text-slate-600">Items to Address</p>
                </div>
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl text-center">
                  <p className="text-xl sm:text-3xl font-black text-blue-600">High</p>
                  <p className="text-xs sm:text-sm text-slate-600">Improvement Potential</p>
                </div>
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl text-center">
                  <p className="text-xl sm:text-3xl font-black text-green-600">60-90</p>
                  <p className="text-xs sm:text-sm text-slate-600">Days to See Results</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6">
                <p className="text-blue-800 text-xs sm:text-sm">
                  <strong>Next Step:</strong> One of our credit specialists will contact you within 24 hours to review your personalized action plan.
                </p>
              </div>

              <Link
                to="/contact"
                className="block w-full py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-bold text-base sm:text-lg hover:bg-blue-700 transition text-center"
              >
                Schedule Your Free Consultation
              </Link>
            </div>
          )}

          <div className="mt-8 sm:mt-10">
            <p className="text-slate-400 text-center mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide font-medium">Don't have your credit report? Get it here:</p>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <a
                href="https://www.annualcreditreport.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 sm:p-5 hover:bg-white/20 transition group"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded">FREE</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white transition" />
                </div>
                <h4 className="text-white font-bold text-base sm:text-lg mb-1">AnnualCreditReport.com</h4>
                <p className="text-slate-300 text-xs sm:text-sm">Official free credit report site</p>
              </a>

              <a
                href="https://www.identityiq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 sm:p-5 hover:bg-white/20 transition group"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <span className="text-xs font-bold bg-blue-500 text-white px-2 py-1 rounded">$1 TRIAL</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white transition" />
                </div>
                <h4 className="text-white font-bold text-base sm:text-lg mb-1">IdentityIQ</h4>
                <p className="text-slate-300 text-xs sm:text-sm">All 3 bureaus + scores instantly</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-blue-50 p-4 sm:p-8 rounded-xl sm:rounded-[2rem] border border-blue-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-2 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">500+</h3>
              <p className="text-slate-600 font-medium text-sm sm:text-base">Clients Helped</p>
            </div>
            <div className="bg-purple-50 p-4 sm:p-8 rounded-xl sm:rounded-[2rem] border border-purple-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-2 sm:mb-4">
                <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">3</h3>
              <p className="text-slate-600 font-medium text-sm sm:text-base">Level Approach</p>
            </div>
            <div className="bg-green-50 p-4 sm:p-8 rounded-xl sm:rounded-[2rem] border border-green-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-2 sm:mb-4">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">85%</h3>
              <p className="text-slate-600 font-medium text-sm sm:text-base">Success Rate</p>
            </div>
            <div className="bg-orange-50 p-4 sm:p-8 rounded-xl sm:rounded-[2rem] border border-orange-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-2 sm:mb-4">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">100%</h3>
              <p className="text-slate-600 font-medium text-sm sm:text-base">Certified Mail</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-10 sm:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 sm:mb-4">Our Credit Services</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto">Comprehensive solutions for every credit situation</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: Shield, title: "Credit Disputes", desc: "Challenge inaccurate items", color: "blue" },
              { icon: Search, title: "Report Analysis", desc: "Find hidden errors", color: "green" },
              { icon: FileText, title: "Professional Letters", desc: "Sent via certified mail", color: "purple" },
              { icon: TrendingUp, title: "Credit Building", desc: "Strategies for growth", color: "orange" },
            ].map((service, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 hover:shadow-lg transition">
                <div className={`p-2 sm:p-3 bg-${service.color}-500 rounded-lg sm:rounded-xl w-fit mb-3 sm:mb-4`}>
                  <service.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1">{service.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-sm sm:text-base">
              View All Services
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 sm:mb-4">Ready to Transform Your Credit?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join hundreds of clients who have improved their credit with Three Level Credit.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-base sm:text-lg hover:bg-yellow-300 transition">
              Get Your Free Consultation
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
