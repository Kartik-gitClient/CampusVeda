import React from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { Card } from '../Card';

export function Stats() {
  const stats = [
    { title: 'Total Requests', value: 12, icon: FileText, color: 'text-gray-900', bg: 'bg-gray-100' },
    { title: 'Pending Approval', value: 3, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Approved', value: 8, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="flex flex-row items-center p-6">
            <div className={`mr-4 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h4 className="text-2xl font-bold text-primary">{stat.value}</h4>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
