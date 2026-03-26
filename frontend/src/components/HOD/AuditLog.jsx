import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '../../services/auditApi';
import { format } from 'date-fns';
import { Shield } from 'lucide-react';

export function AuditLog() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: getAuditLogs,
    retry: 1,
  });

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-primary">System Audit Trail</h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No audit logs yet. Actions will appear here.</p>
      ) : (
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
          {logs.map(log => (
            <div key={log._id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-primary">
                {log.actor?.name?.[0] || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  <span className="text-gray-700">{log.actor?.name || 'System'}</span>
                  {' '}<span className="text-gray-500">—</span>{' '}
                  {log.action} on <span className="font-semibold">{log.entity}</span>
                </p>
                <p className="text-xs text-gray-400">{format(new Date(log.createdAt || Date.now()), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <span className="flex-shrink-0 text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded-full">
                {log.actor?.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
