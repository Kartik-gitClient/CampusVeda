import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const mockResources = [
  { id: 'RES-01', name: 'Conference Room A', type: 'Room', capacity: 20, dept: 'CS', status: 'Active' },
  { id: 'RES-02', name: 'Server Rack C', type: 'Equipment', capacity: null, dept: 'IT', status: 'Maintenance' },
  { id: 'RES-03', name: 'Lab Assistant (Night)', type: 'Staff', capacity: 1, dept: 'Physics', status: 'Active' },
];

export function ResourceManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    toast.success('Resource added successfully!');
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Resource Registry</h2>
          <p className="text-sm text-gray-500">Manage all campus resources.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Resource
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resource ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockResources.map(res => (
            <TableRow key={res.id}>
              <TableCell className="font-medium whitespace-nowrap">{res.id}</TableCell>
              <TableCell className="whitespace-nowrap">{res.name}</TableCell>
              <TableCell className="whitespace-nowrap">{res.type}</TableCell>
              <TableCell className="whitespace-nowrap">{res.capacity || 'N/A'}</TableCell>
              <TableCell className="whitespace-nowrap">{res.dept}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={res.status === 'Active' ? 'success' : 'warning'}>{res.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Resource">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Resource Name" required placeholder="e.g. Physics Lab 2" />
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-primary">Type</label>
            <select className="flex h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" required>
              <option value="Room">Room</option>
              <option value="Equipment">Equipment</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <Input label="Capacity" type="number" placeholder="Leave empty if N/A" />
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-primary">Department Affiliation</label>
            <select className="flex h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" required>
              <option value="CS">Computer Science</option>
              <option value="ME">Mechanical</option>
              <option value="Physics">Physics</option>
              <option value="IT">IT Support</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Resource</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
