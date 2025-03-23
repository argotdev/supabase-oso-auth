'use client';

import { useEffect, useState } from 'react';
import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';
import { User } from '@/types';
import { createBrowserSupabaseClient } from '@/lib/supabase';

interface DashboardClientProps {
  user: User;
  canAccessProtected: boolean;
}

export default function DashboardClient({ user, canAccessProtected }: DashboardClientProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    console.log('Dashboard Client Component Mounted');
    console.log('User:', user);
  }, [user]);

  const handleUpgradeToAdmin = async () => {
    setIsUpgrading(true);
    setUpgradeError(null);

    try {
      const response = await fetch('/api/upgrade-to-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upgrade to admin');
      }

      // Refresh the page to show updated permissions
      window.location.reload();
    } catch (error: any) {
      console.error('Upgrade error:', error);
      setUpgradeError(error.message || 'Failed to upgrade to admin');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}</h2>
        <p className="text-gray-600 mb-4">Current role: {user.role}</p>
        
        {user.role !== 'admin' && (
          <div className="mt-4">
            <button
              onClick={handleUpgradeToAdmin}
              disabled={isUpgrading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {isUpgrading ? 'Upgrading...' : 'Upgrade to Admin'}
            </button>
            {upgradeError && (
              <p className="text-red-500 mt-2">{upgradeError}</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Pages</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
              Dashboard
            </Link>
          </li>
          {canAccessProtected && (
            <li>
              <Link href="/protected" className="text-blue-500 hover:text-blue-700">
                Protected Area (Oso authorized)
              </Link>
            </li>
          )}
        </ul>
      </div>
      
      {!canAccessProtected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>You don't have permission to access the protected area.</p>
        </div>
      )}
    </div>
  );
} 