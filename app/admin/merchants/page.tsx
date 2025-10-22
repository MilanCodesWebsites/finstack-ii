'use client';

import { MerchantsTable } from '@/components/admin/MerchantsTable';
import { MerchantsFilter } from '@/components/admin/MerchantsFilter';
import { useState } from 'react';

// Merchant interface to match the component props
interface Merchant {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  country: string;
  status: 'verified' | 'pending' | 'under_review' | 'suspended';
  tier: 'standard' | 'premium' | 'enterprise';
  avatar: string;
  registrationDate: string;
  lastActive: string;
  totalTrades: number;
  totalVolume: number;
  rating: number;
  reviewCount: number;
  paymentMethods: string[];
  verificationDocuments: Array<{
    type: string;
    status: 'approved' | 'pending' | 'under_review' | 'rejected';
    uploadDate: string;
  }>;
  compliance: {
    kycStatus: 'approved' | 'pending' | 'under_review' | 'rejected';
    amlStatus: 'approved' | 'pending' | 'under_review' | 'flagged';
    riskLevel: 'low' | 'medium' | 'high';
  };
  fees: {
    tradingFee: number;
    withdrawalFee: number;
  };
  limits: {
    dailyLimit: number;
    monthlyLimit: number;
  };
  suspensionReason?: string;
}

