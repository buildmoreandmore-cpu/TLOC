
import React, { useState, useMemo } from 'react';
import { DisputeLetter, Client } from '../types';
import { DISPUTE_TEMPLATES } from '../constants';
import { getDaysUntilDeadline, formatCost, trackMailingStatus } from '../mailService';
import SendMailModal from '../components/SendMailModal';
import {
  FileCheck,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Stamp,
  Send,
  Eye,
  Download,
  Copy,
  X,
  ChevronRight,
  Filter,
  Truck,
  Package,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface Props {
  letters: DisputeLetter[];
  setLetters?: React.Dispatch<React.SetStateAction<DisputeLetter[]>>;
  clients?: Client[];
}

type WorkflowStatus = 'needs_notary' | 'ready_to_mail' | 'processing' | 'in_transit' | 'delivered' | 'awaiting_response' | 'response_received' | 'completed' | 'all';

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode; description: string }> = {
  needs_notary: {
    label: 'Needs Notarization',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
    icon: <Stamp className="h-5 w-5" />,
    description: 'Affidavits that require notarization before mailing'
  },
  ready_to_mail: {
    label: 'Ready to Mail',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    icon: <Mail className="h-5 w-5" />,
    description: 'Letters ready to be sent via certified mail'
  },
  processing: {
    label: 'Processing',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 border-indigo-200',
    icon: <Package className="h-5 w-5" />,
    description: 'Letter submitted to mail provider'
  },
  in_transit: {
    label: 'In Transit',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50 border-cyan-200',
    icon: <Truck className="h-5 w-5" />,
    description: 'Letter is being delivered by USPS'
  },
  delivered: {
    label: 'Delivered',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50 border-teal-200',
    icon: <CheckCircle className="h-5 w-5" />,
    description: 'Letter delivered, awaiting response'
  },
  mailed: {
    label: 'Mailed',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50 border-cyan-200',
    icon: <Send className="h-5 w-5" />,
    description: 'Letters that have been mailed'
  },
  awaiting_response: {
    label: 'Awaiting Response',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
    icon: <Clock className="h-5 w-5" />,
    description: 'Waiting for bureau/creditor response (30 days)'
  },
  response_received: {
    label: 'Response Received',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
    icon: <AlertCircle className="h-5 w-5" />,
    description: 'Responses that need review'
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    icon: <CheckCircle className="h-5 w-5" />,
    description: 'Successfully resolved disputes'
  },
  draft: {
    label: 'Draft',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 border-slate-200',
    icon: <FileCheck className="h-5 w-5" />,
    description: 'Letters in progress'
  },
  sent: {
    label: 'Sent',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    icon: <Send className="h-5 w-5" />,
    description: 'Legacy sent status'
  },
};

// Templates that require notarization
const NOTARY_REQUIRED_TEMPLATES = ['identity_affidavit', 'late_payment_affidavit'];

// Deadline warning thresholds
const DEADLINE_WARNING_DAYS = 5;
const DEADLINE_URGENT_DAYS = 2;

