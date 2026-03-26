import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApprovalQueue } from '../components/Senior/ApprovalQueue';
import { ConflictAlerts } from '../components/Senior/ConflictAlerts';
import { Analytics } from '../components/Senior/Analytics';

const TABS = [
  { id: 'queue', label: 'Approval Queue' },
  { id: 'conflicts', label: 'Conflicts' },
  { id: 'analytics', label: 'Analytics' },
];

export function SeniorDash() {
  const [activeTab, setActiveTab] = useState('queue');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary dark:text-white transition-colors duration-300">Senior Faculty Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review pending requests, resolve conflicts, and track analytics.</p>
        </div>

        <div className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 transition-colors duration-300">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white'
              }`}
            >
              {tab.label}
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
          {activeTab === 'queue' && <ApprovalQueue />}
          {activeTab === 'conflicts' && <ConflictAlerts />}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <Analytics />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
