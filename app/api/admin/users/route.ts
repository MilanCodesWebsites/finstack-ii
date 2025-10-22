import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    
    // Mock users data - replace with actual API calls
    let users = [
      {
        id: 'USR001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        country: 'United States',
        balance: 1500.00,
        currency: 'USD',
        kycStatus: 'approved',
        status: 'active',
        joinedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'USR002',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        country: 'Nigeria',
        balance: 250000.00,
        currency: 'NGN',
        kycStatus: 'not_required',
        status: 'active',
        joinedAt: '2024-02-20T14:15:00Z'
      },
      {
        id: 'USR003',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        country: 'United Kingdom',
        balance: 750.00,
        currency: 'GBP',
        kycStatus: 'pending',
        status: 'suspended',
        joinedAt: '2024-03-10T09:45:00Z'
      },
      {
        id: 'USR004',
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@example.com',
        country: 'Nigeria',
        balance: 500000.00,
        currency: 'NGN',
        kycStatus: 'not_required',
        status: 'active',
        joinedAt: '2024-04-05T16:20:00Z'
      }
    ];
    
    // Apply filters
    if (search) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status) {
      users = users.filter(user => user.status === status);
    }
    
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, action } = await request.json();
    
    if (!id || !action || !['suspend', 'activate', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Mock user action - replace with actual API calls
    console.log(`${action} user ${id}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `User ${action}d successfully` 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process user action' },
      { status: 500 }
    );
  }
}