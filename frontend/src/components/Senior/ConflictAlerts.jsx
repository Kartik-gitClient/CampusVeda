import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConflicts, resolveConflict } from '../../services/conflictApi';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SEVERITY_VARIANT = { major: 'danger', normal: 'warning', minor: 'default' };

export function ConflictAlerts() {
  const queryClient = useQueryClient();

  const { data: conflicts = [], isLoading } = useQuery({
    queryKey: ['conflicts'],
    queryFn: getConflicts,
    retry: 1,
  });

  const { mutate: resolve, isPending } = useMutation({
    mutationFn: (id) => resolveConflict(id, { resolution: 'Manually resolved by senior' }),
    onSuccess: () => {
      toast.success('Conflict resolved.');
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
    },
    onError: () => toast.error('Failed to resolve conflict.'),
  });

  if (isLoading) return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 space-y-3">
      {[...Array(2)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-primary">Active Conflicts</h2>
        <Badge variant={conflicts.length ? 'danger' : 'success'}>
          {conflicts.length} active
        </Badge>
      </div>

      {!conflicts.length ? (
        <div className="flex items-center text-green-600 py-4 gap-2">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">No active conflicts. All clear!</span>
        </div>
      ) : (
        <div className="space-y-3">
          {conflicts.map(conflict => (
            <div key={conflict._id} className="flex items-start justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 gap-4">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${conflict.severity === 'major' ? 'text-red-500' : 'text-yellow-500'}`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-primary">{conflict.type}</span>
                    <Badge variant={SEVERITY_VARIANT[conflict.severity]}>{conflict.severity}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{conflict.description}</p>
                  {conflict.suggestions && conflict.suggestions.length > 0 && (
                    <div className="mt-3 text-sm bg-blue-50 text-blue-800 p-2.5 rounded-lg flex items-start gap-2 border border-blue-100 shadow-sm">
                      <span className="font-bold whitespace-nowrap">✨ AI Suggestion:</span>
                      <span>{conflict.suggestions[0]}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => resolve(conflict._id)}
                isLoading={isPending}
                className="whitespace-nowrap"
              >
                Resolve
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
