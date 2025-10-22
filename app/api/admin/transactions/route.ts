import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const type = searchParams.get('type') || '';
    const currency = searchParams.get('currency') || '';
    
    // Mock transactions data - replace with actual API calls
    let transactions = [
      {
        id: 'TXN001',
        user: 'John Smith',
        userEmail: 'john.smith@example.com',
        type: 'P2P Transfer',
        amount: 500,
        currency: 'USD',
        status: 'Completed',
        date: '2024-10-05T10:30:00Z',
        reference: 'REF001'
      },
      {
        id: 'TXN002',
        user: 'Jane Doe',
        userEmail: 'jane.doe@example.com',
        type: 'Deposit',
        amount: 1000,
        currency: 'NGN',
        status: 'Pending',
        date: '2024-10-05T09:15:00Z',
        reference: 'REF002'
      },
      {
        id: 'TXN003',
        user: 'Mike Johnson',
        userEmail: 'mike.johnson@example.com',
        type: 'Withdrawal',
        amount: 750,
        currency: 'EUR',
        status: 'Completed',
        date: '2024-10-05T08:45:00Z',
        reference: 'REF003'
      },
      {
        id: 'TXN004',
        user: 'Ahmed Hassan',
        userEmail: 'ahmed.hassan@example.com',
        type: 'P2P Transfer',
        amount: 25000,
        currency: 'NGN',
        status: 'Completed',
        date: '2024-10-04T15:20:00Z',
        reference: 'REF004'
      },
      {
        id: 'TXN005',
        user: 'Maria Garcia',
        userEmail: 'maria.garcia@example.com',
        type: 'Deposit',
        amount: 2000,
        currency: 'EUR',
        status: 'Failed',
        date: '2024-10-04T12:10:00Z',
        reference: 'REF005'
      }
    ];
    
    // Apply filters
    if (type) {
      transactions = transactions.filter(txn => txn.type === type);
    }
    
    if (currency) {
      transactions = transactions.filter(txn => txn.currency === currency);
    }
    
    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}