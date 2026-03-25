import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Building2, Users, AlertTriangle } from 'lucide-react';

const deptData = [
  { name: 'CS', usage: 85 },
  { name: 'EE', usage: 60 },
  { name: 'ME', usage: 45 },
  { name: 'Physics', usage: 30 },
];

const typeData = [
  { name: 'Rooms', value: 400 },
  { name: 'Equipment', value: 300 },
  { name: 'Staff', value: 100 },
];
const COLORS = ['#000000', '#4B5563', '#9CA3AF'];

export function SystemOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center p-6">
          <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Resources</p>
            <h4 className="text-2xl font-bold text-primary">142</h4>
          </div>
        </Card>
        <Card className="flex items-center p-6">
          <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <h4 className="text-2xl font-bold text-primary">850</h4>
          </div>
        </Card>
        <Card className="flex items-center p-6 border-l-4 border-l-red-500">
          <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Conflicts</p>
            <h4 className="text-2xl font-bold text-red-600">3</h4>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dx={-10} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="usage" fill="#000000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
