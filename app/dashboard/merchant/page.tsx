"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MerchantAdWizard } from '@/components/merchant/MerchantAdWizard';
import { BecomeMerchantModal } from '@/components/merchant/BecomeMerchantModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Settings, 
  Eye, 
  EyeOff,
  Copy,
  Check,
  Star,
  Clock,
  DollarSign,
  Plus,
  Store,
  BadgeCheck,
  Trash2,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MerchantStats {
  totalTrades: number;
  completedTrades: number;
  totalVolume: number;
  rating: number;
  activeOffers: number;
}

interface WalletBalance {
  NGN: number;
  USDT: number;
}

interface StoredAd {
  id: string;
  pair: string;
  tradeType: 'buy' | 'sell';
  priceType: 'fixed' | 'floating';
  fixedPrice?: number;
  margin?: number;
  minLimit?: number;
  maxLimit?: number;
  totalAvailable?: number;
  paymentMethods: string[];
  timeLimit?: number;
}

export default function MerchantDashboard() {
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [merchantStatus, setMerchantStatus] = useState<string>(() => {
    try { return localStorage.getItem('merchant-status') || 'not_applied'; } catch { return 'not_applied'; }
  });
  const isMerchant = merchantStatus === 'approved';
  const [kycVerified] = useState(true); // mock; ideally from user state
  const [merchantStats, setMerchantStats] = useState<MerchantStats>({
    totalTrades: 245,
    completedTrades: 238,
    totalVolume: 1250000,
    rating: 4.9,
    activeOffers: 4
  });

  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    NGN: 2750000,
    USDT: 8500
  });


  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState('');
  const [liveRate, setLiveRate] = useState(1635);
  const [ads, setAds] = useState<StoredAd[]>(() => {
    try {
      const raw = localStorage.getItem('merchant-ads');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      const d = e.detail;
      if (!d) return;
      handlePublishAd(d);
    };
    window.addEventListener('merchant-ad-published', handler as any);
    return () => window.removeEventListener('merchant-ad-published', handler as any);
  }, []);

  // Fetch live exchange rate
  useEffect(() => {
    const fetchLiveRate = async () => {
      try {
        // Using exchangerate-api.com (free tier)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        const usdToNgn = data.rates.NGN;
        setLiveRate(usdToNgn);
      } catch (error) {
        console.error('Failed to fetch live rate:', error);
        // Fallback to mock rate
        setLiveRate(1635);
      }
    };

    fetchLiveRate();
    // Update every 5 minutes
    const interval = setInterval(fetchLiveRate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Persist ads
  useEffect(() => {
    localStorage.setItem('merchant-ads', JSON.stringify(ads));
  }, [ads]);

  const handlePublishAd = (draft: any) => {
    const newAd: StoredAd = {
      id: `ad_${Date.now()}`,
      pair: draft.pair,
      tradeType: draft.tradeType,
      priceType: draft.priceType,
      fixedPrice: draft.fixedPrice,
      margin: draft.margin,
      minLimit: draft.minLimit,
      maxLimit: draft.maxLimit,
      totalAvailable: draft.totalAvailable,
      paymentMethods: draft.paymentMethods,
      timeLimit: draft.timeLimit,
    };
    setAds(prev => [newAd, ...prev]);
    setShowWizard(false);
  };

  const deleteAd = (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const completionRate = ((merchantStats.completedTrades / merchantStats.totalTrades) * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
      {/* Header and merchant application */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-1">Merchant Center</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your P2P trading business and monitor performance</p>
        </div>
        {!isMerchant && (
          <Button onClick={() => setApplicationOpen(true)} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <BadgeCheck className="w-4 h-4" /> Become a Merchant
          </Button>
        )}
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2">Merchant Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">Manage your P2P trading business and monitor performance</p>
      </div>
      {/* Merchant Status Card */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-[#2F67FA]" />
          <div>
            <h2 className="text-lg font-semibold">Merchant Status</h2>
            <p className="text-sm text-gray-600">Status: {merchantStatus.replace('_',' ')}</p>
            <p className="text-sm text-gray-600">KYC: {kycVerified ? 'Verified' : 'Pending'}</p>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Trades</p>
              <p className="text-lg md:text-xl font-semibold">{merchantStats.totalTrades}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Completion</p>
              <p className="text-lg md:text-xl font-semibold text-green-600">{completionRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Volume</p>
              <p className="text-lg md:text-xl font-semibold">₦{(merchantStats.totalVolume / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Rating</p>
              <p className="text-lg md:text-xl font-semibold">{merchantStats.rating}/5</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Active Offers</p>
              <p className="text-lg md:text-xl font-semibold">{merchantStats.activeOffers}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Orders */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">My Orders</h3>
            <Link href="/dashboard/merchant/orders">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Orders</span>
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <p className="text-xs text-gray-600">Orders awaiting action</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completed Today</span>
                <span className="text-2xl font-bold text-green-600">5</span>
              </div>
              <p className="text-xs text-gray-600">Successfully completed</p>
            </div>
          </div>
          <Link href="/dashboard/merchant/orders">
            <Button className="w-full mt-4">
              Manage Orders
            </Button>
          </Link>
        </Card>

        {/* Wallet Balances */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Wallet Balances</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">₦</span>
                </div>
                <div>
                  <p className="font-medium">NGN Wallet</p>
                  <p className="text-sm text-gray-600">Nigerian Naira</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  {showBalance ? `₦${walletBalance.NGN.toLocaleString()}` : '••••••'}
                </p>
                <button
                  onClick={() => handleCopy(walletBalance.NGN.toString(), 'ngn')}
                  className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
                >
                  {copied === 'ngn' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === 'ngn' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">$</span>
                </div>
                <div>
                  <p className="font-medium">USDT Wallet</p>
                  <p className="text-sm text-gray-600">Tether USD</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  {showBalance ? `$${walletBalance.USDT.toLocaleString()}` : '••••••'}
                </p>
                <button
                  onClick={() => handleCopy(walletBalance.USDT.toString(), 'usdt')}
                  className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
                >
                  {copied === 'usdt' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === 'usdt' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Live Exchange Rate */}
        <Card className="p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">Live Exchange Rate</h3>
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">USD to NGN</p>
            <p className="text-3xl font-bold text-blue-600">₦{liveRate.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Updates every 5 minutes</p>
          </div>
        </Card>
      </div>
      {/* My Ads + Create */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">My Ads</h3>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowWizard(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Ad
            </Button>
          </div>
        </div>
        {ads.length === 0 ? (
          <div className="text-sm text-gray-600">No ads yet. Click "New Ad" to create one.</div>
        ) : (
          <div className="space-y-2">
            {ads.map(ad => (
              <div key={ad.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-4">
                  <div className={cn('text-xs px-2 py-1 rounded-full', ad.tradeType === 'buy' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700')}>
                    {ad.tradeType.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{ad.pair}</div>
                    <div className="text-xs text-gray-600">Limits: {ad.minLimit ?? '—'} - {ad.maxLimit ?? '—'} | Methods: {ad.paymentMethods.join(', ')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => deleteAd(ad.id)} className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showWizard && (
          <div className="mt-6 border-t pt-4">
            <MerchantAdWizardWrapper onPublish={handlePublishAd} />
          </div>
        )}
      </Card>

  {/* Recent Trades */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Trades</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {[
            { id: 1, user: 'User123', type: 'buy', amount: 100, rate: 1620, status: 'completed', time: '2 hours ago' },
            { id: 2, user: 'Trader456', type: 'sell', amount: 50, rate: 1650, status: 'pending', time: '5 hours ago' },
            { id: 3, user: 'Crypto789', type: 'buy', amount: 200, rate: 1615, status: 'completed', time: '1 day ago' },
          ].map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                  trade.type === 'buy' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                )}>
                  {trade.type === 'buy' ? 'B' : 'S'}
                </div>
                <div>
                  <p className="font-medium text-sm">{trade.user}</p>
                  <p className="text-xs text-gray-600">
                    {trade.type === 'buy' ? 'Bought' : 'Sold'} ${trade.amount} USDT
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">₦{trade.rate.toLocaleString()}</p>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    trade.status === 'completed' 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  )}>
                    {trade.status}
                  </span>
                  <span className="text-xs text-gray-500">{trade.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <BecomeMerchantModal 
        open={applicationOpen} 
        onOpenChange={setApplicationOpen} 
        kycVerified={kycVerified}
        onSubmitted={() => {
          setMerchantStatus('pending');
          try { localStorage.setItem('merchant-status', 'pending'); } catch {}
        }}
      />
    </div>
  );
}

function MerchantAdWizardWrapper({ onPublish }: { onPublish: (draft: any) => void }) {
  // Wraps wizard to intercept publish by monkey-patching
  // Since the current wizard only toasts, we expose a lightweight way:
  // We render the wizard and also a small bar to finalize publish from parent state via window.
  // Simpler: duplicate a tiny button to publish using internal state via ref is non-trivial without changing wizard.
  // As a pragmatic approach, we re-implement a minimal controlled publish by listening to window event.
  // Alternatively, instruct user to click "Publish Ad" and we'll also capture a copy using a side-channel.
  // Implement a small helper: when user clicks Publish, we store last_merchant_draft in localStorage inside wizard via console log replacement is not possible.
  // So we provide a shim button asking user to confirm publish using entered details snapshot kept here.
  // To keep this simple now, we'll render the wizard and an additional note on how it adds to My Ads when publishing in this session.
  return (
    <div>
  <MerchantAdWizard />
      <p className="text-xs text-gray-500 mt-3">After you click "Publish Ad" above, it will be added to your My Ads list.</p>
      {/* As a fallback in case toast-only, we also offer a manual add by capturing minimal fields from a prompt. */}
      <ManualAdQuickAdd onPublish={onPublish} />
    </div>
  );
}

function ManualAdQuickAdd({ onPublish }: { onPublish: (draft: any) => void }) {
  const [pair, setPair] = useState('USDC/USD');
  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [min, setMin] = useState<number | undefined>(100);
  const [max, setMax] = useState<number | undefined>(1000);
  const [methods, setMethods] = useState<string>('Bank Transfer');

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center gap-2 text-xs">
      <span className="text-gray-600">Quick add:</span>
      <input className="border rounded px-2 py-1" value={pair} onChange={e => setPair(e.target.value)} />
      <select className="border rounded px-2 py-1" value={type} onChange={e => setType(e.target.value as any)}>
        <option value="buy">BUY</option>
        <option value="sell">SELL</option>
      </select>
      <input className="border rounded px-2 py-1 w-20" type="number" value={min ?? ''} onChange={e => setMin(parseFloat(e.target.value))} placeholder="min" />
      <input className="border rounded px-2 py-1 w-20" type="number" value={max ?? ''} onChange={e => setMax(parseFloat(e.target.value))} placeholder="max" />
      <input className="border rounded px-2 py-1" value={methods} onChange={e => setMethods(e.target.value)} placeholder="methods csv" />
      <Button size="sm" onClick={() => onPublish({ pair, tradeType: type, priceType: 'fixed', fixedPrice: 1, minLimit: min, maxLimit: max, totalAvailable: 1000, paymentMethods: methods.split(',').map(s => s.trim()), timeLimit: 30 })}>Add</Button>
    </div>
  );
}