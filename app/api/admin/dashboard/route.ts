import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock dashboard stats - replace with actual API calls
    const stats = {
      totalTransactionVolume: 2847392,
      totalActiveUsers: 8432,
      totalSuspendedAccounts: 23,
      pendingKYC: 47,
      totalWalletBalance: 1234567,
      recentTransactions: [
        {
          id: 'TXN001',
          user: 'John Smith',
          type: 'P2P Transfer',
          amount: 500,
          currency: 'USD',
          status: 'Completed',
          date: '2024-10-05T10:30:00Z'
        },
        {
          id: 'TXN002',
          user: 'Jane Doe',
          type: 'Deposit',
          amount: 1000,
          currency: 'NGN',
          status: 'Pending',
          date: '2024-10-05T09:15:00Z'
        },
        {
          id: 'TXN003',
          user: 'Mike Johnson',
          type: 'Withdrawal',
          amount: 750,
          currency: 'EUR',
          status: 'Completed',
          date: '2024-10-05T08:45:00Z'
        }
      ]
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}