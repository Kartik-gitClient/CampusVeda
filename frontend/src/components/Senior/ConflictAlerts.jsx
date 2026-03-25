import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';

const mockConflicts = [
  { id: 'CONF-01', type: 'Double Booking', resource: 'Auditorium', severity: 'High', description: 'Two emergency requests overlapping.' },
  { id: 'CONF-02', type: 'Capacity Exceeded', resource: 'Lab 3', severity: 'Medium', description: 'Requested capacity (45) exceeds limit (30).' },
];

export function ConflictAlerts() {
  if (mockConflicts.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {mockConflicts.map(conflict => (
        <div key={conflict.id} className="flex items-center justify-between p-4 bg-white border-l-4 border-red-500 rounded-r-2xl shadow-soft border-y border-r border-y-gray-100 border-r-gray-100">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h4 className="font-semibold text-primary">{conflict.type}: {conflict.resource}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                conflict.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {conflict.severity}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 ml-7">{conflict.description}</p>
          </div>
          <button className="flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Resolve <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      ))}
    </div>
  );
}
