export interface User {
  id: string;
  email: string;
  role?: string;
}

export interface Resource {
  id: string;
  name: string;
  ownerId: string;  // note: in Oso we'll convert this to owner_id
  isPublic: boolean; // note: in Oso we'll convert this to is_public
}

// Define possible actions a user can perform
export type Action = 'read' | 'write' | 'delete';