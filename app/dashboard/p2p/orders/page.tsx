'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { P2POrder, getTrader, OrderStatus } from '@/lib/p2p-mock-data';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<P2POrder[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('p2p-orders');
    if (stored) {
      const parsedOrders: P2POrder[] = JSON.parse(stored);
      setOrders(parsedOrders.map(o => ({
        ...o,
        createdAt: new Date(o.createdAt),
        expiresAt: new Date(o.expiresAt),
        paidAt: o.paidAt ? new Date(o.paidAt) : undefined,
        releasedAt: o.releasedAt ? new Date(o.releasedAt) : undefined,
        completedAt: o.completedAt ? new Date(o.completedAt) : undefined
      })));
    }
  }, []);

  const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
    pending_payment: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    awaiting_release: { label: 'Awaiting Release', color: 'bg-blue-100 text-blue-700', icon: Clock },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
    disputed: { label: 'Disputed', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Order History</h1>
        <p className="text-sm text-gray-600">View all your P2P trading orders</p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Button onClick={() => router.push('/dashboard/p2p')}>
            Start Trading
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const trader = getTrader(order.buyerId === 'current-user' ? order.sellerId : order.buyerId);

            return (
              <Card key={order.id} className="p-6 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold">
                        {order.cryptoAmount} {order.cryptoCurrency}
                      </span>
                      <Badge className={cn('text-xs', status.color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Total: <span className="font-medium text-gray-900">{order.fiatAmount} {order.fiatCurrency}</span></p>
                      <p>Price: {order.price} {order.fiatCurrency}</p>
                      <p>With: <span className="font-medium">{trader?.name || 'Unknown'}</span></p>
                      <p className="text-xs">{order.createdAt.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/p2p/order/${order.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
