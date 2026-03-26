import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRequestsTrend } from '../../services/analyticsApi';
import { getAnalyticsOverview } from '../../services/analyticsApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { CheckCircle, Clock, Users, AlertTriangle } from 'lucide-react';

export function Analytics() {
  const { data: trend = [], isLoading: trendLoading } = useQuery({
    queryKey: ['requests-trend'],
    queryFn: getRequestsTrend,
    retry: 1,
  });

  const { data: overview } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: getAnalyticsOverview,
    retry: 1,
  });

  const summaryCards = [
    { label: 'Total', value: overview?.totalRequests ?? '—', icon: Users },
    { label: 'Pending', value: overview?.pendingRequests ?? '—', icon: Clock },
    { label: 'Approved', value: overview?.approvedRequests ?? '—', icon: CheckCircle },
    { label: 'Conflicts', value: overview?.totalConflicts ?? '—', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <Icon className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-primary">{value}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requests This Week</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          {trendLoading ? (
            <div className="h-full bg-gray-50 animate-pulse rounded-xl" />
          ) : trend.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              No data yet for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dx={-10} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#000' }}
                />
                <Line type="monotone" dataKey="count" stroke="#000" strokeWidth={3} dot={{ r: 4, fill: '#000' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
