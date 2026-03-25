import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { format } from 'date-fns';
import { Check, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const mockQueue = [
  { id: 'REQ-011', resource: 'Lab 3', type: 'Room', requester: 'Dr. Smith', date: new Date(), priority: 'Normal', status: 'Pending' },
  { id: 'REQ-012', resource: 'Microscopes (x4)', type: 'Equipment', requester: 'Prof. Davis', date: new Date(), priority: 'High', status: 'Pending' },
  { id: 'REQ-013', resource: 'Auditorium', type: 'Room', requester: 'John Doe', date: new Date(), priority: 'Emergency', status: 'Pending' },
];

export function ApprovalQueue() {
  const [selectedReq, setSelectedReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleAction = (action) => {
    if (action === 'Reject' && !rejectReason) {
      toast.error('Please provide a reason for rejection.');
      return;
    }
    toast.success(`Request ${selectedReq.id} ${action.toLowerCase()}ed successfully.`);
    setSelectedReq(null);
    setRejectReason('');
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High': return <Badge variant="danger">High</Badge>;
      case 'Emergency': return <Badge variant="danger" className="animate-pulse">Emergency</Badge>;
      default: return <Badge variant="default">Normal</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-primary">Pending Approvals</h2>
          <p className="text-sm text-gray-500">Review and action incoming resource requests.</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockQueue.map(req => (
            <TableRow key={req.id}>
              <TableCell className="font-medium whitespace-nowrap">{req.id}</TableCell>
              <TableCell className="whitespace-nowrap">{req.requester}</TableCell>
              <TableCell className="whitespace-nowrap">{req.resource}</TableCell>
              <TableCell className="whitespace-nowrap">{format(req.date, 'MMM dd, yyyy')}</TableCell>
              <TableCell className="whitespace-nowrap">{getPriorityBadge(req.priority)}</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <Button size="sm" variant="ghost" onClick={() => setSelectedReq(req)}>Review</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={!!selectedReq} onClose={() => setSelectedReq(null)} title="Review Request">
        {selectedReq && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
              <div>
                <span className="text-gray-500">Request ID:</span>
                <p className="font-medium text-primary">{selectedReq.id}</p>
              </div>
              <div>
                <span className="text-gray-500">Requester:</span>
                <p className="font-medium text-primary">{selectedReq.requester}</p>
              </div>
              <div>
                <span className="text-gray-500">Resource:</span>
                <p className="font-medium text-primary">{selectedReq.resource}</p>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <p className="font-medium text-primary">{selectedReq.type}</p>
              </div>
            </div>
            
            {selectedReq.priority === 'Emergency' && (
              <div className="flex items-center p-3 text-red-700 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium text-sm">Emergency Priority - Requires Immediate Review</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-primary">Rejection Reason (if rejecting)</label>
              <textarea 
                className="w-full mt-1 rounded-xl border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-y"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Optional for approval, required for rejection"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="danger" onClick={() => handleAction('Reject')} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200">
                <X className="w-4 h-4 mr-1" /> Reject
              </Button>
              <Button onClick={() => handleAction('Approve')}>
                <Check className="w-4 h-4 mr-1" /> Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
