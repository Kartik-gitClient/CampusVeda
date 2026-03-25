import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';
import { Badge } from '../Badge';
import { format } from 'date-fns';

const mockRequests = [
  { id: 'REQ-001', resource: 'Conference Room A', type: 'Room', date: new Date(), status: 'Approved', priority: 'Normal' },
  { id: 'REQ-002', resource: 'Projector 4K', type: 'Equipment', date: new Date(), status: 'Pending', priority: 'High' },
  { id: 'REQ-003', resource: 'Lab Assistant', type: 'Staff', date: new Date(), status: 'Rejected', priority: 'Normal' },
];

export function RequestsTable() {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return <Badge variant="success">Approved</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      case 'Rejected': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High': return <Badge variant="danger">High</Badge>;
      case 'Emergency': return <Badge variant="danger" className="animate-pulse">Emergency</Badge>;
      default: return <Badge variant="default">Normal</Badge>;
    }
  };

  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Request ID</TableHead>
          <TableHead>Resource</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockRequests.map((req) => (
          <TableRow key={req.id}>
            <TableCell className="font-medium whitespace-nowrap">{req.id}</TableCell>
            <TableCell className="whitespace-nowrap">{req.resource}</TableCell>
            <TableCell className="whitespace-nowrap">{req.type}</TableCell>
            <TableCell className="whitespace-nowrap">{format(req.date, 'MMM dd, yyyy')}</TableCell>
            <TableCell className="whitespace-nowrap">{getPriorityBadge(req.priority)}</TableCell>
            <TableCell className="whitespace-nowrap">{getStatusBadge(req.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
