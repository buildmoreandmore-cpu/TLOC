import React, { useState } from 'react';
import { DisputeLetter } from '../types';
import { BUREAU_ADDRESSES, getTemplateRequirements, canSendViaCloudMail } from '../constants';
import {
  sendCertifiedLetter,
  formatCost,
  getAvailableProviders,
  calculateDeadlineDate,
  MailProvider,
  RecipientAddress,
  SenderAddress,
} from '../mailService';
import { notifyLetterSent, isValidPhoneNumber } from '../smsService';
import {
  X,
  Mail,
  Download,
  Truck,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Loader2,
  DollarSign,
  MessageSquare,
  Phone,
} from 'lucide-react';
import DocumentChecklist from './DocumentChecklist';

interface Props {
  letter: DisputeLetter;
  onClose: () => void;
  onSendSuccess: (letterId: string, mailData: Partial<DisputeLetter>) => void;
  clientAddress?: SenderAddress;
  clientPhone?: string;
}

type ModalStep = 'options' | 'checklist' | 'sending' | 'success' | 'error';

const SendMailModal: React.FC<Props> = ({ letter, onClose, onSendSuccess, clientAddress, clientPhone }) => {
  const [step, setStep] = useState<ModalStep>('options');
  const [selectedProvider, setSelectedProvider] = useState<MailProvider>('lob');
  const [selectedBureau, setSelectedBureau] = useState<string>(letter.bureau || '');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    trackingNumber?: string;
    estimatedDelivery: string;
    deadlineDate: string;
    mailingId: string;
    cost: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checklistComplete, setChecklistComplete] = useState(false);

  // SMS notification state
  const [sendSmsNotification, setSendSmsNotification] = useState(!!clientPhone);
  const [smsPhone, setSmsPhone] = useState(clientPhone || '');
  const [smsSent, setSmsSent] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);

  const providers = getAvailableProviders();
  const templateRequirements = getTemplateRequirements(letter.templateId);
  const canUseCloudMail = canSendViaCloudMail(letter.templateId);
  const hasRequirements = templateRequirements && templateRequirements.requirements.length > 0;

  // Get recipient address based on selected bureau
  const getRecipientAddress = (): RecipientAddress | null => {
    const bureauKey = selectedBureau.toLowerCase() as keyof typeof BUREAU_ADDRESSES;
    const bureau = BUREAU_ADDRESSES[bureauKey];

    if (!bureau) return null;

    // Parse address
    const [city, stateZip] = bureau.cityStateZip.split(', ');
    const [state, zip] = stateZip.split(' ');

    return {
      name: bureau.name,
      address_line1: bureau.address,
      address_city: city,
      address_state: state,
      address_zip: zip,
    };
  };

  // Default sender address if not provided
  const defaultSenderAddress: SenderAddress = clientAddress || {
    name: letter.clientName,
    address_line1: '123 Client Street',
    address_city: 'Atlanta',
    address_state: 'GA',
    address_zip: '30301',
  };

  const handleSelectOption = (provider: MailProvider) => {
    setSelectedProvider(provider);

    if (provider === 'manual') {
      // Download directly
      handleDownload();
      return;
    }

    // Check if we need document checklist
    if (hasRequirements && canUseCloudMail) {
      setStep('checklist');
    } else if (!canUseCloudMail) {
      // Can't send via cloud mail
      setError('This letter requires notarization and cannot be sent via mail service. Please download and mail manually.');
      setStep('error');
    } else {
      // No checklist needed, proceed to send
      handleSend(provider);
    }
  };

  const handleChecklistComplete = () => {
    setChecklistComplete(true);
    handleSend(selectedProvider);
  };

  const handleSend = async (provider: MailProvider) => {
    if (!selectedBureau) {
      setError('Please select a bureau to send to.');
      setStep('error');
      return;
    }

    const recipientAddress = getRecipientAddress();
    if (!recipientAddress) {
      setError('Invalid bureau address.');
      setStep('error');
      return;
    }

    setStep('sending');
    setIsSending(true);

    try {
      const result = await sendCertifiedLetter(
        letter.content,
        recipientAddress,
        defaultSenderAddress,
        {
          certified: true,
          provider,
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to send letter');
      }

      const deadlineDate = calculateDeadlineDate(new Date().toISOString().split('T')[0]);

      setSendResult({
        trackingNumber: result.trackingNumber,
        estimatedDelivery: result.estimatedDelivery,
        deadlineDate,
        mailingId: result.mailingId,
        cost: result.cost,
      });

      // Send SMS notification if enabled
      if (sendSmsNotification && smsPhone && isValidPhoneNumber(smsPhone)) {
        try {
          const smsResult = await notifyLetterSent(
            smsPhone,
            letter.clientName,
            selectedBureau,
            result.trackingNumber
          );
          if (smsResult.success) {
            setSmsSent(true);
          } else {
            setSmsError(smsResult.error || 'Failed to send SMS');
          }
        } catch (smsErr) {
          setSmsError('Failed to send SMS notification');
        }
      }

      // Update letter with mail data
      onSendSuccess(letter.id, {
        status: 'processing',
        mailProvider: provider,
        mailingId: result.mailingId,
        trackingNumber: result.trackingNumber,
        estimatedDelivery: result.estimatedDelivery,
        deadlineDate,
        mailCost: result.cost,
        dateMailed: new Date().toISOString().split('T')[0],
        bureau: selectedBureau,
      });

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([letter.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${letter.clientName.replace(/\s+/g, '_')}_${letter.templateId}_${selectedBureau || 'letter'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleTrackingClick = () => {
    if (sendResult?.trackingNumber) {
      const trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${sendResult.trackingNumber.replace(/\s/g, '')}`;
      window.open(trackingUrl, '_blank');
    }
  };

  // Send SMS notification after the fact (for manual sends or retries)
  const handleSendSmsNow = async () => {
    if (!smsPhone || !isValidPhoneNumber(smsPhone)) {
      setSmsError('Please enter a valid phone number');
      return;
    }

    try {
      const smsResult = await notifyLetterSent(
        smsPhone,
        letter.clientName,
        selectedBureau,
        sendResult?.trackingNumber
      );
      if (smsResult.success) {
        setSmsSent(true);
        setSmsError(null);
      } else {
        setSmsError(smsResult.error || 'Failed to send SMS');
      }
    } catch (err) {
      setSmsError('Failed to send SMS notification');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {step === 'success' ? 'Letter Sent Successfully!' : `Send Letter to ${selectedBureau || 'Bureau'}`}
            </h2>
            {step === 'options' && (
              <p className="text-sm text-slate-500 mt-1">{letter.clientName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Bureau Selection (always show at top if not success) */}
          {step !== 'success' && step !== 'sending' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Bureau / Recipient
              </label>
              <select
                value={selectedBureau}
                onChange={(e) => setSelectedBureau(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select bureau...</option>
                <option value="Equifax">Equifax</option>
                <option value="Experian">Experian</option>
                <option value="TransUnion">TransUnion</option>
                <option value="Innovis">Innovis</option>
              </select>
            </div>
          )}

          {/* Options Step */}
          {step === 'options' && (
            <div className="space-y-4">
              {/* Certified Mail Option */}
              {canUseCloudMail && (
                <button
                  onClick={() => handleSelectOption('lob')}
                  disabled={!selectedBureau}
                  className={`w-full p-5 rounded-xl border-2 text-left transition ${
                    selectedBureau
                      ? 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                      : 'border-slate-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">Send Certified Mail</h3>
                        <span className="text-lg font-bold text-blue-600">
                          {formatCost(providers.find(p => p.provider === 'lob')?.certifiedCost || 499)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">via Lob</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          Tracking included
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Delivery confirmation
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* Cannot use cloud mail warning */}
              {!canUseCloudMail && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Notarization Required</p>
                      <p className="text-sm text-amber-700 mt-1">
                        This letter requires notarization and cannot be sent via mail service.
                        Please download, get it notarized, and mail manually.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Download Option */}
              <button
                onClick={() => handleSelectOption('manual')}
                className="w-full p-5 rounded-xl border-2 border-slate-200 text-left hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                    <Download className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Download & Mail Yourself</h3>
                      <span className="text-lg font-bold text-green-600">FREE</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Print and mail manually</p>
                  </div>
                </div>
              </button>

              {/* SMS Notification Option */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendSmsNotification}
                    onChange={(e) => setSendSmsNotification(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-slate-500" />
                      <span className="font-medium text-slate-700">Notify client via text</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Send SMS when letter is mailed
                    </p>
                  </div>
                </label>

                {sendSmsNotification && (
                  <div className="mt-3 ml-7">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {smsPhone && !isValidPhoneNumber(smsPhone) && (
                      <p className="text-xs text-red-500 mt-1 ml-6">Enter a valid phone number</p>
                    )}
                  </div>
                )}
              </div>

              {/* Provider comparison */}
              <div className="pt-4">
                <button
                  className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                  onClick={() => {/* Could expand to show more providers */}}
                >
                  <DollarSign className="h-4 w-4" />
                  Compare mail providers
                </button>
              </div>
            </div>
          )}

          {/* Checklist Step */}
          {step === 'checklist' && templateRequirements && (
            <DocumentChecklist
              templateId={letter.templateId}
              onComplete={handleChecklistComplete}
              onCancel={() => setStep('options')}
            />
          )}

          {/* Sending Step */}
          {step === 'sending' && (
            <div className="py-12 text-center">
              <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin mb-4" />
              <p className="text-lg font-medium text-slate-900">Sending your letter...</p>
              <p className="text-sm text-slate-500 mt-2">This may take a moment</p>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && sendResult && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3 mb-6">
                {sendResult.trackingNumber && (
                  <div>
                    <span className="text-sm text-slate-500">Tracking Number:</span>
                    <p className="font-mono font-bold text-slate-900">{sendResult.trackingNumber}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-slate-500">Expected Delivery:</span>
                  <p className="font-bold text-slate-900">
                    {new Date(sendResult.estimatedDelivery).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Response Deadline (30 days):</span>
                  <p className="font-bold text-orange-600">
                    {new Date(sendResult.deadlineDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Cost:</span>
                  <p className="font-bold text-slate-900">{formatCost(sendResult.cost)}</p>
                </div>
              </div>

              {/* SMS Notification Status */}
              {sendSmsNotification && (
                <div className={`mb-4 p-3 rounded-lg ${smsSent ? 'bg-green-50 border border-green-200' : smsError ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <MessageSquare className={`h-4 w-4 ${smsSent ? 'text-green-600' : smsError ? 'text-red-600' : 'text-slate-500'}`} />
                    {smsSent ? (
                      <span className="text-sm font-medium text-green-700">Client notified via text</span>
                    ) : smsError ? (
                      <div className="flex-1">
                        <span className="text-sm font-medium text-red-700">{smsError}</span>
                        <button
                          onClick={handleSendSmsNow}
                          className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-600">SMS notification pending</span>
                    )}
                  </div>
                </div>
              )}

              {/* Send SMS Now option if not already sent */}
              {!sendSmsNotification && !smsSent && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Notify client?</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={smsPhone}
                      onChange={(e) => setSmsPhone(e.target.value)}
                      placeholder="Phone number"
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                    <button
                      onClick={handleSendSmsNow}
                      disabled={!smsPhone || !isValidPhoneNumber(smsPhone)}
                      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                    >
                      Send Text
                    </button>
                  </div>
                  {smsError && <p className="text-xs text-red-500 mt-1">{smsError}</p>}
                </div>
              )}

              <div className="flex gap-3">
                {sendResult.trackingNumber && (
                  <button
                    onClick={handleTrackingClick}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Tracking
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-lg font-medium text-slate-900 mb-2">Unable to Send</p>
              <p className="text-sm text-slate-500 mb-6">{error}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setError(null);
                    setStep('options');
                  }}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Try Again
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Instead
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'options' && (
          <div className="px-6 py-4 bg-slate-50 rounded-b-2xl border-t">
            <p className="text-xs text-slate-500 text-center">
              Certified mail provides proof of delivery for your records
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMailModal;
