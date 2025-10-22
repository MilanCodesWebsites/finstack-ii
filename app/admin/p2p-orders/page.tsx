'use client';

import { useState } from 'react';
import { P2POrdersTable } from '@/components/admin/P2POrdersTable';
import { P2POrdersFilter } from '@/components/admin/P2POrdersFilter';

// Mock data for P2P orders
const mockP2POrders = [
  {
    id: 'P2P-001',
    buyer: 'John Doe',
    buyerEmail: 'john@example.com',
    seller: 'Sarah Chen',
    sellerEmail: 'sarah@example.com',
    amount: 100000,
    currency: 'NGN',
    cryptoAmount: 60.61,
    cryptoCurrency: 'USDT',
    rate: 1650,
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    date: '2024-01-15T10:30:00Z',
    reference: 'TXN789012345',
    escrowReleased: true,
    disputeCount: 0,
  },
  {
    id: 'P2P-002',
    buyer: 'Mike Johnson',
    buyerEmail: 'mike@example.com',
    seller: 'Lisa Wang',
    sellerEmail: 'lisa@example.com',
    amount: 250000,
    currency: 'NGN',
    cryptoAmount: 151.52,
    cryptoCurrency: 'USDT',
    rate: 1650,
    status: 'pending',
    paymentMethod: 'Mobile Money',
    date: '2024-01-15T11:45:00Z',
    reference: 'TXN789012346',
    escrowReleased: false,
    disputeCount: 0,
  },
  {
    id: 'P2P-003',
    buyer: 'David Kim',
    buyerEmail: 'david@example.com',
    seller: 'Emma Brown',
    sellerEmail: 'emma@example.com',
    amount: 500000,
    currency: 'NGN',
    cryptoAmount: 303.03,
    cryptoCurrency: 'USDT',
    rate: 1650,
    status: 'disputed',
    paymentMethod: 'Bank Transfer',
    date: '2024-01-15T09:15:00Z',
    reference: 'TXN789012347',
    escrowReleased: false,
    disputeCount: 1,
  },
  {
    id: 'P2P-004',
    buyer: 'Alice Johnson',
    buyerEmail: 'alice@example.com',
    seller: 'Bob Wilson',
    sellerEmail: 'bob@example.com',
    amount: 75000,
    currency: 'NGN',
    cryptoAmount: 45.45,
    cryptoCurrency: 'USDT',
    rate: 1650,
    status: 'cancelled',
    paymentMethod: 'Cash',
    date: '2024-01-15T08:00:00Z',
    reference: 'TXN789012348',
    escrowReleased: false,
    disputeCount: 0,
  },
];

const p2pStats = [
  {
    title: 'Total P2P Volume',
    value: '₦925,000',
    change: '+12.5%',
    trend: 'up' as const,
  },
  {
    title: 'Active Orders',
    value: '23',
    change: '+3',
    trend: 'up' as const,
  },
  {
    title: 'Completed Today',
    value: '89',
    change: '+8.2%',
    trend: 'up' as const,
  },
  {
    title: 'Dispute Rate',
    value: '2.1%',
    change: '-0.5%',
    trend: 'down' as const,
  },
];

export default function P2POrdersPage() {
  const [filteredOrders, setFilteredOrders] = useState(mockP2POrders);

  const handleFilterChange = (filters: any) => {
    // Implement filtering logic here
    console.log('Filters applied:', filters);
    setFilteredOrders(mockP2POrders);
  };

  return (
    <div className="space-y-6">
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">P2P Orders</h1>
        <p className="text-gray-600 mt-1">Monitor and manage peer-to-peer trading orders</p>
      </div>

      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Custom Stats Cards for P2P Orders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {p2pStats.map((stat) => (
          <div key={stat.title} className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm min-w-0">
            <h3 className="text-xs font-medium text-gray-500 mb-2 truncate">{stat.title}</h3>
            <p className="text-lg md:text-xl font-semibold text-gray-900 mb-1 truncate">{stat.value}</p>
            <div className="flex items-center">
              {stat.trend === 'up' ? (
                <svg className="w-3 h-3 md:w-4 md:h-4 text-green-600 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-3 h-3 md:w-4 md:h-4 text-red-600 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <p className={`text-xs truncate ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <P2POrdersFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <P2POrdersTable orders={filteredOrders} />
      </div>
    </div>
  );
}