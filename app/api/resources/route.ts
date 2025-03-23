import { createServerSupabaseClient } from '@/lib/supabase';
import { getOsoClient } from '@/lib/oso';
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
    const oso = getOsoClient();

    // Filter resources based on authorization
    const authorizedResources = await Promise.all(
      resources.map(async (resource) => {
        // Convert to the format expected by Oso policy - change type to 'Document'
        const osoResource = { 
          type: 'Document', 
          id: resource.id,
          is_public: resource.isPublic,
          owner_id: resource.ownerId
        };
        
        const canRead = await oso.authorize(
          { type: 'User', id: userId },
          'read',
          osoResource
        );

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