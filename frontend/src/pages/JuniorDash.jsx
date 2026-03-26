import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stats } from '../components/Junior/Stats';
import { RequestsTable } from '../components/Junior/RequestsTable';
import { RequestForm } from '../components/Junior/RequestForm';
import { DepartmentCalendar } from '../components/Junior/DepartmentCalendar';

export function JuniorDash() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Junior Faculty Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your resource requests and track their status.</p>
        </div>
        
        <div className="flex space-x-2 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-white text-primary shadow' : 'text-gray-600 hover:text-primary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'calendar' ? 'bg-white text-primary shadow' : 'text-gray-600 hover:text-primary'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'new' ? 'bg-white text-primary shadow' : 'text-gray-600 hover:text-primary'
            }`}
          >
            New Request
          </button>
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
              <Stats />
              <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-primary">My Recent Requests</h3>
                <RequestsTable />
              </div>
            </div>
          )}
          
          {activeTab === 'calendar' && (
            <div className="max-w-6xl mx-auto">
              <DepartmentCalendar />
            </div>
          )}

          {activeTab === 'new' && (
            <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100 max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold mb-6 text-primary">Create New Resource Request</h3>
              <RequestForm onSuccess={() => setActiveTab('overview')} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
