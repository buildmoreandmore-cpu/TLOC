
import React, { useState } from 'react';
import {
  Star, CreditCard, DollarSign, Home, Zap, TrendingUp,
  CheckCircle, ExternalLink, AlertTriangle, Users, Clock,
  ChevronDown, ChevronRight, BookOpen
} from 'lucide-react';

interface Partner {
  name: string;
  type: string;
  description: string;
  customerCost: string;
  estimatedPoints: string;
  timeToImpact: string;
  benefits: string[];
  affiliateUrl: string;
  featured?: boolean;
}

const CREDIT_BUILDING_PARTNERS: Partner[] = [
  // TRADELINES
  {
    name: 'Tradeline Supply Company',
    type: 'TRADELINE',
    description: 'Premium aged tradelines from major banks. 10-20 year old accounts with high limits.',
    customerCost: '$299-799',
    estimatedPoints: '+40-80 points',
    timeToImpact: '30-45 days',
    benefits: ['10+ year old accounts', 'High limits ($10K-50K)', 'Perfect payment history', 'Major banks (Chase, Amex, Citi)'],
    affiliateUrl: 'https://tradelinesupply.com',
    featured: true
  },
  {
    name: 'Superior Tradelines',
    type: 'TRADELINE',
    description: 'Affordable tradelines for credit building. Multiple price points available.',
    customerCost: '$199-599',
    estimatedPoints: '+30-60 points',
    timeToImpact: '30-45 days',
    benefits: ['5-15 year old accounts', 'Budget-friendly options', 'Reports to all 3 bureaus'],
    affiliateUrl: 'https://superiortradelines.com'
  },

  // SECURED CARDS
  {
    name: 'Discover it Secured',
    type: 'SECURED_CARD',
    description: 'Best secured card for building credit. Graduates to unsecured automatically.',
    customerCost: '$200 minimum deposit',
    estimatedPoints: '+20-40 points',
    timeToImpact: '3-6 months',
    benefits: ['2% cash back at restaurants & gas', 'No annual fee', 'Free FICO score', 'Auto-graduates to unsecured'],
    affiliateUrl: 'https://discover.com/credit-cards/secured/',
    featured: true
  },
  {
    name: 'Capital One Quicksilver Secured',
    type: 'SECURED_CARD',
    description: 'Earn unlimited rewards while building credit.',
    customerCost: '$200 minimum deposit',
    estimatedPoints: '+20-35 points',
    timeToImpact: '3-6 months',
    benefits: ['1.5% cash back on everything', 'No foreign transaction fees', 'Auto credit line increase'],
    affiliateUrl: 'https://capitalone.com/credit-cards/secured-mastercard/'
  },
  {
    name: 'Chime Secured Credit Builder',
    type: 'SECURED_CARD',
    description: 'No credit check, no annual fee. Use your own money.',
    customerCost: '$0 (use your own funds)',
    estimatedPoints: '+15-30 points',
    timeToImpact: '2-4 months',
    benefits: ['No credit check', 'No annual fee', 'No interest', 'Reports to all 3 bureaus'],
    affiliateUrl: 'https://chime.com/credit-builder'
  },

  // CREDIT BUILDER LOANS
  {
    name: 'Self Financial',
    type: 'CREDIT_BUILDER_LOAN',
    description: 'Build credit and savings simultaneously. Most popular credit builder.',
    customerCost: '$25-150/month',
    estimatedPoints: '+20-40 points',
    timeToImpact: '3-6 months',
    benefits: ['No credit check to apply', 'Build savings while building credit', 'Reports to all 3 bureaus', 'Low monthly payments'],
    affiliateUrl: 'https://self.inc',
    featured: true
  },
  {
    name: 'MoneyLion Credit Builder Plus',
    type: 'CREDIT_BUILDER_LOAN',
    description: 'Credit builder with 0% APR and instant access to funds.',
    customerCost: '$19.99/month membership',
    estimatedPoints: '+15-35 points',
    timeToImpact: '2-4 months',
    benefits: ['0% APR', 'Instant access to funds', 'Credit tracking included', 'Cash advances available'],
    affiliateUrl: 'https://moneylion.com'
  },

  // RENT REPORTING
  {
    name: 'Boom Pay',
    type: 'RENT_REPORTING',
    description: 'Report your rent payments to all 3 credit bureaus.',
    customerCost: '$2/month',
    estimatedPoints: '+10-25 points',
    timeToImpact: '1-2 months',
    benefits: ['Reports to all 3 bureaus', 'Add up to 24 months of past rent', 'Cancel anytime', 'Works with any landlord'],
    affiliateUrl: 'https://boompay.app',
    featured: true
  },
  {
    name: 'Rental Kharma',
    type: 'RENT_REPORTING',
    description: 'Turn rent into credit. Report current and past payments.',
    customerCost: '$25 setup + $8.95/month',
    estimatedPoints: '+10-20 points',
    timeToImpact: '1-2 months',
    benefits: ['Reports to TransUnion', 'Add past rent history', 'Verification included'],
    affiliateUrl: 'https://rentalkharma.com'
  },

  // UTILITY REPORTING
  {
    name: 'Experian Boost',
    type: 'UTILITY_REPORTING',
    description: 'Add phone, utilities, and streaming to your Experian report. Free.',
    customerCost: 'Free',
    estimatedPoints: '+5-15 points',
    timeToImpact: 'Instant',
    benefits: ['100% free', 'Instant results', 'Phone, utilities, Netflix, etc.', 'No risk - remove anytime'],
    affiliateUrl: 'https://experian.com/boost',
    featured: true
  }
];

