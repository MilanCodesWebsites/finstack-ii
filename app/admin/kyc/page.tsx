'use client';

import { useEffect, useState } from 'react';
// import { KYCRequestsTable } from '@/components/admin/KYCRequestsTable';
import { KYCOverview } from '@/components/admin/KYCOverview';

interface KYCRequest {
  id: string;
  name: string;
  legalName: string; // Full legal name as on ID
  email: string;
  country: string;
  documents: string[];
  frontIdImage?: string; // Front of ID document
  backIdImage?: string; // Back of ID document
  submittedAt: string;
  status: string;
  phone?: string;
  address?: string;
  documentType?: string;
}

export default function KYCPage() {
  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // First try to load from localStorage
        const localRequests = localStorage.getItem('kyc-requests');
        if (localRequests) {
          const parsedRequests = JSON.parse(localRequests);
          setRequests(parsedRequests);
          setLoading(false);
          return;
        }

        // If no local requests, try API
        const response = await fetch('/api/admin/kyc');
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        }
      } catch (error) {
        console.error('Failed to fetch KYC requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // Set up polling to check for new requests every 5 seconds
    const interval = setInterval(() => {
      const localRequests = localStorage.getItem('kyc-requests');
      if (localRequests) {
        setRequests(JSON.parse(localRequests));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const approve = async (id: string) => {
    try {
      // Update localStorage
      const localRequests = localStorage.getItem('kyc-requests');
      if (localRequests) {
        const parsedRequests = JSON.parse(localRequests);
        const updatedRequests = parsedRequests.filter((r: KYCRequest) => r.id !== id);
        localStorage.setItem('kyc-requests', JSON.stringify(updatedRequests));
        
        // Update user KYC status to approved
        const userStatus = {
          status: 'approved',
          approvedAt: new Date().toISOString(),
        };
        localStorage.setItem('user-kyc-status', JSON.stringify(userStatus));
        
        setRequests(updatedRequests);
        return;
      }

      // Try API
      const response = await fetch('/api/admin/kyc', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'approve' }),
      });
      if (response.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) {
      console.error('Approve failed', e);
    }
  };

  const reject = async (id: string, reason: string) => {
    try {
      // Update localStorage
      const localRequests = localStorage.getItem('kyc-requests');
      if (localRequests) {
        const parsedRequests = JSON.parse(localRequests);
        const updatedRequests = parsedRequests.filter((r: KYCRequest) => r.id !== id);
        localStorage.setItem('kyc-requests', JSON.stringify(updatedRequests));
        
        // Update user KYC status to rejected with reason
        const userStatus = {
          status: 'rejected',
          rejectionReason: reason,
          rejectedAt: new Date().toISOString(),
        };
        localStorage.setItem('user-kyc-status', JSON.stringify(userStatus));
        
        setRequests(updatedRequests);
        return;
      }

      // Try API
      const response = await fetch('/api/admin/kyc', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'reject', reason }),
      });
      if (response.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) {
      console.error('Reject failed', e);
    }
  };

  const suspend = async (id: string, reason: string) => {
    try {
      // Update localStorage
      const localRequests = localStorage.getItem('kyc-requests');
      if (localRequests) {
        const parsedRequests = JSON.parse(localRequests);
        const updatedRequests = parsedRequests.map((r: KYCRequest) => {
          if (r.id === id) {
            return { ...r, status: 'suspended' };
          }
          return r;
        });
        localStorage.setItem('kyc-requests', JSON.stringify(updatedRequests));
        
        // Update user KYC status to suspended with reason
        const userStatus = {
          status: 'suspended',
          suspensionReason: reason,
          suspendedAt: new Date().toISOString(),
        };
        localStorage.setItem('user-kyc-status', JSON.stringify(userStatus));
        
        setRequests(updatedRequests);
        return;
      }

      // Try API
      const response = await fetch('/api/admin/kyc', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'suspend', reason }),
      });
      if (response.ok) {
        setRequests(prev => prev.map(r => {
          if (r.id === id) {
            return { ...r, status: 'suspended' };
          }
          return r;
        }));
      }
    } catch (e) {
      console.error('Suspend failed', e);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">KYC Requests</h1>
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">KYC Requests</h1>
        <div className="text-xs md:text-sm text-gray-600">
          {requests.length} pending request{requests.length !== 1 ? 's' : ''}
        </div>
      </div>
      <KYCOverview records={requests} onApprove={approve} onReject={reject} onSuspend={suspend} />
    </div>
  );
}