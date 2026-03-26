import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalyticsOverview, getDepartmentUsage } from '../../services/analyticsApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';

export function SystemOverview() {
  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: getAnalyticsOverview,
    retry: 1,
  });

  const { data: deptUsage = [], isLoading: loadingDept } = useQuery({
    queryKey: ['dept-usage'],
    queryFn: getDepartmentUsage,
    retry: 1,
  });

  const stats = [
    { label: 'Total Requests', value: overview?.totalRequests, icon: Activity },
    { label: 'Pending', value: overview?.pendingRequests, icon: Clock },
    { label: 'Approved', value: overview?.approvedRequests, icon: CheckCircle },
    { label: 'Active Conflicts', value: overview?.totalConflicts, icon: AlertTriangle },
    { label: 'Active Users', value: overview?.totalUsers, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <Icon className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-primary">
              {loadingOverview ? <span className="animate-pulse text-gray-200">—</span> : (value ?? '—')}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Department Usage</h3>
        {loadingDept ? (
          <div className="h-48 bg-gray-50 animate-pulse rounded-xl" />
        ) : deptUsage.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No department data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptUsage} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
