'use client';

import { useState } from 'react';
import { MerchantOrderFlow } from '@/components/p2p/MerchantOrderFlow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock orders for demonstration
type OrderStatus = 'pending_payment' | 'awaiting_release' | 'completed' | 'disputed';

interface Order {
  id: string;
  buyerName: string;
  cryptoAmount: number;
  fiatAmount: number;
  cryptoCurrency: string;
  fiatCurrency: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: Date;
  expiresAt: Date;
  paymentProof?: string;
}

const mockOrders: Order[] = [
  {
    id: 'ord_12345abc',
    buyerName: 'John Trader',
    cryptoAmount: 500,
    fiatAmount: 825000,
    cryptoCurrency: 'USDT',
    fiatCurrency: 'NGN',
    paymentMethod: 'Bank Transfer',
    status: 'awaiting_release',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    paymentProof: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Payment+Receipt'
  },
  {
    id: 'ord_67890def',
    buyerName: 'Sarah Chen',
    cryptoAmount: 200,
    fiatAmount: 330000,
    cryptoCurrency: 'USDT',
    fiatCurrency: 'NGN',
    paymentMethod: 'Mobile Money',
    status: 'pending_payment',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    expiresAt: new Date(Date.now() + 25 * 60 * 1000),
  }
];

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleComplete = () => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o => 
      o.id === selectedOrder.id ? { ...o, status: 'completed' as OrderStatus } : o
    ));
    setSelectedOrder(null);
  };

  const handleDispute = () => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o => 
      o.id === selectedOrder.id ? { ...o, status: 'disputed' as OrderStatus } : o
    ));
    setSelectedOrder(null);
  };

  if (selectedOrder) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => setSelectedOrder(null)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>
        <MerchantOrderFlow
          order={selectedOrder}
          onComplete={handleComplete}
          onDispute={handleDispute}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">My Orders</h1>
        <p className="text-gray-600">Manage and fulfill your P2P orders</p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No active orders</p>
          </Card>
        ) : (
          orders.map(order => (
            <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedOrder(order)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold mb-1">Order #{order.id.slice(0, 8)}</h3>
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

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">You Receive</p>
                  <p className="font-bold">{order.fiatAmount.toLocaleString()} {order.fiatCurrency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">You Release</p>
                  <p className="font-bold">{order.cryptoAmount} {order.cryptoCurrency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                  <p className="text-sm font-medium">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Time Left</p>
                  <p className="text-sm font-medium">
                    {Math.max(0, Math.floor((order.expiresAt.getTime() - Date.now()) / 1000 / 60))} min
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button size="sm">View Details</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
