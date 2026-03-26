import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stats } from '../components/Junior/Stats';
import { RequestsTable } from '../components/Junior/RequestsTable';
import { RequestForm } from '../components/Junior/RequestForm';
import { DepartmentCalendar } from '../components/Junior/DepartmentCalendar';
import { cn } from '../utils/cn';

import { Card } from '../components/Card';

export function JuniorDash() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-2 pb-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary dark:text-white mb-2">My Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Welcome back! Here's what's happening with your requests.</p>
        </div>
        
        <div className="flex h-12 p-1 glass rounded-2xl">
          {['overview', 'calendar', 'new'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 rounded-xl text-sm font-bold transition-all duration-300 capitalize",
                  activeTab === tab 
                    ? "bg-primary text-white shadow-md shadow-black/10 dark:shadow-white/10 scale-105" 
                    : "text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {tab}
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
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <Stats />
              <Card className="glass border-white/10">
                <h3 className="text-xl font-bold mb-6 text-primary dark:text-white flex items-center">
                  <span className="w-1.5 h-6 bg-primary rounded-full mr-3" />
                  Recent Activity
                </h3>
                <RequestsTable />
              </Card>
            </div>
          )}
          
          {activeTab === 'calendar' && (
            <Card className="glass border-white/10 p-0 overflow-hidden">
              <DepartmentCalendar />
            </Card>
          )}

          {activeTab === 'new' && (
            <Card className="glass border-white/10 max-w-3xl mx-auto !p-10">
              <h3 className="text-2xl font-black mb-8 text-primary dark:text-white">Create Resource Request</h3>
              <RequestForm onSuccess={() => setActiveTab('overview')} />
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
