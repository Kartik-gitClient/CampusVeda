import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRequests } from '../../services/requestApi';
import { format, isSameDay, addDays, startOfToday } from 'date-fns';
import { CalendarIcon, MapPin, Clock } from 'lucide-react';

export function DepartmentCalendar() {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['my-requests'],
    queryFn: getRequests,
  });

  const today = startOfToday();
  const weekDays = [...Array(7)].map((_, i) => addDays(today, i));

  const getBookingsForDate = (date) => {
    return requests
      .filter((req) => req.status === 'approved' && req.startDate && isSameDay(new Date(req.startDate), date))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded-2xl" />;

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <CalendarIcon className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Department Calendar (7 Days Ahead)</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((date, idx) => {
          const dayBookings = getBookingsForDate(date);
          const isToday = idx === 0;

          return (
            <div 
              key={date.toISOString()} 
              className={`flex flex-col border rounded-xl overflow-hidden ${isToday ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-gray-100'}`}
            >
              <div className={`p-2 text-center border-b ${isToday ? 'bg-primary text-white border-primary' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                <p className="text-xs font-semibold uppercase tracking-wider">{format(date, 'EEE')}</p>
                <p className="text-lg font-bold">{format(date, 'd')}</p>
              </div>
              
              <div className="p-2 space-y-2 flex-1 min-h-[100px] bg-white">
                {dayBookings.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4 italic">No approved bookings</p>
                ) : (
                  dayBookings.map(b => (
                    <div key={b._id} className="text-xs p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <p className="font-semibold text-gray-800 line-clamp-1">{b.resourceName}</p>
                      <div className="flex items-center text-gray-500 mt-1 gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>{format(new Date(b.startDate), 'h:mm a')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
