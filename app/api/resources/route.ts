import { createServerSupabaseClient } from '@/lib/supabase';
import { checkAccess } from '@/lib/oso';
import { NextRequest, NextResponse } from 'next/server';
import { Resource } from '@/types';

// Mock resources - in a real app, you'd fetch these from a database
const resources: Resource[] = [
  { id: '1', name: 'Public Resource', ownerId: 'system', isPublic: true },
  { id: '2', name: 'Private Resource 1', ownerId: 'user1', isPublic: false },
  { id: '3', name: 'Private Resource 2', ownerId: 'user2', isPublic: false },
];

export async function GET(request: NextRequest) {
  try {
    // Get the user session
    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Filter resources based on authorization
    const authorizedResources = await Promise.all(
      resources.map(async (resource) => {
        const canRead = await checkAccess(userId, resource.id);
        if (canRead) return resource;
        return null;
      })
    );

    // Remove null values (unauthorized resources)
    const filteredResources = authorizedResources.filter(Boolean);

    return NextResponse.json({ resources: filteredResources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}