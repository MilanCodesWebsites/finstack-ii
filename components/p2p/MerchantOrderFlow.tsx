'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Upload,
  MessageSquare,
  Shield,
  Eye
} from 'lucide-react';

interface P2POrder {
  id: string;
  buyerName: string;
  cryptoAmount: number;
  fiatAmount: number;
  cryptoCurrency: string;
  fiatCurrency: string;
  paymentMethod: string;
  status: 'pending_payment' | 'awaiting_release' | 'completed' | 'disputed';
  createdAt: Date;
  expiresAt: Date;
  paymentProof?: string;
}

interface MerchantOrderFlowProps {
  order: P2POrder;
  onComplete: () => void;
  onDispute: () => void;
}

export function MerchantOrderFlow({ order, onComplete, onDispute }: MerchantOrderFlowProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showPaymentProof, setShowPaymentProof] = useState(false);

  const timeRemaining = Math.max(0, Math.floor((order.expiresAt.getTime() - Date.now()) / 1000 / 60));
  const isExpiringSoon = timeRemaining <= 5;

  const handleReleaseCrypto = async () => {
    setVerifying(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVerifying(false);
    
    toast({
      title: 'Crypto Released',
      description: `${order.cryptoAmount} ${order.cryptoCurrency} has been released to the buyer.`
    });
    
    onComplete();
  };

  const handleDispute = () => {
    toast({
      title: 'Dispute Initiated',
      description: 'Admin will review this order. Both parties will be notified.',
      variant: 'destructive'
    });
    onDispute();
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-sm text-gray-600">Buyer: {order.buyerName}</p>
          </div>
          <Badge className={
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'disputed' ? 'bg-red-100 text-red-800' :
            order.status === 'awaiting_release' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }>
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-600 mb-1">You Receive</p>
            <p className="text-lg font-bold">{order.fiatAmount.toLocaleString()} {order.fiatCurrency}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">You Release</p>
            <p className="text-lg font-bold">{order.cryptoAmount} {order.cryptoCurrency}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Payment Method</p>
            <p className="text-sm font-medium">{order.paymentMethod}</p>
          </div>
        </div>

        {/* Timer */}
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${isExpiringSoon ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
          <Clock className={`w-5 h-5 ${isExpiringSoon ? 'text-red-600' : 'text-blue-600'}`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${isExpiringSoon ? 'text-red-800' : 'text-blue-800'}`}>
              {order.status === 'pending_payment' ? 'Waiting for buyer payment' : 'Payment received - Verify and release'}
            </p>
            <p className={`text-xs ${isExpiringSoon ? 'text-red-600' : 'text-blue-600'}`}>
              Time remaining: {timeRemaining} minutes
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Verification */}
      {order.status === 'awaiting_release' && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Verify Payment</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">Verify Payment Carefully</p>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Check your bank account or payment app for the exact amount</li>
                    <li>• Verify the sender's name matches the buyer's account name</li>
                    <li>• Check payment reference/memo if provided</li>
                    <li>• Only release crypto after confirming payment</li>
                  </ul>
                </div>
              </div>
            </div>

            {order.paymentProof && (
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPaymentProof(!showPaymentProof)}
                  className="mb-2"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPaymentProof ? 'Hide' : 'View'} Payment Proof
                </Button>
                {showPaymentProof && (
                  <div className="border rounded-lg p-3 bg-white">
                    <img 
                      src={order.paymentProof} 
                      alt="Payment proof" 
                      className="max-w-full h-auto rounded"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Verification Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add any notes about payment verification..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleReleaseCrypto}
                disabled={verifying}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {verifying ? (
                  <>Verifying...</>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm & Release Crypto
                  </>
                )}
              </Button>
              <Button
                onClick={handleDispute}
                variant="destructive"
                disabled={verifying}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Dispute
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Waiting for Payment */}
      {order.status === 'pending_payment' && (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Waiting for Buyer Payment</h3>
              <p className="text-gray-600 text-sm">
                The buyer has been notified to make the payment. You'll be alerted once they mark it as paid.
              </p>
            </div>
            <Button
              onClick={handleDispute}
              variant="outline"
              size="sm"
            >
              Report Issue
            </Button>
          </div>
        </Card>
      )}

      {/* Chat/Communication */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold">Order Chat</h3>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
          Chat functionality coming soon. Use the notes section for now.
        </div>
      </Card>
    </div>
  );
}
