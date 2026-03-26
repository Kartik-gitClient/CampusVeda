import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResources, createResource, updateResource, deleteResource } from '../../services/resourceApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Input } from '../Input';

const STATUS_VARIANT = { Available: 'success', 'In Use': 'warning', Maintenance: 'danger', Unavailable: 'danger' };

import { useSelector } from 'react-redux';

export function ResourceManagement() {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => getResources(),
    retry: 1,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { mutate: save, isPending } = useMutation({
    mutationFn: (data) => editing ? updateResource(editing._id, data) : createResource(data),
    onSuccess: () => {
      toast.success(editing ? 'Resource updated.' : 'Resource created.');
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setShowModal(false);
      setEditing(null);
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed.'),
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      toast.success('Resource deactivated.');
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    onError: () => toast.error('Failed to remove resource.'),
  });

  const openEdit = (resource) => {
    setEditing(resource);
    reset(resource);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    reset({});
    setShowModal(true);
  };

  const isCrossDept = editing && user?.role === 'hod' && editing.department !== user.department;

  return (
    <div className="glass rounded-[2rem] border-white/10 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-primary">Resource Management</h2>
          <p className="text-sm text-gray-500">Manage campus rooms, equipment, and staff.</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Resource
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map(res => (
              <TableRow key={res._id}>
                <TableCell className="font-medium">{res.name}</TableCell>
                <TableCell>{res.type}</TableCell>
                <TableCell>{res.department}</TableCell>
                <TableCell>{res.capacity || '—'}</TableCell>
                <TableCell><Badge variant={STATUS_VARIANT[res.status] || 'default'}>{res.status}</Badge></TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(res)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(res._id)} className="text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setEditing(null); }} 
        title={isCrossDept ? 'Update Room Status (Cross-Dept)' : (editing ? 'Edit Resource' : 'Add New Resource')}
      >
        <form onSubmit={handleSubmit(save)} className="space-y-6">
          {isCrossDept && (
            <div className="p-4 bg-primary/5 rounded-2xl mb-4">
              <p className="text-xs text-primary font-medium">As HOD, you can only update the availability status for rooms in other departments.</p>
            </div>
          )}
          <Input 
            label="Name" 
            placeholder="e.g. Lab 101" 
            {...register('name', { required: true })} 
            disabled={isCrossDept}
          />
          <div>
            <label className="block text-sm font-medium text-primary/70 dark:text-white/60 mb-2">Type</label>
            <select 
              {...register('type', { required: true })} 
              disabled={isCrossDept}
              className="flex h-12 w-full rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-gray-900/50 px-4 py-2 text-sm text-primary dark:text-white backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="Room">Room</option>
              <option value="Equipment">Equipment</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <Input 
            label="Department" 
            placeholder="e.g. Computer Science" 
            {...register('department', { required: true })} 
            disabled={isCrossDept}
          />
          <Input 
            label="Capacity" 
            type="number" 
            placeholder="0" 
            {...register('capacity')} 
            disabled={isCrossDept}
          />
          <div>
            <label className="block text-sm font-medium text-primary/70 dark:text-white/60 mb-2">Status</label>
            <select 
              {...register('status')} 
              className="flex h-12 w-full rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-gray-900/50 px-4 py-2 text-sm text-primary dark:text-white backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={isPending}>{editing ? 'Save Changes' : 'Create Resource'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
