import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRequests } from '../../services/requestApi';
import { processApproval } from '../../services/approvalApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { format } from 'date-fns';
import { Check, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PRIORITY_VARIANT = { High: 'danger', Emergency: 'danger', Normal: 'default' };

export function ApprovalQueue() {
  const queryClient = useQueryClient();
  const [selectedReq, setSelectedReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['all-requests'],
    queryFn: getRequests,
    retry: 1,
  });

  const pendingRequests = requests.filter(r => ['submitted', 'checking'].includes(r.status));

  const { mutate: doApproval, isPending } = useMutation({
    mutationFn: ({ id, action, reason }) => processApproval(id, { action, reason }),
    onSuccess: (_, { action }) => {
      toast.success(`Request ${action} successfully.`);
      queryClient.invalidateQueries({ queryKey: ['all-requests'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
      setSelectedReq(null);
      setRejectReason('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Action failed.');
    },
  });

  const handleAction = (action) => {
    if (action === 'rejected' && !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection.');
      return;
    }
    doApproval({ id: selectedReq._id, action, reason: rejectReason });
  };

  if (isLoading) return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 space-y-2">
      {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-primary">Pending Approvals</h2>
          <p className="text-sm text-gray-500">Review and action incoming resource requests.</p>
        </div>
        <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{pendingRequests.length} pending</span>
      </div>

      {!pendingRequests.length ? (
        <p className="text-sm text-gray-400 py-8 text-center">All clear! No pending requests.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingRequests.map(req => (
              <TableRow key={req._id}>
                <TableCell className="font-medium whitespace-nowrap">{req.requester?.name || '—'}</TableCell>
                <TableCell className="whitespace-nowrap">{req.resourceName}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {req.startDate ? format(new Date(req.startDate), 'MMM dd, yyyy') : '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={PRIORITY_VARIANT[req.priority] || 'default'} className={req.priority === 'Emergency' ? 'animate-pulse' : ''}>
                    {req.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => setSelectedReq(req)}>Review</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={!!selectedReq} onClose={() => { setSelectedReq(null); setRejectReason(''); }} title="Review Request">
        {selectedReq && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
              <div><span className="text-gray-500">Requester:</span><p className="font-medium">{selectedReq.requester?.name}</p></div>
              <div><span className="text-gray-500">Resource:</span><p className="font-medium">{selectedReq.resourceName}</p></div>
              <div><span className="text-gray-500">Type:</span><p className="font-medium">{selectedReq.type}</p></div>
              <div><span className="text-gray-500">Priority:</span><p className="font-medium">{selectedReq.priority}</p></div>
              <div className="col-span-2"><span className="text-gray-500">Purpose:</span><p className="font-medium">{selectedReq.purpose}</p></div>
            </div>

            {selectedReq.priority === 'Emergency' && (
              <div className="flex items-center p-3 text-red-700 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="font-medium text-sm">Emergency Priority — Requires Immediate Review</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-primary">Rejection Reason (required if rejecting)</label>
              <textarea
                className="w-full mt-1 rounded-xl border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-y"
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Optional for approval, required for rejection"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={() => handleAction('rejected')}
                isLoading={isPending}
                className="text-red-600 hover:bg-red-50 border border-red-200"
              >
                <X className="w-4 h-4 mr-1" /> Reject
              </Button>
              <Button onClick={() => handleAction('approved')} isLoading={isPending}>
                <Check className="w-4 h-4 mr-1" /> Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
