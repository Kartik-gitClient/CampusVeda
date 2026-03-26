import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPremise, updatePremise } from '../../services/premiseApi';
import { Input } from '../Input';
import { Button } from '../Button';
import toast from 'react-hot-toast';
import { Building2, Plus, Info } from 'lucide-react';

export function PremiseSetup() {
  const queryClient = useQueryClient();
  const { data: premise, isLoading } = useQuery({
    queryKey: ['premise'],
    queryFn: getPremise
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  React.useEffect(() => {
    if (premise) {
      reset(premise);
    }
  }, [premise, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: updatePremise,
    onSuccess: () => {
      toast.success('Building dimensions updated and rooms generated!');
      queryClient.invalidateQueries({ queryKey: ['premise'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['public-resources'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update dimensions.');
    }
  });

  const onSubmit = (data) => {
    const formattedData = {
      totalRooms: parseInt(data.totalRooms) || 0,
      classRooms: parseInt(data.classRooms) || 0,
      seminarHalls: parseInt(data.seminarHalls) || 0,
      staffRooms: parseInt(data.staffRooms) || 0,
      miscRooms: parseInt(data.miscRooms) || 0,
    };
    mutate(formattedData);
  };

  if (isLoading) return <div className="p-8"><div className="h-64 bg-gray-100 animate-pulse rounded-3xl" /></div>;

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
      <div className="bg-primary/5 p-8 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Premise Configuration</h2>
        </div>
        <p className="text-gray-500">Define the building dimensions. This will automatically generate room resources for the platform.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">General</h3>
            <Input 
              label="Total Capacity (Rooms)" 
              type="number" 
              {...register('totalRooms', { required: true })} 
              error={errors.totalRooms && 'Required'}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Academic Spaces</h3>
            <Input 
              label="No. of Classrooms" 
              type="number" 
              {...register('classRooms')} 
            />
            <Input 
              label="No. of Seminar Halls" 
              type="number" 
              {...register('seminarHalls')} 
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Other Spaces</h3>
            <Input 
              label="No. of Staff Rooms" 
              type="number" 
              {...register('staffRooms')} 
            />
            <Input 
              label="No. of Misc. Rooms" 
              type="number" 
              {...register('miscRooms')} 
            />
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 items-start">
          <Info className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Important Note:</p>
            <p>Increasing counts will automatically generate new Room resources. Decreasing counts will mark excess rooms as inactive but will not delete historical request data.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button type="submit" isLoading={isPending} className="px-8 py-6 rounded-2xl text-lg">
            Save & Generate Premise
          </Button>
        </div>
      </form>
    </div>
  );
}
