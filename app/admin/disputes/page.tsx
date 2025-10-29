'use client';

import { StatsCards } from '../../../components/admin/StatsCards';
import { DisputesTable } from '@/components/admin/DisputesTable';
import { DisputesFilter } from '@/components/admin/DisputesFilter';
import { useState } from 'react';

// Mock data for disputes
const mockDisputes = [
  {
    id: 'DSP-001',
    tradeId: 'TRD-12345',
    initiatedBy: {
      id: 'user1',
      name: 'John Doe',
      avatar: '/Memoji-01.png'
    },
    respondent: {
      id: 'user2', 
      name: 'Jane Smith',
      avatar: '/Memoji-02.png'
    },
    amount: 1500,
    currency: 'USDT',
    status: 'open' as const,
    priority: 'high' as const,
    category: 'payment_issue' as const,
    description: 'Payment was sent but not received by seller',
    createdAt: '2024-01-15T10:30:00Z',
    lastUpdate: '2024-01-15T14:20:00Z',
    assignedTo: 'admin1',
    evidence: [
      { type: 'screenshot' as const, url: '/evidence/payment-proof.png' },
      { type: 'transaction' as const, id: 'TXN-789' }
    ],
    messages: [
      {
        id: 'msg1',
        sender: 'John Doe',
        message: 'I sent the payment 2 hours ago but the seller says they haven\'t received it',
        timestamp: '2024-01-15T10:30:00Z',
        type: 'user' as const
      },
      {
        id: 'msg2',
        sender: 'Jane Smith',
        message: 'I checked my account multiple times and no payment has arrived',
        timestamp: '2024-01-15T11:15:00Z',
        type: 'user' as const
      }
    ]
  },
  {
    id: 'DSP-002',
    tradeId: 'TRD-12346',
    initiatedBy: {
      id: 'user3',
      name: 'Mike Johnson',
      avatar: '/Memoji-03.png'
    },
    respondent: {
      id: 'user4',
      name: 'Sarah Wilson',
      avatar: '/Memoji-04.png'
    },
    amount: 750,
    currency: 'USDT',
    status: 'under_review' as const,
    priority: 'medium' as const,
    category: 'trade_terms' as const,
    description: 'Disagreement over trade terms and conditions',
    createdAt: '2024-01-14T15:45:00Z',
    lastUpdate: '2024-01-15T09:10:00Z',
    assignedTo: 'admin2',
    evidence: [
      { type: 'chat_log' as const, url: '/evidence/trade-chat.txt' }
    ],
    messages: [
      {
        id: 'msg3',
        sender: 'Mike Johnson',
        message: 'The seller changed the terms after we agreed on the price',
        timestamp: '2024-01-14T15:45:00Z',
        type: 'user' as const
      }
    ]
  },
  {
    id: 'DSP-003',
    tradeId: 'TRD-12347',
    initiatedBy: {
      id: 'user5',
      name: 'David Brown',
      avatar: '/Memoji-05.png'
    },
    respondent: {
      id: 'user6',
      name: 'Emily Davis',
      avatar: '/Memoji-06.png'
    },
    amount: 2200,
    currency: 'USDT',
    status: 'resolved' as const,
    priority: 'low' as const,
    category: 'account_issue' as const,
    description: 'Account verification problems during trade',
    createdAt: '2024-01-13T11:20:00Z',
    lastUpdate: '2024-01-14T16:30:00Z',
    assignedTo: 'admin1',
    resolution: 'Trade completed successfully after account verification',
    evidence: [
      { type: 'document' as const, url: '/evidence/kyc-verification.pdf' }
    ],
    messages: [
      {
        id: 'msg4',
        sender: 'David Brown',
        message: 'Having trouble with account verification for this trade',
        timestamp: '2024-01-13T11:20:00Z',
        type: 'user' as const
      },
      {
        id: 'msg5',
        sender: 'Admin Support',
        message: 'We have resolved the verification issue. Trade can proceed.',
        timestamp: '2024-01-14T16:30:00Z',
        type: 'admin' as const
      }
    ]
  },
  {
    id: 'DSP-004',
    tradeId: 'TRD-12348',
    initiatedBy: {
      id: 'user7',
      name: 'Lisa Anderson',
      avatar: '/Memoji-07.png'
    },
    respondent: {
      id: 'user8',
      name: 'Tom Miller',
      avatar: '/Memoji-08.png'
    },
    amount: 900,
    currency: 'USDT',
    status: 'escalated' as const,
    priority: 'high' as const,
    category: 'fraud_suspicion' as const,
    description: 'Suspected fraudulent activity in P2P trade',
    createdAt: '2024-01-12T14:15:00Z',
    lastUpdate: '2024-01-15T12:45:00Z',
    assignedTo: 'admin3',
    evidence: [
      { type: 'screenshot' as const, url: '/evidence/suspicious-activity.png' },
      { type: 'bank_statement' as const, url: '/evidence/bank-statement.pdf' }
    ],
    messages: [
      {
        id: 'msg6',
        sender: 'Lisa Anderson',
        message: 'This user seems suspicious, asking for payment outside the platform',
        timestamp: '2024-01-12T14:15:00Z',
        type: 'user' as const
      }
    ]
  }
];

