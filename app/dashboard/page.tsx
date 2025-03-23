import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';
import { checkUserRole, addUserRole, checkAccess } from '@/lib/oso';
import { User } from '@/types';
import DashboardClient from '@/components/DashboardClient';

export default async function Dashboard() {
  console.log('Dashboard page - Starting execution');
  
  try {
    // Create a Supabase client
    const supabase = createServerComponentClient({ cookies });
    console.log('Dashboard page - Supabase client created');
    
    // Check if user is authenticated
    console.log('Dashboard page - Checking session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Dashboard page - Session:', session);
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw sessionError;
    }

    if (!session || !session.user.id) {
      console.log('No session or user ID found, redirecting to login');
      redirect('/login');
    }

    const userId = session.user.id;

    // Get user's role from Oso
    let userRole = 'user';
    try {
      const isAdmin = await checkUserRole(userId, "admin");
      if (isAdmin) {
        userRole = 'admin';
      } else {
        // Only set up initial role if user is not an admin
        await addUserRole(userId, "user");
      }
      console.log('User role from Oso:', userRole);
    } catch (error) {
      console.error('Error checking user role:', error);
    }

    // Get user details from session
    const user: User = {
      id: userId,
      email: session.user.email || '',
      role: userRole,
    };

    console.log('User details:', user);

    // Check if user can access protected resources
    let canAccessProtected = false;
    try {
      canAccessProtected = await checkAccess(userId, "protected-section");
      console.log('Authorization check completed:', canAccessProtected);
    } catch (error) {
      console.error('Error checking authorization:', error);
      throw error;
    }

    console.log('Dashboard page - Rendering DashboardClient');
    return <DashboardClient user={user} canAccessProtected={canAccessProtected} />;
  } catch (error) {
    console.error('Dashboard page - Error:', error);
    throw error;
  }
}