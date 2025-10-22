'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, ShieldCheck, ShieldX, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface KYCRecord {
  id: string;
  name: string;
  legalName: string; // Full legal name as on ID
  email: string;
  phone?: string;
  address?: string;
  documentType?: string;
  frontIdImage?: string; // Front of ID document
  backIdImage?: string; // Back of ID document
  submittedAt: string;
  status: string;
  documents: string[]; // For now just names
}

interface KYCOverviewProps {
  records: KYCRecord[];
  onApprove: (id: string) => Promise<void> | void;
  onReject: (id: string, reason: string) => Promise<void> | void;
}

export function KYCOverview({ records, onApprove, onReject }: KYCOverviewProps) {
  const [selected, setSelected] = useState<KYCRecord | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const docPlaceholders = [
    'https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/54442942-a17a-428e-bfd7-74d74efedf16-pexels-n-voitkevich-6837777.jpg',
    'https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/94907830-5b4c-48a9-a8b9-1978d3c1fc14-pexels-suzyhazelwood-2022077.jpg'
  ];

  const openRecord = (rec: KYCRecord) => {
    setSelected(rec);
  };

  const handleApprove = async () => {
    if (!selected) return;
    setProcessing(true);
    try {
      await onApprove(selected.id);
      toast({
        title: 'KYC Approved',
        description: `${selected.name}'s verification has been approved.`
      });
      setSelected(null);
    } catch (e) {
      toast({
        title: 'Approval Failed',
        description: 'There was an issue approving this KYC request.',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    if (!reason.trim()) return;
    setProcessing(true);
    try {
      const r = reason.trim();
      await onReject(selected.id, r);
      toast({
        title: 'KYC Rejected',
        description: `${selected.name}'s verification was rejected.`
      });
      setReason('');
      setRejectOpen(false);
      setSelected(null);
    } catch (e) {
      toast({
        title: 'Rejection Failed',
        description: 'There was an issue rejecting this KYC request.',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    <FileText className="w-3 h-3" /> {r.documentType || 'ID Document'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(r.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    r.status === 'pending' && 'bg-yellow-50 text-yellow-700',
                    r.status === 'approved' && 'bg-green-50 text-green-700',
                    r.status === 'rejected' && 'bg-red-50 text-red-700'
                  )}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="hover:bg-gray-100" onClick={() => openRecord(r)}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button size="sm" className="bg-[#2F67FA] hover:bg-[#2F67FA]/90 text-white" onClick={() => openRecord(r)}>
                      Manage
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View/Manage Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && !processing && setSelected(null)}>
        <DialogContent className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {selected && (
            <>
              <div className="space-y-6">
                <DialogHeader className="space-y-1">
                  <DialogTitle className="text-xl font-semibold tracking-tight">KYC Details</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    Review the submitted identity information before taking action.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium text-gray-900">{selected.name}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">Legal Name (as on ID)</p>
                    <p className="font-medium text-gray-900">{selected.legalName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{selected.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{selected.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">Address</p>
                    <p className="font-medium text-gray-900 leading-snug max-w-xs">{selected.address || '—'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button disabled={processing} onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Approve
                    </Button>
                    <Button disabled={processing} onClick={() => setRejectOpen(true)} variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <ShieldX className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase text-gray-500 tracking-wide">Submitted Documents</p>
                
                {/* Front and Back ID Images */}
                <div className="space-y-3">
                  {selected.frontIdImage && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">ID Front</p>
                      <div className="group relative rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={selected.frontIdImage}
                          alt="ID Front"
                          className="w-full h-48 object-cover cursor-pointer group-hover:scale-[1.01] transition-transform"
                          onClick={() => window.open(selected.frontIdImage, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    </div>
                  )}
                  
                  {selected.backIdImage && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">ID Back</p>
                      <div className="group relative rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={selected.backIdImage}
                          alt="ID Back"
                          className="w-full h-48 object-cover cursor-pointer group-hover:scale-[1.01] transition-transform"
                          onClick={() => window.open(selected.backIdImage, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    </div>
                  )}
                  
                  {/* Fallback to old documents array if new fields not present */}
                  {!selected.frontIdImage && !selected.backIdImage && docPlaceholders.map((src, idx) => (
                    <div key={idx} className="group relative rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={src}
                        alt={`Document ${idx + 1}`}
                        className="w-full h-52 object-cover cursor-pointer group-hover:scale-[1.01] transition-transform"
                        onClick={() => window.open(src, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ))}
                </div>
                
                <p className="text-[11px] text-gray-400">Click any document to open full size in a new tab.</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Modal */}
      <Dialog open={rejectOpen} onOpenChange={(o) => !o && !processing && setRejectOpen(o)}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Reject KYC Request</DialogTitle>
            <DialogDescription>Provide a clear reason for rejection. This will be sent to the user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Reason for rejection (e.g., Document is blurry, mismatch in details, incomplete submission)"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter className="flex gap-3 pt-2">
            <Button variant="outline" disabled={processing} onClick={() => { setReason(''); setRejectOpen(false); }}>Cancel</Button>
            <Button disabled={!reason.trim() || processing} onClick={handleReject} className="bg-red-600 hover:bg-red-700 text-white">Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