export default function DisputesPage() {
  const [disputes, setDisputes] = useState(mockDisputes);
  const [filteredDisputes, setFilteredDisputes] = useState(mockDisputes);

  // Stats data for disputes
  const statsData = {
    totalTransactionVolume: 0, // Not relevant for disputes
    totalActiveUsers: 0, // Not relevant for disputes
    totalSuspendedAccounts: 0, // Not relevant for disputes
    pendingKYC: 0, // Not relevant for disputes
    totalWalletBalance: 0 // Not relevant for disputes
  };

  // Custom stats for disputes
  const disputeStats = [
    {
      title: 'Total Disputes',
      value: disputes.length.toString(),
      change: '+5.2%',
      trending: 'up' as const
    },
    {
      title: 'Open Disputes',
      value: disputes.filter(d => d.status === 'open').length.toString(),
      change: '+12.1%',
      trending: 'up' as const
    },
    {
      title: 'Under Review',
      value: disputes.filter(d => d.status === 'under_review').length.toString(),
      change: '-3.4%',
      trending: 'down' as const
    },
    {
      title: 'Resolved',
      value: disputes.filter(d => d.status === 'resolved').length.toString(),
      change: '+8.7%',
      trending: 'up' as const
    },
    {
      title: 'High Priority',
      value: disputes.filter(d => d.priority === 'high').length.toString(),
      change: '+15.6%',
      trending: 'up' as const
    }
  ];

  const handleFilter = (filters: any) => {
    let filtered = [...disputes];

    if (filters.search) {
      filtered = filtered.filter(dispute => 
        dispute.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        dispute.tradeId.toLowerCase().includes(filters.search.toLowerCase()) ||
        dispute.initiatedBy.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        dispute.respondent.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        dispute.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(dispute => dispute.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(dispute => dispute.priority === filters.priority);
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(dispute => dispute.category === filters.category);
    }

    if (filters.dateRange?.from && filters.dateRange?.to) {
      filtered = filtered.filter(dispute => {
        const disputeDate = new Date(dispute.createdAt);
        return disputeDate >= filters.dateRange.from && disputeDate <= filters.dateRange.to;
      });
    }

    setFilteredDisputes(filtered);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Disputes Management</h1>
          <p className="text-gray-600 mt-1">Manage and resolve P2P trading disputes</p>
        </div>
      </div>

      {/* Custom Stats Cards for Disputes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {disputeStats.map((stat) => (
          <div key={stat.title} className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm min-w-0">
            <h3 className="text-xs font-medium text-gray-500 mb-2 truncate">{stat.title}</h3>
            <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 truncate">{stat.value}</p>
            <div className="flex items-center">
              {stat.trending === 'up' ? (
                <svg className="w-3 h-3 md:w-4 md:h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-3 h-3 md:w-4 md:h-4 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <p className={`text-xs ${
                stat.trending === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <DisputesFilter onFilter={handleFilter} />
      <DisputesTable disputes={filteredDisputes} />
    </div>
  );
}