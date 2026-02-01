
import React from 'react';
import { Client, DisputeLetter } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Props {
  clients: Client[];
  letters: DisputeLetter[];
}

const AdminDashboard: React.FC<Props> = ({ clients, letters }) => {
  const stats = [
    { label: 'Total Clients', value: clients.length, icon: '👥' },
    { label: 'Avg Score', value: Math.round(clients.reduce((acc, c) => acc + c.score, 0) / clients.length), icon: '📈' },
    { label: 'Letters Sent', value: letters.length, icon: '✉️' },
    { label: 'Pending Deletions', value: clients.reduce((acc, c) => acc + c.negativeItems.length, 0), icon: '⏳' },
  ];

  // Dummy data for charts
  const scoreData = [
    { name: 'Jan', score: 620 },
    { name: 'Feb', score: 635 },
    { name: 'Mar', score: 650 },
    { name: 'Apr', score: 680 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-slate-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
          <h3 className="font-bold mb-6 text-slate-700">Average Client Score Progression</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis domain={[500, 850]} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold mb-6 text-slate-700">Recent Activity</h3>
          <div className="space-y-4">
            {letters.slice(0, 5).map((l, i) => (
              <div key={i} className="flex items-center gap-4 text-sm pb-4 border-b border-slate-100 last:border-0">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">✉️</div>
                <div>
                  <p className="font-semibold text-slate-800">Dispute letter generated for {l.clientName}</p>
                  <p className="text-slate-500 text-xs">{l.createdAt}</p>
                </div>
              </div>
            ))}
            {clients.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center gap-4 text-sm pb-4 border-b border-slate-100 last:border-0">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">👤</div>
                <div>
                  <p className="font-semibold text-slate-800">{c.name} joined the platform</p>
                  <p className="text-slate-500 text-xs">{c.joinedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
