import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

const data = [
  { name: 'Mon', requests: 12 },
  { name: 'Tue', requests: 19 },
  { name: 'Wed', requests: 15 },
  { name: 'Thu', requests: 22 },
  { name: 'Fri', requests: 18 },
  { name: 'Sat', requests: 5 },
  { name: 'Sun', requests: 8 },
];

export function Analytics() {
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Requests per Day</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
            <Tooltip 
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#000000' }}
            />
            <Line type="monotone" dataKey="requests" stroke="#000000" strokeWidth={3} dot={{ r: 4, fill: '#000000' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
