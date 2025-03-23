import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { checkUserRole } from '@/lib/oso';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function ProtectedPage() {
  // Create a Supabase client
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Check authorization with Oso
  const isAuthorized = await checkUserRole(session.user.id, "admin");

  if (!isAuthorized) {
    // User is logged in but not authorized to view this page
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Protected Area</h1>
        <div className="space-x-4">
          <Link 
            href="/dashboard" 
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Dashboard
          </Link>
          <LogoutButton />
        </div>
      </div>
      
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
        <p className="font-bold">Authorization Successful!</p>
        <p>You are authorized to view this protected content.</p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Highly Sensitive Information</h2>
        <p className="mb-4">
          This content is only visible to users with the appropriate permissions as determined by Oso's authorization rules.
        </p>
        <p>
          User ID: {session.user.id}<br />
          Email: {session.user.email}
        </p>
      </div>
    </div>
  );
}