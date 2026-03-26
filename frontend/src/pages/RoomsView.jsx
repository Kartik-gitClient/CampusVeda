import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getResources } from '../services/resourceApi';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { Users, Server, Settings, Info } from 'lucide-react';

const STATUS_VARIANT = { available: 'success', occupied: 'danger', under_repair: 'warning', thrashed: 'default' };

export function RoomsView() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['public-resources'],
    queryFn: getResources,
  });

  if (isLoading) return <div className="p-8 space-y-4 max-w-7xl mx-auto"><div className="h-10 w-48 bg-gray-200 animate-pulse rounded-full"/><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse"/>)}</div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Campus Resources</h1>
        <p className="text-gray-500 mt-2 text-lg">Browse available rooms, equipment, and facilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((res) => (
          <div key={res._id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedRoom(res)}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{res.resourceName}</h3>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{res.resourceType}</p>
              </div>
              <Badge variant={STATUS_VARIANT[res.currentStatus] || 'default'}>{res.currentStatus.replace('_', ' ')}</Badge>
            </div>
            
            <div className="flex-1 space-y-3 pt-4 border-t border-gray-100">
              {res.capacity && (
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>Capacity: {res.capacity} people</span>
                </div>
              )}
              {res.buildingLocation && (
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span>Location: {res.buildingLocation}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedRoom} onClose={() => setSelectedRoom(null)} title={selectedRoom?.resourceName}>
        {selectedRoom && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <Badge variant={STATUS_VARIANT[selectedRoom.currentStatus]}>{selectedRoom.currentStatus.toUpperCase()}</Badge>
               <span className="text-sm text-gray-500 font-medium">Currently {selectedRoom.currentStatus.replace('_', ' ')}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div><span className="text-gray-400 block mb-1 uppercase text-xs font-bold tracking-wider">Type</span><p className="font-semibold text-gray-800">{selectedRoom.resourceType}</p></div>
              <div><span className="text-gray-400 block mb-1 uppercase text-xs font-bold tracking-wider">Capacity</span><p className="font-semibold text-gray-800">{selectedRoom.capacity || 'N/A'}</p></div>
              <div className="col-span-2"><span className="text-gray-400 block mb-1 uppercase text-xs font-bold tracking-wider">Location</span><p className="font-semibold text-gray-800">{selectedRoom.buildingLocation || 'N/A'}</p></div>
            </div>

            <div className="pt-6 flex gap-3 border-t border-gray-100">
              <Button className="w-full" onClick={() => { setSelectedRoom(null); navigate('/requests/new'); }}>
                Book this Resource
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
