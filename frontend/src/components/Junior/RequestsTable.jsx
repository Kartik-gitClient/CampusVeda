import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRequests, escalateRequest } from '../../services/requestApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { ArrowUpCircle } from 'lucide-react';

const STATUS_VARIANTS = {
  submitted: 'default',
  checking: 'default',
  approved: 'success',
  rejected: 'danger',
  escalated: 'warning',
  resolved: 'success',
  draft: 'default',
};

export function RequestsTable() {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ['my-requests'],
    queryFn: getRequests,
    retry: 1,
  });

  const { mutate: doEscalate, isPending } = useMutation({
    mutationFn: escalateRequest,
    onSuccess: () => {
      toast.success('Request escalated to HOD.');
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Escalation failed.'),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500 py-4">Failed to load requests. Please refresh.</p>;
  }

  if (!requests.length) {
    return <p className="text-sm text-gray-400 py-6 text-center">No requests yet. Create your first request above!</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Resource</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map(req => (
          <TableRow key={req._id}>
            <TableCell className="font-medium whitespace-nowrap">{req.type}</TableCell>
            <TableCell className="whitespace-nowrap">{req.resourceName}</TableCell>
            <TableCell className="whitespace-nowrap">
              {req.startDate ? format(new Date(req.startDate), 'MMM dd, yyyy') : '—'}
            </TableCell>
            <TableCell className="whitespace-nowrap">{req.priority}</TableCell>
            <TableCell className="whitespace-nowrap">
              <Badge variant={STATUS_VARIANTS[req.status] || 'default'}>
                {req.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              {['submitted', 'checking'].includes(req.status) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => doEscalate(req._id)}
                  isLoading={isPending}
                  title="Escalate to HOD"
                  className="text-xs"
                >
                  <ArrowUpCircle className="h-3.5 w-3.5 mr-1" />
                  Escalate
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
