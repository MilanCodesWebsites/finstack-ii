import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock KYC requests - replace with actual API calls
    const kycRequests = [
      {
        id: 'KYC001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        country: 'United States',
        documents: ['passport.pdf', 'utility_bill.pdf'],
        submittedAt: '2024-10-01T14:30:00Z',
        status: 'pending',
        phone: '+1 555 234 8899',
        address: '1024 Market Street, San Francisco, CA',
        documentType: 'Passport'
      },
      {
        id: 'KYC002',
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        country: 'Spain',
        documents: ['id_card.pdf', 'bank_statement.pdf'],
        submittedAt: '2024-10-02T09:15:00Z',
        status: 'pending',
        phone: '+34 612 889 004',
        address: 'Calle de Alcalá 45, Madrid',
        documentType: 'National ID'
      },
      {
        id: 'KYC003',
        name: 'David Chen',
        email: 'david.chen@example.com',
        country: 'Canada',
        documents: ['driver_license.pdf', 'proof_of_address.pdf'],
        submittedAt: '2024-10-03T16:45:00Z',
        status: 'pending',
        phone: '+1 604 555 7711',
        address: '880 Granville Street, Vancouver, BC',
        documentType: 'Driver License'
      }
    ];
    
    return NextResponse.json(kycRequests);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch KYC requests' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
  const { id, action, reason } = await request.json();
    
    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Mock KYC approval/rejection - replace with actual API calls
    if (action === 'reject') {
      console.log(`Rejecting KYC request ${id} | Reason: ${reason || 'None provided'}`);
    } else {
      console.log(`Approving KYC request ${id}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `KYC request ${action}d successfully`,
      reason: reason || null
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process KYC request' },
      { status: 500 }
    );
  }
}