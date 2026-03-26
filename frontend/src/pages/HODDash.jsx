import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemOverview } from '../components/HOD/SystemOverview';
import { ResourceManagement } from '../components/HOD/ResourceManagement';
import { SettingsPanel } from '../components/HOD/SettingsPanel';
import { AuditLog } from '../components/HOD/AuditLog';
import { ConflictAlerts } from '../components/Senior/ConflictAlerts';
import { ApprovalQueue } from '../components/Senior/ApprovalQueue';
import { PremiseSetup } from '../components/HOD/PremiseSetup';

export function HODDash() {
  const [activeTab, setActiveTab] = useState('overview');

  const navs = [
    { id: 'overview', label: 'System Overview' },
    { id: 'approvals', label: 'Approvals' },
    { id: 'resources', label: 'Resources' },
    { id: 'premise', label: 'Premise Setup' },
    { id: 'audit', label: 'Audit Log' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">HOD Dashboard</h1>
          <p className="text-sm text-gray-500">High-level overview, resource management, and system rules.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 rounded-xl bg-gray-100 p-1">
          {navs.map(nav => (
             <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === nav.id ? 'bg-white text-primary shadow' : 'text-gray-600 hover:text-primary'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <SystemOverview />
              <ConflictAlerts />
            </div>
          )}
          {activeTab === 'approvals' && (
            <div className="space-y-6">
              <ApprovalQueue />
              <ConflictAlerts />
            </div>
          )}
          { activeTab === 'resources' && <ResourceManagement />}
          { activeTab === 'premise' && <PremiseSetup />}
          { activeTab === 'audit' && <AuditLog />}
          {activeTab === 'settings' && <SettingsPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
