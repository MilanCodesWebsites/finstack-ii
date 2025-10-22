// Mock data for P2P trading system

export type OrderStatus = 'pending_payment' | 'awaiting_release' | 'completed' | 'cancelled' | 'disputed';
export type PaymentMethod = 'Bank Transfer' | 'Mobile Money' | 'Alipay' | 'Custom Account';
export type AdType = 'buy' | 'sell';
export type RatingType = 'positive' | 'neutral' | 'negative';

export interface PaymentMethodDetails {
  type: PaymentMethod;
  label?: string; // For custom accounts
  details?: string; // Account number, QR code URL, etc.
  qrCodeImage?: string; // For Alipay QR code
}

export interface Trader {
  id: string;
  name: string;
  avatar?: string;
  rating: number; // 0-100
  totalTrades: number;
  completionRate: number; // 0-100
  responseTime: string;
  verifiedBadge: boolean;
  activeAds: number;
}

export interface P2PAd {
  id: string;
  traderId: string;
  type: AdType;
  cryptoCurrency: string;
  fiatCurrency: string;
  price: number;
  available: number;
  minLimit: number;
  maxLimit: number;
  paymentMethods: PaymentMethod[];
  paymentMethodDetails?: PaymentMethodDetails[]; // Detailed payment info
  paymentWindow: number; // minutes
  instructions?: string;
  autoReply?: string;
}

export interface P2POrder {
  id: string;
  adId: string;
  buyerId: string;
  sellerId: string;
  cryptoCurrency: string;
  fiatCurrency: string;
  cryptoAmount: number;
  fiatAmount: number;
  price: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentWindow: number;
  createdAt: Date;
  expiresAt: Date;
  paidAt?: Date;
  releasedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  rating?: RatingType;
  ratingComment?: string;
  accountDetails?: string; // Wallet address or bank account details
}

// Mock traders
export const mockTraders: Record<string, Trader> = {
  'trader1': {
    id: 'trader1',
    name: 'CryptoKing',
    rating: 98,
    totalTrades: 1247,
    completionRate: 99,
    responseTime: '2 mins',
    verifiedBadge: true,
    activeAds: 8
  },
  'trader2': {
    id: 'trader2',
    name: 'FiatMaster',
    rating: 95,
    totalTrades: 856,
    completionRate: 97,
    responseTime: '5 mins',
    verifiedBadge: true,
    activeAds: 5
  },
  'trader3': {
    id: 'trader3',
    name: 'SwapWizard',
    rating: 92,
    totalTrades: 543,
    completionRate: 95,
    responseTime: '3 mins',
    verifiedBadge: true,
    activeAds: 3
  },
  'trader4': {
    id: 'trader4',
    name: 'QuickTrade',
    rating: 88,
    totalTrades: 324,
    completionRate: 93,
    responseTime: '8 mins',
    verifiedBadge: false,
    activeAds: 2
  },
  'trader5': {
    id: 'trader5',
    name: 'P2PExpert',
    rating: 97,
    totalTrades: 2103,
    completionRate: 98,
    responseTime: '1 min',
    verifiedBadge: true,
    activeAds: 12
  }
};

// Mock P2P ads
export const mockP2PAds: P2PAd[] = [
  {
    id: 'ad1',
    traderId: 'trader1',
    type: 'sell',
    cryptoCurrency: 'USDC',
    fiatCurrency: 'USD',
    price: 1.02,
    available: 5000,
    minLimit: 100,
    maxLimit: 2000,
    paymentMethods: ['Bank Transfer', 'Mobile Money'],
    paymentWindow: 15,
    instructions: 'Please include order ID in payment reference.'
  },
  {
    id: 'ad2',
    traderId: 'trader2',
    type: 'buy',
    cryptoCurrency: 'USDC',
    fiatCurrency: 'USD',
    price: 0.98,
    available: 3000,
    minLimit: 50,
    maxLimit: 1500,
    paymentMethods: ['Bank Transfer'],
    paymentWindow: 30
  },
  {
    id: 'ad3',
    traderId: 'trader3',
    type: 'sell',
    cryptoCurrency: 'CNGN',
    fiatCurrency: 'RMB',
    price: 0.12,
    available: 50000,
    minLimit: 500,
    maxLimit: 5000,
    paymentMethods: ['Bank Transfer', 'Mobile Money'],
    paymentWindow: 15,
    instructions: 'WeChat Pay accepted. Fast release after confirmation.'
  },
  {
    id: 'ad4',
    traderId: 'trader4',
    type: 'sell',
    cryptoCurrency: 'USDC',
    fiatCurrency: 'GHS',
    price: 15.8,
    available: 2000,
    minLimit: 200,
    maxLimit: 1000,
    paymentMethods: ['Mobile Money'],
    paymentWindow: 30
  },
  {
    id: 'ad5',
    traderId: 'trader5',
    type: 'buy',
    cryptoCurrency: 'USDC',
    fiatCurrency: 'XAF',
    price: 620,
    available: 8000,
    minLimit: 5000,
    maxLimit: 50000,
    paymentMethods: ['Bank Transfer'],
    paymentWindow: 15
  },
  {
    id: 'ad6',
    traderId: 'trader1',
    type: 'sell',
    cryptoCurrency: 'USDC',
    fiatCurrency: 'XOF',
    price: 625,
    available: 4000,
    minLimit: 3000,
    maxLimit: 30000,
    paymentMethods: ['Bank Transfer', 'Mobile Money'],
    paymentWindow: 30
  },
  {
    id: 'ad7',
    traderId: 'trader3',
    type: 'buy',
    cryptoCurrency: 'USDC',
    fiatCurrency: 'RMB',
    price: 7.15,
    available: 10000,
    minLimit: 1000,
    maxLimit: 10000,
    paymentMethods: ['Bank Transfer'],
    paymentWindow: 20,
    instructions: 'Buying USDC with RMB. Alipay or WeChat Pay.'
  },
  {
    id: 'ad8',
    traderId: 'trader2',
    type: 'buy',
    cryptoCurrency: 'USDC',
    fiatCurrency: 'GHS',
    price: 15.5,
    available: 5000,
    minLimit: 200,
    maxLimit: 2000,
    paymentMethods: ['Mobile Money', 'Bank Transfer'],
    paymentWindow: 25,
    instructions: 'Buying USDC. Mobile Money preferred for faster payment.'
  },
  {
    id: 'ad9',
    traderId: 'trader4',
    type: 'buy',
    cryptoCurrency: 'CNGN',
    fiatCurrency: 'USD',
    price: 0.0012,
    available: 100000,
    minLimit: 100,
    maxLimit: 5000,
    paymentMethods: ['Bank Transfer', 'Mobile Money'],
    paymentWindow: 15,
    instructions: 'I buy CNGN. Quick payment guaranteed.'
  },
  {
    id: 'ad10',
    traderId: 'trader5',
    type: 'sell',
    cryptoCurrency: 'CNGN',
    fiatCurrency: 'RMB',
    price: 0.125,
    available: 40000,
    minLimit: 500,
    maxLimit: 8000,
    paymentMethods: ['Bank Transfer'],
    paymentWindow: 20
  }
];

// Helper to get trader by ID
export const getTrader = (id: string): Trader | undefined => mockTraders[id];

// Helper to get ads by trader
export const getAdsByTrader = (traderId: string): P2PAd[] => 
  mockP2PAds.filter(ad => ad.traderId === traderId);
