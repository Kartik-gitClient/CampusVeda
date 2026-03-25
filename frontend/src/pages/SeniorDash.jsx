import React from 'react';
import { ApprovalQueue } from '../components/Senior/ApprovalQueue';
import { ConflictAlerts } from '../components/Senior/ConflictAlerts';
import { Analytics } from '../components/Senior/Analytics';

export function SeniorDash() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Senior Faculty Dashboard</h1>
          <p className="text-sm text-gray-500">Review pending requests, resolve conflicts, and track analytics.</p>
        </div>
      </div>

      <ConflictAlerts />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <ApprovalQueue />
        </div>
        <div className="xl:col-span-1">
          <Analytics />
        </div>
      </div>
    </div>
  );
}
