
import React, { useState, useMemo } from 'react';
import { Client, DisputeLetter } from '../types';
import { Users, Search, FileText, UserPlus, Filter } from 'lucide-react';

interface Props {
  clients: Client[];
  letters: DisputeLetter[];
}

interface Activity {
  id: string;
  type: 'letter' | 'client_joined';
  clientName: string;
  description: string;
  date: string;
  details?: string;
}

const AdminDashboard: React.FC<Props> = ({ clients, letters }) => {
  const [searchFilter, setSearchFilter] = useState('');

  // Combine letters and client joins into activity feed
  const allActivities = useMemo(() => {
    const activities: Activity[] = [];

    // Add letter activities
    letters.forEach(letter => {
      activities.push({
        id: `letter-${letter.id}`,
        type: 'letter',
        clientName: letter.clientName,
        description: `Dispute letter created`,
        date: letter.createdAt,
        details: letter.templateId,
      });
    });

    // Add client join activities
    clients.forEach(client => {
      activities.push({
        id: `client-${client.id}`,
        type: 'client_joined',
        clientName: client.name,
        description: `Joined the platform`,
        date: client.joinedDate,
      });
    });

    // Sort by date (most recent first)
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [clients, letters]);

  // Filter activities by client name
  const filteredActivities = useMemo(() => {
    if (!searchFilter.trim()) return allActivities;
    return allActivities.filter(activity =>
      activity.clientName.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [allActivities, searchFilter]);

  // Get unique client names for quick filter buttons
  const uniqueClientNames = useMemo(() => {
    const names = new Set<string>();
    allActivities.forEach(a => names.add(a.clientName));
    return Array.from(names).sort();
  }, [allActivities]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-slate-800">Dashboard Overview</h1>

      {/* Client Count Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8 max-w-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <div className="text-slate-500 text-sm font-medium">Total Clients</div>
            <div className="text-4xl font-bold text-slate-900">{clients.length}</div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>

            {/* Search/Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by client name..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none w-64"
                />
              </div>
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Chips */}
          {uniqueClientNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-slate-500 flex items-center gap-1 mr-2">
                <Filter className="h-3 w-3" />
                Quick filter:
              </span>
              {uniqueClientNames.map(name => (
                <button
                  key={name}
                  onClick={() => setSearchFilter(searchFilter === name ? '' : name)}
                  className={`px-3 py-1 text-xs rounded-full transition ${
                    searchFilter === name
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Activity List */}
        <div className="divide-y divide-slate-100">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              {searchFilter ? (
                <>No activities found for "{searchFilter}"</>
              ) : (
                <>No recent activity</>
              )}
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'letter'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-green-50 text-green-600'
                }`}>
                  {activity.type === 'letter' ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <UserPlus className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">
                    {activity.description}
                  </p>
                  <p className="text-sm text-slate-500">
                    {activity.clientName}
                    {activity.details && (
                      <span className="text-slate-400"> • {activity.details.replace(/_/g, ' ')}</span>
                    )}
                  </p>
                </div>
                <div className="text-sm text-slate-400 flex-shrink-0">
                  {activity.date}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Activity Summary */}
        {filteredActivities.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm text-slate-500">
            Showing {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
            {searchFilter && ` for "${searchFilter}"`}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