const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bgColor: string; description: string }> = {
  TRADELINE: {
    icon: Star,
    label: 'Authorized User Tradelines',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Client is added as authorized user on someone else\'s old, high-limit credit card. Instantly adds years of history.'
  },
  SECURED_CARD: {
    icon: CreditCard,
    label: 'Secured Credit Cards',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Client deposits cash as collateral, gets a credit card. Builds payment history and credit mix.'
  },
  CREDIT_BUILDER_LOAN: {
    icon: DollarSign,
    label: 'Credit Builder Loans',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Client makes monthly payments into savings account. Adds installment loan to credit mix.'
  },
  RENT_REPORTING: {
    icon: Home,
    label: 'Rent Reporting Services',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Reports rent payments to credit bureaus. Easy way to add payment history without new debt.'
  },
  UTILITY_REPORTING: {
    icon: Zap,
    label: 'Utility & Bill Reporting',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    description: 'Free services that add phone, utility, and streaming payments to credit reports.'
  },
};

const AdminCreditBuilding: React.FC = () => {
  const [expandedType, setExpandedType] = useState<string | null>('TRADELINE');

  // Group partners by type
  const partnersByType = CREDIT_BUILDING_PARTNERS.reduce((acc, partner) => {
    if (!acc[partner.type]) acc[partner.type] = [];
    acc[partner.type].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Credit Building Guide</h1>
          <p className="text-slate-500 mt-1">Resources to recommend after credit repair is complete</p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 mb-1">Important: Complete Dispute Phase First</h3>
            <p className="text-amber-700 text-sm">
              Credit building works best AFTER removing negative items. Adding tradelines or new accounts
              while disputes are pending can complicate the process. Wait until the client's dispute phase
              is complete before recommending these products.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation Priority Guide */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          When to Recommend What
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <h4 className="font-bold text-red-800 mb-2">Thin File (0-2 accounts)</h4>
            <p className="text-sm text-red-700 mb-2">Client has very few accounts on their credit report.</p>
            <ul className="text-sm text-red-600 space-y-1">
              <li>1. Aged tradeline (instant history)</li>
              <li>2. Secured credit card (new revolving)</li>
              <li>3. Credit builder loan (adds mix)</li>
            </ul>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
            <h4 className="font-bold text-orange-800 mb-2">Young Credit (under 2 years avg age)</h4>
            <p className="text-sm text-orange-700 mb-2">Client has accounts but they're all new.</p>
            <ul className="text-sm text-orange-600 space-y-1">
              <li>1. Aged tradeline (10+ years old)</li>
              <li>2. Keep existing accounts open</li>
              <li>3. Avoid opening new accounts</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2">No Revolving Credit</h4>
            <p className="text-sm text-blue-700 mb-2">Client has no credit cards (only loans).</p>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>1. Secured credit card</li>
              <li>2. Authorized user tradeline</li>
              <li>3. Keep utilization under 10%</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 className="font-bold text-green-800 mb-2">No Installment Loans</h4>
            <p className="text-sm text-green-700 mb-2">Client has no loans (only credit cards).</p>
            <ul className="text-sm text-green-600 space-y-1">
              <li>1. Credit builder loan</li>
              <li>2. Rent reporting</li>
              <li>3. Improves credit mix score</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Free Option Highlight */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Free Option: Family Tradeline
        </h3>
        <p className="text-green-700 mb-4">
          If the client has a family member with an old credit card in good standing, they can be added as an
          authorized user for free. This is often the best option when available.
        </p>
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <p className="font-medium text-green-800 mb-2">Ideal card characteristics:</p>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-green-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>5+ years old (10+ is ideal)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>High limit ($5,000+)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Low utilization (under 10%)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Perfect payment history</span>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Categories */}
      <div className="space-y-4">
        {Object.entries(TYPE_CONFIG).map(([type, config]) => {
          const partners = partnersByType[type] || [];
          const isExpanded = expandedType === type;
          const Icon = config.icon;

          return (
            <div key={type} className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => setExpandedType(isExpanded ? null : type)}
                className={`w-full px-6 py-4 flex items-center justify-between ${config.bgColor} hover:opacity-90 transition`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-white rounded-lg`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-800">{config.label}</h3>
                    <p className="text-sm text-slate-600">{config.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">{partners.length} options</span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Partners Grid */}
              {isExpanded && (
                <div className="p-6 bg-white">
                  <div className="grid md:grid-cols-2 gap-4">
                    {partners.map((partner) => (
                      <div
                        key={partner.name}
                        className={`border rounded-xl p-5 ${partner.featured ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200'}`}
                      >
                        {partner.featured && (
                          <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded mb-3 inline-block">
                            RECOMMENDED
                          </span>
                        )}

                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-slate-800">{partner.name}</h4>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{partner.estimatedPoints}</p>
                            <p className="text-xs text-slate-500">{partner.timeToImpact}</p>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-3">{partner.description}</p>

                        {/* Benefits */}
                        <div className="space-y-1 mb-4">
                          {partner.benefits.slice(0, 3).map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>

                        {/* Cost */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div>
                            <p className="text-xs text-slate-500">Client Cost</p>
                            <p className="font-medium text-slate-800">{partner.customerCost}</p>
                          </div>
                          <a
                            href={partner.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            Learn More
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Revenue Potential */}
      <div className="mt-8 bg-slate-800 text-white rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          Affiliate Revenue Potential
        </h3>
        <p className="text-slate-300 mb-4">
          Many of these services offer affiliate programs. Here's typical commission potential per client:
        </p>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">$75-100</p>
            <p className="text-sm text-slate-400">Tradeline Referral</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">$35-50</p>
            <p className="text-sm text-slate-400">Secured Card</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">$25-30</p>
            <p className="text-sm text-slate-400">Credit Builder</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">$15-20</p>
            <p className="text-sm text-slate-400">Rent Reporting</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-4">
          A client using all recommendations could generate $150-200 in affiliate revenue on top of your service fees.
        </p>
      </div>
    </div>
  );
};

export default AdminCreditBuilding;
