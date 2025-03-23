import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getOsoClient } from '@/lib/oso';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    // Verify the user is authenticated
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user ID from the request
    const { userId } = await request.json();

    // Verify the user is upgrading themselves
    if (userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get Oso client
    const oso = getOsoClient();

    // Check if user is already an admin
    const user = { type: "User", id: userId };
    const app = { type: "Application", id: "app" };
    const isAdmin = await oso.authorize(user, "admin", app);

    if (isAdmin) {
      return NextResponse.json(
        { message: 'User is already an admin' },
        { status: 400 }
      );
    }

    // Remove the old role first
    try {
      await oso.delete([
        "has_role",
        { type: "User", id: userId },
        "user",
        { type: "Application", id: "app" }
      ]);
      console.log('Removed user role');
    } catch (error) {
      console.error('Error removing user role:', error);
    }

    // Add the new admin role
    try {
      await oso.insert([
        "has_role",
        { type: "User", id: userId },
        "admin",
        { type: "Application", id: "app" }
      ]);
      console.log('Added admin role');
    } catch (error) {
      console.error('Error adding admin role:', error);
      // Try to restore the user role if admin role fails
      try {
        await oso.insert([
          "has_role",
          { type: "User", id: userId },
          "user",
          { type: "Application", id: "app" }
        ]);
      } catch (restoreError) {
        console.error('Error restoring user role:', restoreError);
      }
      throw error;
    }

    return NextResponse.json({ message: 'Successfully upgraded to admin' });
  } catch (error) {
    console.error('Error upgrading to admin:', error);
    return NextResponse.json(
      { message: 'Failed to upgrade to admin' },
      { status: 500 }
    );
  }
} 