'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
    >
      {loading ? 'Logging out...' : 'Log Out'}
    </button>
  );
}