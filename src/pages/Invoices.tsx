import React from 'react';

export function Invoices() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Invoices</h1>
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-6">
            <p className="text-gray-500 dark:text-gray-400">No invoices yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}