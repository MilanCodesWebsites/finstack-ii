'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { P2PAd, Trader, P2POrder } from '@/lib/p2p-mock-data';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeftRight, Clock, DollarSign, AlertCircle, Wallet, Building2, Loader2, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { calculateP2PFee, getP2PFeeSettings } from '@/components/admin/P2PFeeSettings';

interface OrderModalProps {
  ad: P2PAd;
  trader: Trader;
  open: boolean;
  onClose: () => void;
  onOrderCreated: (order: P2POrder) => void;
}

export function OrderModal({ ad, trader, open, onClose, onOrderCreated }: OrderModalProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [fiatAmount, setFiatAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string>(ad.paymentMethods[0]);
  const [accountDetails, setAccountDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fee, setFee] = useState(0);
  const [feeSettings, setFeeSettings] = useState(getP2PFeeSettings());

  // Calculate fee when fiat amount changes
  useEffect(() => {
    if (fiatAmount && !isNaN(parseFloat(fiatAmount))) {
      const amount = parseFloat(fiatAmount);
      const calculatedFee = calculateP2PFee(amount);
      setFee(calculatedFee);
    } else {
      setFee(0);
    }
  }, [fiatAmount]);

  // Auto-calculate opposite amount
  useEffect(() => {
    if (fiatAmount && !isNaN(parseFloat(fiatAmount))) {
      const crypto = parseFloat(fiatAmount) / ad.price;
      setCryptoAmount(crypto.toFixed(6));
    }
  }, [fiatAmount, ad.price]);

  const handleCryptoChange = (value: string) => {
    setCryptoAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const fiat = parseFloat(value) * ad.price;
      setFiatAmount(fiat.toFixed(2));
    }
  };

  const handleFiatChange = (value: string) => {
    setFiatAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const crypto = parseFloat(value) / ad.price;
      setCryptoAmount(crypto.toFixed(6));
    }
  };

  const handleConfirm = async () => {
    const fiat = parseFloat(fiatAmount);
    const crypto = parseFloat(cryptoAmount);

    if (!fiat || !crypto) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive'
      });
      return;
    }

    if (fiat < ad.minLimit || fiat > ad.maxLimit) {
      toast({
        title: 'Amount Out of Range',
        description: `Amount must be between ${ad.minLimit} and ${ad.maxLimit} ${ad.fiatCurrency}`,
        variant: 'destructive'
      });
      return;
    }

    if (crypto > ad.available) {
      toast({
        title: 'Insufficient Available',
        description: `Only ${ad.available} ${ad.cryptoCurrency} available`,
        variant: 'destructive'
      });
      return;
    }

    // Validate account details based on order type
    const isBuying = ad.type === 'sell'; // If ad is 'sell', current user is buying
    if (isBuying && !accountDetails.trim()) {
      toast({
        title: 'Account Details Required',
        description: 'Please provide your wallet address to receive the crypto',
        variant: 'destructive'
      });
      return;
    }

    if (!isBuying && selectedPayment !== 'Crypto Wallet' && !accountDetails.trim()) {
      toast({
        title: 'Account Details Required',
        description: 'Please provide your account details for payment',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const now = new Date();
    const expiresAt = new Date(now.getTime() + ad.paymentWindow * 60 * 1000);

    const order: P2POrder = {
      id: 'order-' + Date.now(),
      adId: ad.id,
      buyerId: 'current-user',
      merchantId: trader.id, // Always the merchant/trader ID
      cryptoCurrency: ad.cryptoCurrency,
      fiatCurrency: ad.fiatCurrency,
      cryptoAmount: crypto,
      fiatAmount: fiat,
      price: ad.price,
      status: 'pending_payment',
      paymentMethod: selectedPayment as any,
      paymentWindow: ad.paymentWindow,
      createdAt: now,
      expiresAt,
      userAccountDetails: accountDetails.trim(),
      escrowAddress: '0xescrow_' + Date.now()
    };

    onOrderCreated(order);
    toast({
      title: 'Order Created',
      description: `Order created successfully. Complete payment within ${ad.paymentWindow} minutes.`
    });
    
    setIsLoading(false);
    onClose();
    router.push(`/dashboard/p2p/order/${order.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {ad.type === 'buy' ? 'Sell' : 'Buy'} {ad.cryptoCurrency}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Price Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Price</span>
              <span className="text-lg font-bold">{ad.price} {ad.fiatCurrency}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Available</span>
              <span className="font-medium">{ad.available} {ad.cryptoCurrency}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Limits</span>
              <span className="font-medium">{ad.minLimit} - {ad.maxLimit} {ad.fiatCurrency}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
              <Clock className="w-3 h-3" />
              <span>Payment window: {ad.paymentWindow} minutes</span>
            </div>
          </div>

          {/* Amount Input - Fiat */}
          <div>
            <Label htmlFor="fiat-amount">You {ad.type === 'buy' ? 'Receive' : 'Pay'} ({ad.fiatCurrency})</Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="fiat-amount"
                type="number"
                value={fiatAmount}
                onChange={(e) => handleFiatChange(e.target.value)}
                placeholder={`${ad.minLimit} - ${ad.maxLimit}`}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          {/* Amount Input - Crypto */}
          <div>
            <Label htmlFor="crypto-amount">{ad.type === 'buy' ? 'You Pay' : 'You Receive'} ({ad.cryptoCurrency})</Label>
            <Input
              id="crypto-amount"
              type="number"
              value={cryptoAmount}
              onChange={(e) => handleCryptoChange(e.target.value)}
              placeholder="0.00"
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          {/* Payment Method */}
          <div>
            <Label>Payment Method</Label>
            <div className="flex gap-2 mt-2">
              {ad.paymentMethods.map(method => (
                <button
                  key={method}
                  onClick={() => setSelectedPayment(method)}
                  disabled={isLoading}
                  className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedPayment === method
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div>
            <Label htmlFor="account-details" className="flex items-center gap-2">
              {ad.type === 'sell' ? (
                <>
                  <Wallet className="w-4 h-4" />
                  Your Wallet Address
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4" />
                  Your Account Details
                </>
              )}
            </Label>
            <Textarea
              id="account-details"
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder={
                ad.type === 'sell'
                  ? `Enter your ${ad.cryptoCurrency} wallet address to receive crypto`
                  : selectedPayment === 'Bank Transfer'
                  ? 'Enter your bank account details (Bank name, Account number, Account name)'
                  : selectedPayment === 'Mobile Money'
                  ? 'Enter your mobile money number'
                  : 'Enter your account details'
              }
              className="mt-1 min-h-[80px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {ad.type === 'sell'
                ? 'The seller will send crypto to this address'
                : 'The buyer will send payment to these details'}
            </p>
          </div>

          {/* Transaction Fee */}
          {feeSettings.feeEnabled && fee > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-900 mb-1">Transaction Fee</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-700">Platform fee ({feeSettings.feePercentage}%)</span>
                    <span className="text-sm font-bold text-blue-900">${fee.toFixed(2)}</span>
                  </div>
                  {fiatAmount && (
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-blue-200">
                      <span className="text-xs font-medium text-blue-900">Total Amount</span>
                      <span className="text-sm font-bold text-blue-900">
                        ${(parseFloat(fiatAmount) + fee).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {ad.instructions && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-700">
                <p className="font-medium mb-1">Seller's Instructions:</p>
                <p>{ad.instructions}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Order...
                </>
              ) : (
                'Confirm Order'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