// Mock data for merchants
const mockMerchants: Merchant[] = [
  {
    id: 'MER-001',
    businessName: 'CryptoTrade Pro',
    ownerName: 'John Smith',
    email: 'john@cryptotradepro.com',
    phone: '+1 234 567 8900',
    country: 'United States',
    status: 'verified' as const,
    tier: 'premium' as const,
    avatar: '/Memoji-01.png',
    registrationDate: '2023-10-15T10:30:00Z',
    lastActive: '2024-01-15T14:20:00Z',
    totalTrades: 1247,
    totalVolume: 2500000,
    rating: 4.8,
    reviewCount: 324,
    paymentMethods: ['Bank Transfer', 'PayPal', 'Zelle'],
    verificationDocuments: [
      { type: 'business_license', status: 'approved' as const, uploadDate: '2023-10-15T10:30:00Z' },
      { type: 'tax_certificate', status: 'approved' as const, uploadDate: '2023-10-15T11:00:00Z' },
      { type: 'bank_statement', status: 'approved' as const, uploadDate: '2023-10-15T11:30:00Z' }
    ],
    compliance: {
      kycStatus: 'approved' as const,
      amlStatus: 'approved' as const,
      riskLevel: 'low' as const
    },
    fees: {
      tradingFee: 0.5,
      withdrawalFee: 10
    },
    limits: {
      dailyLimit: 100000,
      monthlyLimit: 2000000
    }
  },
  {
    id: 'MER-002',
    businessName: 'Global Exchange Hub',
    ownerName: 'Sarah Johnson',
    email: 'sarah@globalexchange.com',
    phone: '+44 20 7946 0958',
    country: 'United Kingdom',
    status: 'pending' as const,
    tier: 'standard' as const,
    avatar: '/Memoji-02.png',
    registrationDate: '2024-01-10T15:45:00Z',
    lastActive: '2024-01-15T09:10:00Z',
    totalTrades: 0,
    totalVolume: 0,
    rating: 0,
    reviewCount: 0,
    paymentMethods: ['Bank Transfer', 'Wise'],
    verificationDocuments: [
      { type: 'business_license', status: 'pending' as const, uploadDate: '2024-01-10T16:00:00Z' },
      { type: 'tax_certificate', status: 'under_review' as const, uploadDate: '2024-01-10T16:30:00Z' }
    ],
    compliance: {
      kycStatus: 'pending' as const,
      amlStatus: 'pending' as const,
      riskLevel: 'medium' as const
    },
    fees: {
      tradingFee: 0.8,
      withdrawalFee: 15
    },
    limits: {
      dailyLimit: 50000,
      monthlyLimit: 1000000
    }
  },
  {
    id: 'MER-003',
    businessName: 'Fast Crypto Solutions',
    ownerName: 'Mike Chen',
    email: 'mike@fastcrypto.com',
    phone: '+65 6123 4567',
    country: 'Singapore',
    status: 'suspended' as const,
    tier: 'standard' as const,
    avatar: '/Memoji-03.png',
    registrationDate: '2023-08-20T11:20:00Z',
    lastActive: '2024-01-12T16:30:00Z',
    totalTrades: 856,
    totalVolume: 1200000,
    rating: 3.2,
    reviewCount: 89,
    paymentMethods: ['Bank Transfer', 'Alipay'],
    verificationDocuments: [
      { type: 'business_license', status: 'approved' as const, uploadDate: '2023-08-20T12:00:00Z' },
      { type: 'tax_certificate', status: 'rejected' as const, uploadDate: '2023-08-20T12:30:00Z' }
    ],
    compliance: {
      kycStatus: 'approved' as const,
      amlStatus: 'flagged' as const,
      riskLevel: 'high' as const
    },
    fees: {
      tradingFee: 0.6,
      withdrawalFee: 12
    },
    limits: {
      dailyLimit: 0,
      monthlyLimit: 0
    },
    suspensionReason: 'Multiple compliance violations detected'
  },
  {
    id: 'MER-004',
    businessName: 'Digital Asset Exchange',
    ownerName: 'Emma Wilson',
    email: 'emma@digitalasset.com',
    phone: '+1 555 123 4567',
    country: 'Canada',
    status: 'verified' as const,
    tier: 'enterprise' as const,
    avatar: '/Memoji-04.png',
    registrationDate: '2023-05-12T14:15:00Z',
    lastActive: '2024-01-15T12:45:00Z',
    totalTrades: 3421,
    totalVolume: 8900000,
    rating: 4.9,
    reviewCount: 1247,
    paymentMethods: ['Bank Transfer', 'Interac', 'Wire Transfer'],
    verificationDocuments: [
      { type: 'business_license', status: 'approved' as const, uploadDate: '2023-05-12T15:00:00Z' },
      { type: 'tax_certificate', status: 'approved' as const, uploadDate: '2023-05-12T15:30:00Z' },
      { type: 'bank_statement', status: 'approved' as const, uploadDate: '2023-05-12T16:00:00Z' },
      { type: 'audit_report', status: 'approved' as const, uploadDate: '2023-05-12T16:30:00Z' }
    ],
    compliance: {
      kycStatus: 'approved' as const,
      amlStatus: 'approved' as const,
      riskLevel: 'low' as const
    },
    fees: {
      tradingFee: 0.3,
      withdrawalFee: 5
    },
    limits: {
      dailyLimit: 500000,
      monthlyLimit: 10000000
    }
  },
  {
    id: 'MER-005',
    businessName: 'Blockchain Traders Inc',
    ownerName: 'David Rodriguez',
    email: 'david@blockchaintraders.com',
    phone: '+34 91 123 4567',
    country: 'Spain',
    status: 'under_review' as const,
    tier: 'standard' as const,
    avatar: '/Memoji-05.png',
    registrationDate: '2024-01-08T09:30:00Z',
    lastActive: '2024-01-14T18:20:00Z',
    totalTrades: 23,
    totalVolume: 45000,
    rating: 4.1,
    reviewCount: 12,
    paymentMethods: ['Bank Transfer', 'SEPA'],
    verificationDocuments: [
      { type: 'business_license', status: 'approved' as const, uploadDate: '2024-01-08T10:00:00Z' },
      { type: 'tax_certificate', status: 'under_review' as const, uploadDate: '2024-01-08T10:30:00Z' },
      { type: 'bank_statement', status: 'pending' as const, uploadDate: '2024-01-08T11:00:00Z' }
    ],
    compliance: {
      kycStatus: 'approved' as const,
      amlStatus: 'under_review' as const,
      riskLevel: 'medium' as const
    },
    fees: {
      tradingFee: 0.7,
      withdrawalFee: 15
    },
    limits: {
      dailyLimit: 25000,
      monthlyLimit: 500000
    }
  }
] as const satisfies Merchant[];

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants);
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>(mockMerchants);

  // Custom stats for merchants
  const merchantStats = [
    {
      title: 'Total Merchants',
      value: merchants.length.toString(),
      change: '+12.5%',
      trending: 'up' as const
    },
    {
      title: 'Verified Merchants',
      value: merchants.filter(m => m.status === 'verified').length.toString(),
      change: '+8.2%',
      trending: 'up' as const
    },
    {
      title: 'Pending Verification',
      value: merchants.filter(m => m.status === 'pending' || m.status === 'under_review').length.toString(),
      change: '+15.3%',
      trending: 'up' as const
    },
    {
      title: 'Suspended',
      value: merchants.filter(m => m.status === 'suspended').length.toString(),
      change: '-5.1%',
      trending: 'down' as const
    },
    {
      title: 'Total Trading Volume',
      value: `$${(merchants.reduce((sum, m) => sum + m.totalVolume, 0) / 1000000).toFixed(1)}M`,
      change: '+18.7%',
      trending: 'up' as const
    }
  ];

  const handleFilter = (filters: any) => {
    let filtered = [...merchants];

    if (filters.search) {
      filtered = filtered.filter(merchant => 
        merchant.businessName.toLowerCase().includes(filters.search.toLowerCase()) ||
        merchant.ownerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        merchant.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        merchant.id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(merchant => merchant.status === filters.status);
    }

    if (filters.tier && filters.tier !== 'all') {
      filtered = filtered.filter(merchant => merchant.tier === filters.tier);
    }

    if (filters.country && filters.country !== 'all') {
      filtered = filtered.filter(merchant => merchant.country === filters.country);
    }

    if (filters.riskLevel && filters.riskLevel !== 'all') {
      filtered = filtered.filter(merchant => merchant.compliance.riskLevel === filters.riskLevel);
    }

    if (filters.dateRange?.from && filters.dateRange?.to) {
      filtered = filtered.filter(merchant => {
        const merchantDate = new Date(merchant.registrationDate);
        return merchantDate >= filters.dateRange.from && merchantDate <= filters.dateRange.to;
      });
    }

    setFilteredMerchants(filtered);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Merchants Management</h1>
          <p className="text-gray-600 mt-1">Manage merchant accounts and verification status</p>
        </div>
      </div>

      {/* Custom Stats Cards for Merchants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {merchantStats.map((stat) => (
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

      <MerchantsFilter onFilter={handleFilter} />
      <MerchantsTable merchants={filteredMerchants} />
    </div>
  );
}