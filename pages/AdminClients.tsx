
import React from 'react';
import { Link } from 'react-router-dom';
import { Client } from '../types';

interface Props {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const AdminClients: React.FC<Props> = ({ clients }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Client Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
          + Add New Client
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Negatives</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{client.name}</div>
                  <div className="text-xs text-slate-500">{client.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${
                    client.status === 'active' ? 'bg-green-100 text-green-700' : 
                    client.status === 'onboarding' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-blue-600">
                  {client.score}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {client.negativeItems.length} items
                </td>
                <td className="px-6 py-4">
                  <Link 
                    to={`/dashboard/clients/${client.id}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    View & Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClients;
