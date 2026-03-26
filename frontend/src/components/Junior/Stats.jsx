import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRequests } from '../../services/requestApi';
import { Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export function Stats() {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['my-requests'],
    queryFn: getRequests,
    retry: 1,
  });

  const total = requests.length;
  const pending = requests.filter(r => ['submitted', 'checking', 'escalated'].includes(r.status)).length;
  const approved = requests.filter(r => r.status === 'approved').length;
  const rejected = requests.filter(r => r.status === 'rejected').length;

  const cards = [
    { label: 'Total Requests', value: total, icon: Activity, description: 'All time' },
    { label: 'Pending Review', value: pending, icon: Clock, description: 'Awaiting approval' },
    { label: 'Approved', value: approved, icon: CheckCircle, description: 'This semester' },
    { label: 'Rejected', value: rejected, icon: AlertTriangle, description: 'All time' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, description }) => (
        <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft p-5 transition-all duration-300 hover:shadow-lg dark:hover:shadow-white/5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-primary dark:text-white transition-colors duration-300">
            {isLoading ? <span className="animate-pulse text-gray-200 dark:text-gray-700">—</span> : value}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
        </div>
      ))}
    </div>
  );
}
