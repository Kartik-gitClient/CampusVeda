import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import toast from 'react-hot-toast';

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    whatsappAlerts: true,
    autoDocumentGen: false,
    autoApproveMinor: false,
  });

  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('System settings saved.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Automation & Alerts</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary">WhatsApp Alerts</p>
                <p className="text-sm text-gray-500">Send emergency notifications via WhatsApp</p>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('whatsappAlerts')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.whatsappAlerts ? 'bg-black' : 'bg-gray-200'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.whatsappAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary">Auto Document Generation</p>
                <p className="text-sm text-gray-500">Generate PDF receipts for approved requests</p>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('autoDocumentGen')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.autoDocumentGen ? 'bg-black' : 'bg-gray-200'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.autoDocumentGen ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary">Auto-Approve Minor</p>
                <p className="text-sm text-gray-500">Automatically approve equipment requests under capacity</p>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting('autoApproveMinor')}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.autoApproveMinor ? 'bg-black' : 'bg-gray-200'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.autoApproveMinor ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Emergency Criteria Rules</h3>
            <textarea 
              className="w-full h-24 rounded-2xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-y"
              defaultValue="IF type == 'Room' AND requester == 'Senior Faculty' THEN flag = 'Emergency'"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
