import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function Home() {
  // Create a Supabase client
  const supabase = createServerSupabaseClient();
  
  // Check if user is already logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  // If logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Supabase + Oso Auth Example</h1>
      <p className="text-xl mb-8">A simple example of authentication with Supabase and authorization with Oso</p>
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}