const AdminLetters: React.FC<Props> = ({ letters, setLetters, clients }) => {
  // Helper to get client phone
  const getClientPhone = (clientId: string): string | undefined => {
    return clients?.find(c => c.id === clientId)?.phone;
  };
  const [activeFilter, setActiveFilter] = useState<WorkflowStatus>('all');
  const [selectedLetter, setSelectedLetter] = useState<DisputeLetter | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [refreshingTracking, setRefreshingTracking] = useState<string | null>(null);

  // Determine effective status based on template type
  const getEffectiveStatus = (letter: DisputeLetter): string => {
    // If it's a notary-required template and still draft, show as needs_notary
    if (letter.status === 'draft' && NOTARY_REQUIRED_TEMPLATES.includes(letter.templateId)) {
      return 'needs_notary';
    }
    // If draft and not notary required, show as ready_to_mail
    if (letter.status === 'draft') {
      return 'ready_to_mail';
    }
    // Map sent to awaiting_response for better workflow
    if (letter.status === 'sent') {
      return 'awaiting_response';
    }
    // Keep delivered as awaiting_response for counting purposes
    if (letter.status === 'delivered') {
      return 'awaiting_response';
    }
    return letter.status;
  };

  // Count letters by status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      needs_notary: 0,
      ready_to_mail: 0,
      processing: 0,
      in_transit: 0,
      awaiting_response: 0,
      response_received: 0,
      completed: 0,
    };

    letters.forEach(letter => {
      const status = getEffectiveStatus(letter);
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return counts;
  }, [letters]);

  // Filter letters
  const filteredLetters = useMemo(() => {
    if (activeFilter === 'all') return letters;
    return letters.filter(letter => {
      const effectiveStatus = getEffectiveStatus(letter);
      // Include processing and in_transit when filtering by awaiting_response
      if (activeFilter === 'awaiting_response') {
        return ['awaiting_response', 'delivered', 'processing', 'in_transit'].includes(effectiveStatus) ||
               ['awaiting_response', 'delivered', 'processing', 'in_transit'].includes(letter.status);
      }
      return effectiveStatus === activeFilter || letter.status === activeFilter;
    });
  }, [letters, activeFilter]);

  // Get template name
  const getTemplateName = (templateId: string) => {
    const template = DISPUTE_TEMPLATES.find(t => t.id === templateId);
    return template?.name || templateId;
  };

  // Update letter status
  const updateLetterStatus = (letterId: string, newStatus: string, additionalData?: Partial<DisputeLetter>) => {
    if (!setLetters) return;
    setLetters(prev => prev.map(letter =>
      letter.id === letterId
        ? { ...letter, status: newStatus as DisputeLetter['status'], ...additionalData }
        : letter
    ));
    setShowUpdateModal(false);
    setSelectedLetter(null);
  };

  // Handle send success from SendMailModal
  const handleSendSuccess = (letterId: string, mailData: Partial<DisputeLetter>) => {
    if (!setLetters) return;
    setLetters(prev => prev.map(letter =>
      letter.id === letterId
        ? { ...letter, ...mailData }
        : letter
    ));
    setShowSendModal(false);
  };

  // Refresh tracking status
  const refreshTracking = async (letter: DisputeLetter) => {
    if (!letter.mailingId || !letter.mailProvider || !setLetters) return;

    setRefreshingTracking(letter.id);
    try {
      const trackingResult = await trackMailingStatus(letter.mailingId, letter.mailProvider);

      setLetters(prev => prev.map(l =>
        l.id === letter.id
          ? {
              ...l,
              status: trackingResult.status as DisputeLetter['status'],
              providerStatus: trackingResult.status,
              actualDelivery: trackingResult.deliveryDate,
            }
          : l
      ));
    } catch (error) {
      console.error('Failed to refresh tracking:', error);
    } finally {
      setRefreshingTracking(null);
    }
  };

  // Get deadline info
  const getDeadlineInfo = (letter: DisputeLetter) => {
    if (!letter.deadlineDate) return null;

    const daysLeft = getDaysUntilDeadline(letter.deadlineDate);
    const isUrgent = daysLeft <= DEADLINE_URGENT_DAYS;
    const isWarning = daysLeft <= DEADLINE_WARNING_DAYS;
    const isPastDue = daysLeft < 0;

    return {
      daysLeft,
      isUrgent,
      isWarning,
      isPastDue,
      formattedDate: new Date(letter.deadlineDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    };
  };

  // Quick actions based on current status
  const getQuickActions = (letter: DisputeLetter) => {
    const effectiveStatus = getEffectiveStatus(letter);

    switch (effectiveStatus) {
      case 'needs_notary':
        return [
          { label: 'Mark Notarized', action: () => updateLetterStatus(letter.id, 'ready_to_mail'), primary: true },
        ];
      case 'ready_to_mail':
        return [
          {
            label: 'Send Letter',
            action: () => {
              setSelectedLetter(letter);
              setShowSendModal(true);
            },
            primary: true
          },
        ];
      case 'processing':
      case 'in_transit':
        return [
          {
            label: 'Refresh Status',
            action: () => refreshTracking(letter),
            primary: false,
            loading: refreshingTracking === letter.id
          },
        ];
      case 'delivered':
      case 'mailed':
      case 'awaiting_response':
        return [
          { label: 'Log Response', action: () => { setSelectedLetter(letter); setShowUpdateModal(true); }, primary: true },
        ];
      case 'response_received':
        return [
          { label: 'Mark Completed', action: () => updateLetterStatus(letter.id, 'completed'), primary: true },
          { label: 'Send Follow-up', action: () => {}, primary: false },
        ];
      default:
        return [];
    }
  };

  // Render tracking badge
  const renderTrackingBadge = (letter: DisputeLetter) => {
    const status = letter.status;
    const deadlineInfo = getDeadlineInfo(letter);

    if (status === 'processing') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
          <Package className="h-3 w-3" />
          Processing
        </span>
      );
    }

    if (status === 'in_transit') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium animate-pulse">
          <Truck className="h-3 w-3" />
          In Transit
        </span>
      );
    }

    if (status === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
          <CheckCircle className="h-3 w-3" />
          Delivered
        </span>
      );
    }

    return null;
  };

  // Render deadline countdown
  const renderDeadlineCountdown = (letter: DisputeLetter) => {
    const deadlineInfo = getDeadlineInfo(letter);
    if (!deadlineInfo) return null;

    const { daysLeft, isUrgent, isWarning, isPastDue, formattedDate } = deadlineInfo;

    if (isPastDue) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-bold">Past Due by {Math.abs(daysLeft)} days</span>
        </div>
      );
    }

    if (isUrgent) {
      return (
        <div className="flex items-center gap-1 text-red-600 animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-bold">{daysLeft} days left!</span>
        </div>
      );
    }

    if (isWarning) {
      return (
        <div className="flex items-center gap-1 text-amber-600">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-medium">{daysLeft} days until {formattedDate}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 text-slate-500">
        <Clock className="h-4 w-4" />
        <span className="text-xs">{daysLeft} days until deadline</span>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Document Action Center</h1>
          <p className="text-slate-500 mt-1">Track and manage your dispute letters workflow</p>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {Object.entries(STATUS_CONFIG).filter(([key]) =>
          ['needs_notary', 'ready_to_mail', 'processing', 'in_transit', 'awaiting_response', 'response_received', 'completed'].includes(key)
        ).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key as WorkflowStatus)}
            className={`p-4 rounded-xl border-2 transition text-left ${
              activeFilter === key
                ? `${config.bgColor} border-current ${config.color}`
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`mb-2 ${activeFilter === key ? config.color : 'text-slate-400'}`}>
              {config.icon}
            </div>
            <div className={`text-2xl font-bold ${activeFilter === key ? config.color : 'text-slate-900'}`}>
              {statusCounts[key] || 0}
            </div>
            <div className={`text-xs font-medium ${activeFilter === key ? config.color : 'text-slate-500'}`}>
              {config.label}
            </div>
          </button>
        ))}
      </div>

      {/* Filter indicator */}
      {activeFilter !== 'all' && (
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-600">
            Showing: <strong>{STATUS_CONFIG[activeFilter]?.label}</strong>
          </span>
          <button
            onClick={() => setActiveFilter('all')}
            className="text-sm text-blue-600 hover:text-blue-700 ml-2"
          >
            Show all
          </button>
        </div>
      )}

      {/* Letters List */}
      <div className="space-y-4">
        {filteredLetters.map((letter) => {
          const effectiveStatus = getEffectiveStatus(letter);
          const config = STATUS_CONFIG[letter.status] || STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.draft;
          const actions = getQuickActions(letter);
          const deadlineInfo = getDeadlineInfo(letter);

          return (
            <div
              key={letter.id}
              className={`bg-white rounded-xl border-2 overflow-hidden ${
                deadlineInfo?.isUrgent ? 'border-red-300' : deadlineInfo?.isWarning ? 'border-amber-300' : config.bgColor
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${config.bgColor} ${config.color}`}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{letter.clientName}</h3>
                      <p className="text-sm text-slate-500">{getTemplateName(letter.templateId)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {renderTrackingBadge(letter)}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${config.bgColor} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Created: {letter.createdAt}</p>
                  </div>
                </div>

                {/* Letter Preview */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 relative max-h-24 overflow-hidden">
                  <p className="text-xs text-slate-600 font-mono whitespace-pre-wrap">
                    {letter.content.substring(0, 200)}...
                  </p>
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-50 to-transparent"></div>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  {letter.bureau && (
                    <div>
                      <span className="text-slate-400">Bureau:</span>
                      <span className="ml-1 font-medium text-slate-700">{letter.bureau}</span>
                    </div>
                  )}
                  {letter.dateMailed && (
                    <div>
                      <span className="text-slate-400">Mailed:</span>
                      <span className="ml-1 font-medium text-slate-700">{letter.dateMailed}</span>
                    </div>
                  )}
                  {letter.trackingNumber && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Tracking:</span>
                      <a
                        href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${letter.trackingNumber.replace(/\s/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        {letter.trackingNumber}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {letter.mailCost && (
                    <div>
                      <span className="text-slate-400">Cost:</span>
                      <span className="ml-1 font-medium text-slate-700">{formatCost(letter.mailCost)}</span>
                    </div>
                  )}
                  {letter.estimatedDelivery && !letter.actualDelivery && (
                    <div>
                      <span className="text-slate-400">Est. Delivery:</span>
                      <span className="ml-1 font-medium text-slate-700">
                        {new Date(letter.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {letter.actualDelivery && (
                    <div>
                      <span className="text-slate-400">Delivered:</span>
                      <span className="ml-1 font-medium text-green-600">
                        {new Date(letter.actualDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Deadline countdown */}
                {deadlineInfo && (
                  <div className="mb-4">
                    {renderDeadlineCountdown(letter)}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedLetter(letter); setShowSendModal(false); setShowUpdateModal(false); }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(letter.content)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([letter.content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${letter.clientName.replace(/\s+/g, '_')}_${letter.templateId}.txt`;
                      a.click();
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>

                  <div className="flex-1"></div>

                  {actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.action}
                      disabled={'loading' in action && action.loading}
                      className={`px-4 py-2 text-sm font-bold rounded-lg transition flex items-center gap-2 ${
                        action.primary
                          ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {'loading' in action && action.loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : null}
                      {action.label}
                      {!('loading' in action && action.loading) && <ChevronRight className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {filteredLetters.length === 0 && (
          <div className="py-20 text-center bg-white border-2 border-dashed border-slate-300 rounded-2xl">
            <FileCheck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              {activeFilter === 'all'
                ? 'No letters have been generated yet.'
                : `No letters ${STATUS_CONFIG[activeFilter]?.label.toLowerCase() || 'in this status'}.`}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Generate letters from the client detail page.
            </p>
          </div>
        )}
      </div>

      {/* View Letter Modal */}
      {selectedLetter && !showUpdateModal && !showSendModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedLetter.clientName}</h2>
                <p className="text-sm text-slate-500">{getTemplateName(selectedLetter.templateId)}</p>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 bg-slate-50 p-6 rounded-lg border border-slate-200">
                {selectedLetter.content}
              </pre>
            </div>
            <div className="flex items-center justify-between gap-3 p-6 border-t bg-slate-50 rounded-b-2xl">
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(selectedLetter.content)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-white transition flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([selectedLetter.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedLetter.clientName.replace(/\s+/g, '_')}_letter.txt`;
                    a.click();
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-white transition flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
              {getEffectiveStatus(selectedLetter) === 'ready_to_mail' ? (
                <button
                  onClick={() => setShowSendModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Letter
                </button>
              ) : (
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  Update Status
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Send Mail Modal */}
      {selectedLetter && showSendModal && (
        <SendMailModal
          letter={selectedLetter}
          onClose={() => {
            setShowSendModal(false);
            setSelectedLetter(null);
          }}
          onSendSuccess={handleSendSuccess}
          clientPhone={getClientPhone(selectedLetter.clientId)}
        />
      )}

      {/* Update Status Modal */}
      {selectedLetter && showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900">Update Status</h2>
              <button
                onClick={() => { setShowUpdateModal(false); setSelectedLetter(null); }}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Update the status for <strong>{selectedLetter.clientName}</strong>'s letter.
              </p>

              {/* Status Options */}
              <div className="space-y-2">
                {getEffectiveStatus(selectedLetter) === 'ready_to_mail' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bureau</label>
                      <select
                        id="bureau-select"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        defaultValue={selectedLetter.bureau || ""}
                      >
                        <option value="">Select bureau...</option>
                        <option value="Equifax">Equifax</option>
                        <option value="Experian">Experian</option>
                        <option value="TransUnion">TransUnion</option>
                        <option value="Innovis">Innovis</option>
                        <option value="Creditor">Direct to Creditor</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number</label>
                      <input
                        type="text"
                        id="tracking-input"
                        placeholder="9407 3000 0000 0000 0000 00"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const bureau = (document.getElementById('bureau-select') as HTMLSelectElement)?.value;
                        const tracking = (document.getElementById('tracking-input') as HTMLInputElement)?.value;
                        updateLetterStatus(selectedLetter.id, 'awaiting_response', {
                          bureau,
                          trackingNumber: tracking,
                          dateMailed: new Date().toISOString().split('T')[0],
                        });
                      }}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                    >
                      Mark as Mailed
                    </button>
                  </>
                )}

                {(getEffectiveStatus(selectedLetter) === 'awaiting_response' ||
                  getEffectiveStatus(selectedLetter) === 'mailed' ||
                  selectedLetter.status === 'delivered' ||
                  selectedLetter.status === 'processing' ||
                  selectedLetter.status === 'in_transit') && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Response Outcome</label>
                      <select
                        id="outcome-select"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        defaultValue=""
                      >
                        <option value="">Select outcome...</option>
                        <option value="deleted">Item Deleted</option>
                        <option value="updated">Information Updated</option>
                        <option value="verified">Verified (No Change)</option>
                        <option value="pending">No Response Yet</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                      <textarea
                        id="notes-input"
                        placeholder="Add any notes about the response..."
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        rows={3}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const outcome = (document.getElementById('outcome-select') as HTMLSelectElement)?.value;
                        const notes = (document.getElementById('notes-input') as HTMLTextAreaElement)?.value;
                        updateLetterStatus(selectedLetter.id, outcome === 'deleted' ? 'completed' : 'response_received', {
                          responseOutcome: outcome as DisputeLetter['responseOutcome'],
                          responseDate: new Date().toISOString().split('T')[0],
                          notes,
                        });
                      }}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                    >
                      Log Response
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLetters;
