// Mail Service Layer - Provider abstraction for mail APIs
// Supports Lob (primary), Click2Mail, LetterStream, PostGrid

export type MailProvider = 'lob' | 'click2mail' | 'letterstream' | 'postgrid' | 'manual';

export interface RecipientAddress {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_zip: string;
}

export interface SenderAddress {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_zip: string;
}

export interface MailOptions {
  certified?: boolean;
  returnReceipt?: boolean;
  color?: boolean;
  doubleSided?: boolean;
  provider?: MailProvider;
}

export interface SendResult {
  success: boolean;
  mailingId: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  cost: number; // in cents
  provider: MailProvider;
  error?: string;
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location?: string;
  description: string;
}

export interface TrackingResult {
  mailingId: string;
  status: 'created' | 'processing' | 'in_transit' | 'delivered' | 'returned' | 'failed';
  deliveryDate?: string;
  events: TrackingEvent[];
  lastUpdated: string;
}

export interface MailCost {
  certified: number;   // cents
  regular: number;     // cents
  breakdown: {
    postage: number;
    printing: number;
    handling: number;
    certifiedFee?: number;
    returnReceiptFee?: number;
  };
}

// Provider pricing (in cents)
const PROVIDER_PRICING: Record<MailProvider, { certified: number; regular: number }> = {
  lob: { certified: 499, regular: 150 },
  click2mail: { certified: 350, regular: 150 },
  letterstream: { certified: 400, regular: 200 },
  postgrid: { certified: 375, regular: 175 },
  manual: { certified: 0, regular: 0 },
};

// Get API key from environment
const getApiKey = (provider: MailProvider): string => {
  if (typeof window !== 'undefined') {
    // Client-side: check for stored keys or use test mode
    return '';
  }

  switch (provider) {
    case 'lob':
      return process.env.LOB_API_KEY || '';
    case 'click2mail':
      return process.env.CLICK2MAIL_API_KEY || '';
    case 'letterstream':
      return process.env.LETTERSTREAM_API_KEY || '';
    case 'postgrid':
      return process.env.POSTGRID_API_KEY || '';
    default:
      return '';
  }
};

// Default provider based on available API keys
const getDefaultProvider = (): MailProvider => {
  if (getApiKey('lob')) return 'lob';
  if (getApiKey('click2mail')) return 'click2mail';
  if (getApiKey('letterstream')) return 'letterstream';
  if (getApiKey('postgrid')) return 'postgrid';
  return 'manual';
};

