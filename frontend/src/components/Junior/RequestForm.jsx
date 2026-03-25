import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button } from '../Button';
import { Input } from '../Input';
import { cn } from '../../utils/cn';

const requestSchema = z.object({
  type: z.string().min(1, 'Request Type is required'),
  resourceName: z.string().min(1, 'Resource Name is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1').optional(),
  equipmentNeeded: z.string().optional(),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().min(1, 'End Date is required'),
  purpose: z.string().min(5, 'Purpose must be at least 5 characters'),
  priority: z.string().min(1, 'Priority is required'),
  notes: z.string().optional(),
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

export function RequestForm({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      type: '',
      priority: 'Normal',
      capacity: 1,
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Submitted logic:', data);
      toast.success('Request submitted successfully!');
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium text-primary">Request Type *</label>
          <select 
            {...register('type')}
            className={cn(
              "flex h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              errors.type && "border-red-500 focus-visible:ring-red-500"
            )}
          >
            <option value="">Select a type...</option>
            <option value="Room">Room</option>
            <option value="Equipment">Equipment</option>
            <option value="Staff">Staff</option>
          </select>
          {errors.type && <span className="text-xs text-red-500 mt-1">{errors.type.message}</span>}
        </div>

        <Input label="Resource Name *" {...register('resourceName')} error={errors.resourceName?.message} placeholder="e.g. Conf Room A" />
        
        <Input label="Capacity" type="number" {...register('capacity')} error={errors.capacity?.message} />
        
        <Input label="Equipment Needed" {...register('equipmentNeeded')} placeholder="e.g. Projector, Mic" />

        <Input label="Start Date & Time *" type="datetime-local" {...register('startDate')} error={errors.startDate?.message} />
        <Input label="End Date & Time *" type="datetime-local" {...register('endDate')} error={errors.endDate?.message} />

        <div className="flex flex-col gap-1 w-full md:col-span-2">
          <label className="text-sm font-medium text-primary">Priority *</label>
          <select 
            {...register('priority')}
            className="flex h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Emergency">Emergency</option>
          </select>
          {errors.priority && <span className="text-xs text-red-500 mt-1">{errors.priority.message}</span>}
        </div>

        <div className="flex flex-col gap-1 w-full md:col-span-2">
          <label className="text-sm font-medium text-primary">Purpose *</label>
          <textarea 
            {...register('purpose')}
            className={cn(
               "flex min-h-[80px] w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y",
               errors.purpose && "border-red-500 focus-visible:ring-red-500"
            )}
            placeholder="Details about your request"
          />
          {errors.purpose && <span className="text-xs text-red-500 mt-1">{errors.purpose.message}</span>}
        </div>

        <div className="flex flex-col gap-1 w-full md:col-span-2">
          <label className="text-sm font-medium text-primary">Notes</label>
          <textarea 
            {...register('notes')}
            className="flex min-h-[80px] w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={() => reset()}>Clear</Button>
        <Button type="submit" isLoading={isLoading}>Submit Request</Button>
      </div>
    </form>
  );
}
