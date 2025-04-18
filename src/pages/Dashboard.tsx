import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Users, FileText, Clock } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const username = user?.email?.split('@')[0];

  const stats = [
    { name: 'Active Projects', value: '0', icon: Clock, color: 'from-green-400 to-emerald-600' },
    { name: 'Total Clients', value: '0', icon: Users, color: 'from-blue-400 to-blue-600' },
    { name: 'Pending Invoices', value: '0', icon: FileText, color: 'from-yellow-400 to-orange-600' },
    { name: 'Revenue', value: '$0', icon: TrendingUp, color: 'from-purple-400 to-purple-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {username}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className={`bg-gradient-to-br ${stat.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}