import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRequest, generateDocument, emailDocument } from '../../services/requestApi';
import jsPDF from 'jspdf';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import toast from 'react-hot-toast';

const schema = z.object({
  type: z.enum(['Room', 'Equipment', 'Staff'], { errorMap: () => ({ message: 'Please select a type' }) }),
  resourceName: z.string().min(2, 'Resource name is required'),
  purpose: z.string().min(10, 'Describe the purpose (min 10 chars)'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  capacity: z.string().optional(),
  priority: z.enum(['Normal', 'High', 'Emergency']).default('Normal'),
});

export function RequestForm({ onSuccess }) {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.auth.user);
  const [type, setType] = useState('Room');
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const location = useLocation();
  const initialState = location.state || {};

  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { 
      type: initialState.type || 'Room', 
      resourceName: initialState.resourceName || '',
      capacity: initialState.capacity?.toString() || '',
      priority: 'Normal' 
    },
  });

  React.useEffect(() => {
    if (initialState.type) {
      setType(initialState.type);
    }
  }, [initialState.type]);

  const { mutate, isPending } = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      toast.success('Request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
      reset();
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit request.');
    },
  });

  const { mutate: generateDocMutate, isPending: isGenerating } = useMutation({
    mutationFn: generateDocument,
    onSuccess: (doc) => {
      setGeneratedDoc(doc);
      setIsDocModalOpen(true);
      toast.success('Document generated via AI!');
    },
    onError: (err) => {
      toast.error('Failed to generate AI document.');
    }
  });

  const { mutate: emailDocMutate, isPending: isEmailing } = useMutation({
    mutationFn: emailDocument,
    onSuccess: () => toast.success('Document emailed to administration!'),
    onError: () => toast.error('Failed to email document.')
  });

  const onSubmit = (data) => {
    mutate({
      ...data,
      capacity: data.capacity ? parseInt(data.capacity) : undefined,
    });
  };

  const handleGenerateDoc = () => {
    const values = getValues();
    generateDocMutate({
      ...values,
      userName: user?.name,
      userEmail: user?.email,
      userDepartment: user?.department,
      userDesignation: user?.designation,
    });
  };

  const handleDownloadPDF = () => {
    if (!generatedDoc) return;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(generatedDoc, 180);
    doc.text(splitText, 15, 20);
    doc.save(`Resource_Request_${new Date().getTime()}.pdf`);
  };

  const handleEmailDocument = () => {
    emailDocMutate({ document: generatedDoc, toEmail: 'admin@campusveda.edu' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
        <select
          {...register('type')}
          onChange={e => setType(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="Room">Room / Venue</option>
          <option value="Equipment">Equipment</option>
          <option value="Staff">Support Staff</option>
        </select>
        {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
      </div>

      {/* Resource Name */}
      <Input
        label="Resource Name"
        placeholder={type === 'Room' ? 'e.g. Lab 101, Seminar Hall A' : type === 'Equipment' ? 'e.g. Projectors (x3)' : 'e.g. Lab Assistant'}
        {...register('resourceName')}
        error={errors.resourceName?.message}
      />

      {/* Capacity (only for rooms) */}
      {type === 'Room' && (
        <Input
          label="Expected Attendees"
          type="number"
          placeholder="e.g. 40"
          {...register('capacity')}
          error={errors.capacity?.message}
        />
      )}

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date & Time"
          type="datetime-local"
          {...register('startDate')}
          error={errors.startDate?.message}
        />
        <Input
          label="End Date & Time"
          type="datetime-local"
          {...register('endDate')}
          error={errors.endDate?.message}
        />
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / Description</label>
        <textarea
          {...register('purpose')}
          rows={3}
          placeholder="Describe why you need this resource..."
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
        />
        {errors.purpose && <p className="mt-1 text-xs text-red-500">{errors.purpose.message}</p>}
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select
          {...register('priority')}
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="Normal">Normal</option>
          <option value="High">High</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      <div className="flex gap-4 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGenerateDoc} 
          isLoading={isGenerating}
          className="w-1/3 border-gray-300 border-2"
        >
          ✨ AI Document
        </Button>
        <Button type="submit" className="w-2/3" isLoading={isPending}>
          Submit Request
        </Button>
      </div>

      {isDocModalOpen && (
        <Modal 
          isOpen={isDocModalOpen} 
          onClose={() => setIsDocModalOpen(false)}
          title="Generated Resource Document"
        >
          <div className="space-y-4">
            <textarea 
              readOnly
              className="w-full h-64 p-4 text-sm font-mono bg-gray-50 border rounded-xl"
              value={generatedDoc}
            />
            <div className="flex justify-end gap-3 text-sm">
              <Button type="button" variant="outline" onClick={handleDownloadPDF}>Download PDF</Button>
              <Button type="button" onClick={handleEmailDocument} isLoading={isEmailing}>Email Document</Button>
            </div>
          </div>
        </Modal>
      )}
    </form>
  );
}