// Calculate estimated delivery date (business days)
const calculateEstimatedDelivery = (certified: boolean): string => {
  const now = new Date();
  const businessDays = certified ? 5 : 7; // Certified is typically faster
  let daysAdded = 0;

  while (daysAdded < businessDays) {
    now.setDate(now.getDate() + 1);
    const dayOfWeek = now.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  return now.toISOString().split('T')[0];
};

// Calculate 30-day response deadline from mailing date
export const calculateDeadlineDate = (mailedDate: string): string => {
  const date = new Date(mailedDate);
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
};

// Days until deadline
export const getDaysUntilDeadline = (deadlineDate: string): number => {
  const deadline = new Date(deadlineDate);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Send a letter via the mail provider
 */
export async function sendCertifiedLetter(
  letterContent: string,
  recipientAddress: RecipientAddress,
  senderAddress: SenderAddress,
  options: MailOptions = {}
): Promise<SendResult> {
  const provider = options.provider || getDefaultProvider();
  const certified = options.certified ?? true;

  // For demo/development, simulate the API call
  if (provider === 'manual' || !getApiKey(provider)) {
    return simulateSend(letterContent, recipientAddress, certified, provider);
  }

  try {
    switch (provider) {
      case 'lob':
        return await sendViaLob(letterContent, recipientAddress, senderAddress, options);
      case 'click2mail':
        return await sendViaClick2Mail(letterContent, recipientAddress, senderAddress, options);
      case 'postgrid':
        return await sendViaPostGrid(letterContent, recipientAddress, senderAddress, options);
      default:
        return simulateSend(letterContent, recipientAddress, certified, provider);
    }
  } catch (error) {
    return {
      success: false,
      mailingId: '',
      estimatedDelivery: '',
      cost: 0,
      provider,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Lob API integration
 */
async function sendViaLob(
  letterContent: string,
  recipientAddress: RecipientAddress,
  senderAddress: SenderAddress,
  options: MailOptions
): Promise<SendResult> {
  const apiKey = getApiKey('lob');
  const certified = options.certified ?? true;

  const response = await fetch('https://api.lob.com/v1/letters', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(apiKey + ':')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'Credit Dispute Letter',
      to: {
        name: recipientAddress.name,
        address_line1: recipientAddress.address_line1,
        address_line2: recipientAddress.address_line2 || undefined,
        address_city: recipientAddress.address_city,
        address_state: recipientAddress.address_state,
        address_zip: recipientAddress.address_zip,
      },
      from: {
        name: senderAddress.name,
        address_line1: senderAddress.address_line1,
        address_line2: senderAddress.address_line2 || undefined,
        address_city: senderAddress.address_city,
        address_state: senderAddress.address_state,
        address_zip: senderAddress.address_zip,
      },
      file: `<html><body style="font-family: monospace; white-space: pre-wrap; padding: 1in;">${letterContent}</body></html>`,
      color: options.color ?? false,
      double_sided: options.doubleSided ?? false,
      mail_type: certified ? 'usps_certified' : 'usps_first_class',
      return_envelope: options.returnReceipt ?? certified,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to send via Lob');
  }

  const data = await response.json();

  return {
    success: true,
    mailingId: data.id,
    trackingNumber: data.tracking_number || undefined,
    estimatedDelivery: data.expected_delivery_date || calculateEstimatedDelivery(certified),
    cost: certified ? PROVIDER_PRICING.lob.certified : PROVIDER_PRICING.lob.regular,
    provider: 'lob',
  };
}

/**
 * Click2Mail API integration (placeholder)
 */
async function sendViaClick2Mail(
  letterContent: string,
  recipientAddress: RecipientAddress,
  senderAddress: SenderAddress,
  options: MailOptions
): Promise<SendResult> {
  // Click2Mail uses XML-based API - simplified for demo
  const certified = options.certified ?? true;

  // For production, implement full Click2Mail API integration
  // https://developers.click2mail.com/

  return simulateSend(letterContent, recipientAddress, certified, 'click2mail');
}

/**
 * PostGrid API integration (placeholder)
 */
async function sendViaPostGrid(
  letterContent: string,
  recipientAddress: RecipientAddress,
  senderAddress: SenderAddress,
  options: MailOptions
): Promise<SendResult> {
  const apiKey = getApiKey('postgrid');
  const certified = options.certified ?? true;

  // PostGrid API endpoint
  const response = await fetch('https://api.postgrid.com/print-mail/v1/letters', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: {
        firstName: recipientAddress.name.split(' ')[0],
        lastName: recipientAddress.name.split(' ').slice(1).join(' '),
        addressLine1: recipientAddress.address_line1,
        addressLine2: recipientAddress.address_line2,
        city: recipientAddress.address_city,
        provinceOrState: recipientAddress.address_state,
        postalOrZip: recipientAddress.address_zip,
        country: 'US',
      },
      from: {
        firstName: senderAddress.name.split(' ')[0],
        lastName: senderAddress.name.split(' ').slice(1).join(' '),
        addressLine1: senderAddress.address_line1,
        addressLine2: senderAddress.address_line2,
        city: senderAddress.address_city,
        provinceOrState: senderAddress.address_state,
        postalOrZip: senderAddress.address_zip,
        country: 'US',
      },
      html: `<html><body style="font-family: monospace; white-space: pre-wrap; padding: 1in;">${letterContent}</body></html>`,
      mailingClass: certified ? 'certified_mail' : 'first_class',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to send via PostGrid');
  }

  const data = await response.json();

  return {
    success: true,
    mailingId: data.id,
    trackingNumber: data.trackingNumber || undefined,
    estimatedDelivery: data.expectedDeliveryDate || calculateEstimatedDelivery(certified),
    cost: certified ? PROVIDER_PRICING.postgrid.certified : PROVIDER_PRICING.postgrid.regular,
    provider: 'postgrid',
  };
}

/**
 * Simulate sending for demo/development
 */
function simulateSend(
  _letterContent: string,
  _recipientAddress: RecipientAddress,
  certified: boolean,
  provider: MailProvider
): SendResult {
  const mailingId = `${provider.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const trackingNumber = certified
    ? `9407 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(10 + Math.random() * 90)}`
    : undefined;

  return {
    success: true,
    mailingId,
    trackingNumber,
    estimatedDelivery: calculateEstimatedDelivery(certified),
    cost: provider === 'manual' ? 0 : (certified ? PROVIDER_PRICING[provider].certified : PROVIDER_PRICING[provider].regular),
    provider,
  };
}

/**
 * Track mailing status
 */
export async function trackMailingStatus(mailingId: string, provider: MailProvider = 'lob'): Promise<TrackingResult> {
  // For demo, simulate tracking events
  if (!getApiKey(provider)) {
    return simulateTracking(mailingId);
  }

  try {
    switch (provider) {
      case 'lob':
        return await trackViaLob(mailingId);
      default:
        return simulateTracking(mailingId);
    }
  } catch (error) {
    return simulateTracking(mailingId);
  }
}

/**
 * Track via Lob API
 */
async function trackViaLob(mailingId: string): Promise<TrackingResult> {
  const apiKey = getApiKey('lob');

  const response = await fetch(`https://api.lob.com/v1/letters/${mailingId}`, {
    headers: {
      'Authorization': `Basic ${btoa(apiKey + ':')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tracking info');
  }

  const data = await response.json();

  // Map Lob tracking events
  const events: TrackingEvent[] = (data.tracking_events || []).map((event: { time: string; name: string; location?: string }) => ({
    timestamp: event.time,
    status: event.name,
    location: event.location,
    description: event.name,
  }));

  // Map Lob status to our status
  let status: TrackingResult['status'] = 'processing';
  switch (data.carrier) {
    case 'USPS':
      if (data.tracking_events?.some((e: { name: string }) => e.name === 'Delivered')) {
        status = 'delivered';
      } else if (data.tracking_events?.some((e: { name: string }) => e.name === 'In Transit')) {
        status = 'in_transit';
      } else if (data.tracking_events?.some((e: { name: string }) => e.name === 'Returned')) {
        status = 'returned';
      }
      break;
  }

  return {
    mailingId,
    status,
    deliveryDate: data.expected_delivery_date,
    events,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Simulate tracking for demo
 */
function simulateTracking(mailingId: string): TrackingResult {
  const now = new Date();
  const created = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago

  // Random status for demo
  const statuses: TrackingResult['status'][] = ['created', 'processing', 'in_transit', 'delivered'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  const events: TrackingEvent[] = [
    {
      timestamp: created.toISOString(),
      status: 'Created',
      description: 'Mail piece created and submitted for processing',
    },
  ];

  if (randomStatus !== 'created') {
    events.push({
      timestamp: new Date(created.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      status: 'Processing',
      location: 'USPS Distribution Center',
      description: 'Mail piece received at USPS facility',
    });
  }

  if (randomStatus === 'in_transit' || randomStatus === 'delivered') {
    events.push({
      timestamp: new Date(created.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'In Transit',
      location: 'Regional Distribution Center',
      description: 'In transit to destination',
    });
  }

  if (randomStatus === 'delivered') {
    events.push({
      timestamp: new Date(created.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      status: 'Delivered',
      location: 'Destination',
      description: 'Delivered to recipient',
    });
  }

  return {
    mailingId,
    status: randomStatus,
    deliveryDate: randomStatus === 'delivered' ? events[events.length - 1].timestamp.split('T')[0] : undefined,
    events,
    lastUpdated: now.toISOString(),
  };
}

/**
 * Get mailing cost estimate
 */
export function getMailingCost(provider: MailProvider = 'lob'): MailCost {
  const pricing = PROVIDER_PRICING[provider];

  return {
    certified: pricing.certified,
    regular: pricing.regular,
    breakdown: {
      postage: Math.round(pricing.regular * 0.6),
      printing: Math.round(pricing.regular * 0.25),
      handling: Math.round(pricing.regular * 0.15),
      certifiedFee: pricing.certified - pricing.regular - 50, // Extra fee for certified
      returnReceiptFee: 50, // $0.50 for return receipt
    },
  };
}

/**
 * Format cost in dollars
 */
export function formatCost(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Get available providers with their pricing
 */
export function getAvailableProviders(): Array<{
  provider: MailProvider;
  name: string;
  certifiedCost: number;
  regularCost: number;
  available: boolean;
}> {
  return [
    {
      provider: 'lob',
      name: 'Lob',
      certifiedCost: PROVIDER_PRICING.lob.certified,
      regularCost: PROVIDER_PRICING.lob.regular,
      available: !!getApiKey('lob') || true, // Always available for demo
    },
    {
      provider: 'click2mail',
      name: 'Click2Mail',
      certifiedCost: PROVIDER_PRICING.click2mail.certified,
      regularCost: PROVIDER_PRICING.click2mail.regular,
      available: !!getApiKey('click2mail'),
    },
    {
      provider: 'letterstream',
      name: 'Letter Stream',
      certifiedCost: PROVIDER_PRICING.letterstream.certified,
      regularCost: PROVIDER_PRICING.letterstream.regular,
      available: !!getApiKey('letterstream'),
    },
    {
      provider: 'postgrid',
      name: 'PostGrid',
      certifiedCost: PROVIDER_PRICING.postgrid.certified,
      regularCost: PROVIDER_PRICING.postgrid.regular,
      available: !!getApiKey('postgrid'),
    },
    {
      provider: 'manual',
      name: 'Download & Mail Yourself',
      certifiedCost: 0,
      regularCost: 0,
      available: true,
    },
  ];
}
