import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';
import { format } from 'date-fns';

const mockLogs = [
  { id: 1, user: 'Dr. Smith', action: 'Approved Request', entity: 'REQ-011', time: new Date(Date.now() - 1000000) },
  { id: 2, user: 'System', action: 'Conflict Detected', entity: 'CONF-01', time: new Date(Date.now() - 5000000) },
  { id: 3, user: 'HOD', action: 'Updated Settings', entity: 'Auto-Approve', time: new Date(Date.now() - 9000000) },
  { id: 4, user: 'John Doe', action: 'Submitted Request', entity: 'REQ-013', time: new Date(Date.now() - 15000000) },
];

export function AuditLog() {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary">Audit Log</h2>
        <p className="text-sm text-gray-500">System-wide activity tracker.</p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLogs.map(log => (
            <TableRow key={log.id}>
              <TableCell className="font-medium whitespace-nowrap">{log.user}</TableCell>
              <TableCell className="whitespace-nowrap">{log.action}</TableCell>
              <TableCell className="whitespace-nowrap">{log.entity}</TableCell>
              <TableCell className="whitespace-nowrap">{format(log.time, 'PP pp')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
