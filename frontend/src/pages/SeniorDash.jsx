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

import { cn } from '../utils/cn';
import { Card } from '../components/Card';

export function SeniorDash() {
  const [activeTab, setActiveTab] = useState('queue');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-2 pb-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary dark:text-white mb-2">Faculty Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Review, resolve, and optimize department resources.</p>
        </div>

        <div className="flex h-12 p-1 glass rounded-2xl">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 rounded-xl text-sm font-bold transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-md shadow-black/10 dark:shadow-white/10" 
                  : "text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {tab.label}
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
        >
          {activeTab === 'queue' && <ApprovalQueue />}
          {activeTab === 'conflicts' && <ConflictAlerts />}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <Analytics />
              </div>
              <Card className="glass border-white/10 h-fit">
                 <h4 className="font-bold text-primary dark:text-white mb-4">Quick Insights</h4>
                 <p className="text-sm text-gray-400">Review the weekly resource utilization trends to optimize scheduling.</p>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
