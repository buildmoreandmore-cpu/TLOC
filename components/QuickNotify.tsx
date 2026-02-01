import React, { useState } from 'react';
import { sendSMS, SMS_TEMPLATES, isValidPhoneNumber, formatPhoneNumber } from '../smsService';
import {
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';

interface Props {
  clientName: string;
  clientPhone?: string;
  onClose?: () => void;
  compact?: boolean;
}

type MessageType = 'working' | 'custom';

const QUICK_MESSAGES = [
  { id: 'working', label: 'Working on your case', template: 'workingOnCase' },
  { id: 'analyzing', label: 'Analyzing your report', description: 'analyzing your credit report and identifying dispute opportunities' },
  { id: 'preparing', label: 'Preparing letters', description: 'preparing your dispute letters' },
  { id: 'submitted', label: 'Letters submitted', description: 'your dispute letters have been submitted to the bureaus' },
];

const QuickNotify: React.FC<Props> = ({ clientName, clientPhone, onClose, compact = false }) => {
  const [phone, setPhone] = useState(clientPhone || '');
  const [selectedMessage, setSelectedMessage] = useState<string>('working');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(!compact);

  const handleSend = async () => {
    if (!phone || !isValidPhoneNumber(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setSending(true);
    setError(null);

    try {
      let message: string;

      if (selectedMessage === 'custom') {
        message = customMessage || `Hi ${clientName}, ${customMessage}\n\n- Three Level of Credit`;
      } else {
        const quickMsg = QUICK_MESSAGES.find(m => m.id === selectedMessage);
        const description = quickMsg?.description || 'working on your case';
        message = SMS_TEMPLATES.workingOnCase(clientName, description);
      }

      const result = await sendSMS({
        to: formatPhoneNumber(phone),
        message,
        clientName,
      });

      if (result.success) {
        setSent(true);
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Compact button mode
  if (compact && !showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
      >
        <MessageSquare className="h-4 w-4" />
        Notify Client
      </button>
    );
  }

  // Success state
  if (sent) {
    return (
      <div className={`${compact ? 'p-4' : 'p-6'} bg-green-50 border border-green-200 rounded-xl text-center`}>
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="font-medium text-green-800">Message sent to {clientName}!</p>
      </div>
    );
  }

  return (
    <div className={`bg-white ${compact ? 'p-4 border border-slate-200 rounded-xl shadow-lg' : ''}`}>
      {compact && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Quick Notify
          </h3>
          <button
            onClick={() => setShowForm(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {!compact && (
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Send Update to {clientName}</h3>
            <p className="text-sm text-slate-500">Quick text notification</p>
          </div>
        </div>
      )}

      {/* Phone input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(555) 123-4567"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Quick message options */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
        <div className="space-y-2">
          {QUICK_MESSAGES.map((msg) => (
            <label
              key={msg.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                selectedMessage === msg.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="message"
                value={msg.id}
                checked={selectedMessage === msg.id}
                onChange={(e) => setSelectedMessage(e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm font-medium text-slate-700">{msg.label}</span>
            </label>
          ))}
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
              selectedMessage === 'custom'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="message"
              value="custom"
              checked={selectedMessage === 'custom'}
              onChange={(e) => setSelectedMessage(e.target.value)}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-slate-700">Custom message</span>
          </label>
        </div>
      </div>

      {/* Custom message textarea */}
      {selectedMessage === 'custom' && (
        <div className="mb-4">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Type your message..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={sending || !phone}
        className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
          sending || !phone
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Text Message
          </>
        )}
      </button>
    </div>
  );
};

export default QuickNotify;
