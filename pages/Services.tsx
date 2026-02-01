
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Search, TrendingUp, FileText, Users, ShieldCheck, CheckCircle, ArrowRight, Star, Clock, Mail } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Shield,
      color: "bg-blue-600",
      title: "Credit Report Disputes",
      description: "We challenge inaccurate, incomplete, or unverifiable information on your credit reports with all three major bureaus.",
      benefits: [
        "Thorough analysis of your credit reports",
        "Professional dispute letters on your behalf",
        "Track progress with every bureau",
        "Regular status updates",
      ],
    },
    {
      icon: AlertTriangle,
      color: "bg-orange-500",
      title: "Inquiry Removal",
      description: "Unauthorized hard inquiries can hurt your score. We help remove inquiries you didn't authorize.",
      benefits: [
        "Identify unauthorized inquiries",
        "Professional removal requests",
        "Protect against future issues",
        "Score improvement potential",
      ],
    },
    {
      icon: Search,
      color: "bg-green-600",
      title: "Credit Analysis",
      description: "Get a complete picture of what's affecting your credit and a prioritized action plan to address each issue.",
      benefits: [
        "Comprehensive report review",
        "Identify all negative items",
        "Prioritized improvement plan",
        "Expert recommendations",
      ],
    },
    {
      icon: TrendingUp,
      color: "bg-purple-600",
      title: "Credit Building",
      description: "Beyond disputes, we provide guidance on building positive credit history for long-term improvement.",
      benefits: [
        "Credit-building strategies",
        "Account recommendations",
        "Utilization optimization",
        "Score monitoring guidance",
      ],
    },
    {
      icon: FileText,
      color: "bg-teal-600",
      title: "Creditor Communications",
      description: "We communicate directly with creditors and collection agencies on your behalf to resolve reporting issues.",
      benefits: [
        "Professional correspondence",
        "Negotiate account updates",
        "Documentation support",
        "Follow-up management",
      ],
    },
    {
      icon: Users,
      color: "bg-pink-600",
      title: "Ongoing Support",
      description: "Credit repair is a journey. We provide dedicated support throughout your entire credit improvement process.",
      benefits: [
        "Dedicated credit specialist",
        "Regular check-ins",
        "Progress tracking",
        "Strategy adjustments",
      ],
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Hero */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Star className="h-4 w-4" />
            Three Level Credit
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-black tracking-tighter mb-6 leading-none">
            Our Credit Services
          </h1>
          <p className="text-xl text-slate-600">
            Three Level Credit provides comprehensive credit improvement services tailored to your unique situation. Our proven approach has helped hundreds of clients achieve their credit goals.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Your Rights Protected</h3>
              <p className="text-slate-300 text-sm">We leverage consumer protection laws to fight for accurate credit reporting.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Certified Mail</h3>
              <p className="text-slate-300 text-sm">All communications sent via certified mail with tracking for your records.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Timely Follow-Up</h3>
              <p className="text-slate-300 text-sm">We monitor deadlines and escalate when bureaus don't respond properly.</p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-slate-300 transition duration-300">
              <div className={`${service.color} p-4 rounded-2xl w-fit mb-6`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6">{service.description}</p>
              <ul className="space-y-3">
                {service.benefits.map((benefit, bIndex) => (
                  <li key={bIndex} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <h2 className="text-3xl font-black text-center mb-4">The Three Level Approach</h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">Our proven methodology for credit improvement</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { level: "1", title: "Analyze", desc: "We thoroughly review your credit reports from all three bureaus to identify every issue affecting your score.", color: "blue" },
              { level: "2", title: "Dispute", desc: "Our team prepares and sends professional dispute letters, tracking every communication and deadline.", color: "green" },
              { level: "3", title: "Elevate", desc: "We help you build positive credit history and maintain your improved credit score long-term.", color: "purple" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 bg-${item.color}-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6`}>
                  {item.level}
                </div>
                <h3 className="font-bold text-2xl mb-3">{item.title}</h3>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule your free consultation and learn how Three Level Credit can help you achieve your credit goals.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-yellow-400 text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-yellow-300 transition">
            Free Consultation
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
