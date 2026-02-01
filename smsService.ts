// SMS Service - Send text notifications to clients
// Supports Twilio (primary), or can be extended for other providers

export type SMSProvider = 'twilio' | 'vonage' | 'manual';

export interface SMSMessage {
  to: string;           // Phone number (E.164 format: +1XXXXXXXXXX)
  message: string;
  clientName?: string;
}

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Pre-built message templates
export const SMS_TEMPLATES = {
  letterSent: (clientName: string, bureau: string, trackingNumber?: string) => {
    const tracking = trackingNumber ? `\n\nTracking: ${trackingNumber}` : '';
    return `Hi ${clientName}, your dispute letter to ${bureau} has been sent via Certified Mail! You should receive a response within 30 days.${tracking}\n\n- Three Level of Credit`;
  },

  letterDelivered: (clientName: string, bureau: string, deadlineDate: string) => {
    return `Hi ${clientName}, great news! Your letter to ${bureau} was delivered. They must respond by ${deadlineDate}. We'll keep you updated!\n\n- Three Level of Credit`;
  },

  workingOnCase: (clientName: string, description: string) => {
    return `Hi ${clientName}, we're actively working on your case: ${description}. We'll notify you of any updates!\n\n- Three Level of Credit`;
  },

  responseReceived: (clientName: string, bureau: string, outcome: string) => {
    return `Hi ${clientName}, we received a response from ${bureau}: ${outcome}. Log into your account or contact us for details.\n\n- Three Level of Credit`;
  },

  deadlineReminder: (clientName: string, bureau: string, daysLeft: number) => {
    return `Hi ${clientName}, reminder: ${bureau} has ${daysLeft} days left to respond to your dispute. We're monitoring this for you.\n\n- Three Level of Credit`;
  },
};

// Format phone number to E.164
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // If it's 10 digits, assume US and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // If it's 11 digits starting with 1, add +
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  // Otherwise return as-is with + prefix if not present
  return digits.startsWith('+') ? digits : `+${digits}`;
}

// Validate phone number
export function isValidPhoneNumber(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // Basic E.164 validation: + followed by 10-15 digits
  return /^\+[1-9]\d{9,14}$/.test(formatted);
}

// Get API credentials from environment
const getCredentials = () => {
  if (typeof window !== 'undefined') {
    // Client-side: credentials should be handled by backend
    return { accountSid: '', authToken: '', fromNumber: '' };
  }

  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    fromNumber: process.env.TWILIO_PHONE_NUMBER || '',
  };
};

/**
 * Send an SMS message
 */
export async function sendSMS(message: SMSMessage): Promise<SMSResult> {
  const { accountSid, authToken, fromNumber } = getCredentials();

  // Validate phone number
  if (!isValidPhoneNumber(message.to)) {
    return {
      success: false,
      error: 'Invalid phone number format',
    };
  }

  const formattedTo = formatPhoneNumber(message.to);

  // If no credentials, simulate for demo/development
  if (!accountSid || !authToken || !fromNumber) {
    return simulateSMS(formattedTo, message.message);
  }

  try {
    // Twilio API call
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: formattedTo,
          From: fromNumber,
          Body: message.message,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send SMS');
    }

    const data = await response.json();

    return {
      success: true,
      messageId: data.sid,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Simulate SMS for demo/development
 */
function simulateSMS(to: string, message: string): SMSResult {
  console.log('📱 SMS Simulated:');
  console.log(`   To: ${to}`);
  console.log(`   Message: ${message}`);

  return {
    success: true,
    messageId: `SIM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
}

/**
 * Send letter sent notification
 */
export async function notifyLetterSent(
  clientPhone: string,
  clientName: string,
  bureau: string,
  trackingNumber?: string
): Promise<SMSResult> {
  const message = SMS_TEMPLATES.letterSent(clientName, bureau, trackingNumber);
  return sendSMS({ to: clientPhone, message, clientName });
}

/**
 * Send letter delivered notification
 */
export async function notifyLetterDelivered(
  clientPhone: string,
  clientName: string,
  bureau: string,
  deadlineDate: string
): Promise<SMSResult> {
  const formattedDeadline = new Date(deadlineDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const message = SMS_TEMPLATES.letterDelivered(clientName, bureau, formattedDeadline);
  return sendSMS({ to: clientPhone, message, clientName });
}

/**
 * Send working on case notification
 */
export async function notifyWorkingOnCase(
  clientPhone: string,
  clientName: string,
  description: string
): Promise<SMSResult> {
  const message = SMS_TEMPLATES.workingOnCase(clientName, description);
  return sendSMS({ to: clientPhone, message, clientName });
}

/**
 * Send response received notification
 */
export async function notifyResponseReceived(
  clientPhone: string,
  clientName: string,
  bureau: string,
  outcome: string
): Promise<SMSResult> {
  const message = SMS_TEMPLATES.responseReceived(clientName, bureau, outcome);
  return sendSMS({ to: clientPhone, message, clientName });
}

/**
 * Send deadline reminder notification
 */
export async function notifyDeadlineReminder(
  clientPhone: string,
  clientName: string,
  bureau: string,
  daysLeft: number
): Promise<SMSResult> {
  const message = SMS_TEMPLATES.deadlineReminder(clientName, bureau, daysLeft);
  return sendSMS({ to: clientPhone, message, clientName });
}
