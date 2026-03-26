import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getResources } from '../services/resourceApi';
import { Badge } from '../components/Badge';
import { Building2, Users, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  Available: { color: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/10', border: 'border-gray-100 dark:border-gray-800', icon: 'default' },
  'In Use': { color: 'bg-black dark:bg-white', text: 'text-black dark:text-white', bg: 'bg-gray-100 dark:bg-white/5', border: 'border-black dark:border-white', icon: 'primary' },
  Maintenance: { color: 'bg-gray-400', text: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', icon: 'warning' },
  'Unavailable': { color: 'bg-gray-300', text: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-100', icon: 'default' },
};

export function PremiseDashboard() {
  const navigate = useNavigate();
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['public-resources'],
    queryFn: () => getResources(),
  });

  const rooms = resources.filter(res => res.type === 'Room' && res.isActive !== false);

  const groupedRooms = rooms.reduce((acc, room) => {
    const subType = room.subType || 'Other';
    if (!acc[subType]) acc[subType] = [];
    acc[subType].push(room);
    return acc;
  }, {});

  const handleRoomClick = (room) => {
    navigate('/requests/new', { 
      state: { 
        resourceName: room.name, 
        type: 'Room',
        capacity: room.capacity,
        resourceId: room._id
      } 
    });
  };

  if (isLoading) return <div className="p-8 space-y-8">{[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />)}</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary dark:text-white transition-colors duration-300">Building Premise Map</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Real-time status of all campus rooms and facilities. Click any room to enquire.</p>
        </div>
        <div className="flex gap-4 text-sm font-medium">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <div key={status} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${config.color}`} />
                    <span className="text-gray-600 dark:text-gray-400">{status}</span>
                </div>
            ))}
        </div>
      </div>

      {Object.entries(groupedRooms).length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">No rooms mapped yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Contact HOD to initialize building dimensions.</p>
        </div>
      ) : (
        Object.entries(groupedRooms).map(([subType, rooms]) => (
          <section key={subType} className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-primary dark:border-white pl-4">{subType}s</h2>
              <span className="text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{rooms.length} Units</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.map((room) => {
                const config = STATUS_CONFIG[room.status] || STATUS_CONFIG.Available;
                return (
                  <motion.div
                    key={room._id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`group relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border ${config.border} p-6 cursor-pointer hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300`}
                    onClick={() => handleRoomClick(room)}
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 ${config.bg} rounded-bl-[4rem] -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform`} />
                    
                    <div className="relative space-y-4">
                      <div className="flex justify-between items-start">
                        <div className={`p-2 rounded-xl ${config.bg}`}>
                          <Building2 className={`w-5 h-5 ${config.text}`} />
                        </div>
                        <Badge variant={config.icon}>{room.status}</Badge>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-white transition-colors">{room.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{room.capacity || '40+'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{room.department}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between group-hover:border-primary/20 dark:group-hover:border-white/20 transition-colors">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 group-hover:text-primary/70 dark:group-hover:text-white/70">Quick Enquiry</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
