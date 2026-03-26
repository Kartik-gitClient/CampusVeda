import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemOverview } from '../components/HOD/SystemOverview';
import { ResourceManagement } from '../components/HOD/ResourceManagement';
import { SettingsPanel } from '../components/HOD/SettingsPanel';
import { AuditLog } from '../components/HOD/AuditLog';
import { ConflictAlerts } from '../components/Senior/ConflictAlerts';
import { ApprovalQueue } from '../components/Senior/ApprovalQueue';
import { PremiseSetup } from '../components/HOD/PremiseSetup';

import { cn } from '../utils/cn';
import { Card } from '../components/Card';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-2 pb-10"
    >
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary dark:text-white mb-2">Command Center</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Full visibility and control over campus operations.</p>
        </div>
        
        <div className="flex flex-wrap h-fit p-1 glass rounded-2xl">
          {navs.map(nav => (
             <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                activeTab === nav.id 
                  ? "bg-primary text-white shadow-md shadow-black/10 dark:shadow-white/10" 
                  : "text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {nav.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-8"
        >
          {activeTab === 'overview' && (
            <>
              <SystemOverview />
              <Card className="glass border-white/10">
                <ConflictAlerts />
              </Card>
            </>
          )}
          {activeTab === 'approvals' && (
            <>
              <Card className="glass border-white/10 mb-8">
                <ApprovalQueue />
              </Card>
              <Card className="glass border-white/10">
                <ConflictAlerts />
              </Card>
            </>
          )}
          { activeTab === 'resources' && <ResourceManagement />}
          { activeTab === 'premise' && <PremiseSetup />}
          { activeTab === 'audit' && <AuditLog />}
          { activeTab === 'settings' && <SettingsPanel />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
