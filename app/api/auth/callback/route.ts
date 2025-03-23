import { createServerSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
      }

      if (data.session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Unexpected error in auth callback:', error);
      return NextResponse.redirect(new URL('/login?error=unexpected', request.url));
    }
  }

  // If no code or session creation failed
  return NextResponse.redirect(new URL('/login?error=no_code', request.url));
}