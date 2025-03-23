import { createServerSupabaseClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default async function LoginPage() {
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
      <LoginForm />
    </div>
  );
}