import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings } from '../../services/settingsApi';
import { useForm } from 'react-hook-form';
import { Button } from '../Button';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon } from 'lucide-react';

export function SettingsPanel() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    retry: 1,
  });

  const { register, handleSubmit, reset } = useForm();

  React.useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const { mutate: save, isPending } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success('Settings saved successfully.');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: () => toast.error('Failed to save settings.'),
  });

  if (isLoading) return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-primary">System Settings</h2>
      </div>

      <form onSubmit={handleSubmit(save)} className="space-y-6">
        <div className="space-y-4">
          {[
            { name: 'whatsappAlerts', label: 'WhatsApp Notifications', desc: 'Send alerts via WhatsApp to faculty members' },
            { name: 'autoDocumentGen', label: 'Auto Document Generation', desc: 'Automatically generate approval letters' },
            { name: 'autoApproveMinor', label: 'Auto-Approve Minor Requests', desc: 'Approve low-priority requests automatically' },
          ].map(({ name, label, desc }) => (
            <label key={name} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
              <div>
                <p className="text-sm font-medium text-primary">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <input type="checkbox" {...register(name)} className="h-4 w-4 rounded accent-black mt-0.5 flex-shrink-0" />
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Criteria Rule</label>
          <textarea
            {...register('emergencyCriteria')}
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isPending}>Save Settings</Button>
        </div>
      </form>
    </div>
  );
}
