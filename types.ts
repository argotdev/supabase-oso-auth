export interface User {
  id: string;
  email: string;
  role?: string;
}

// Define possible actions a user can perform
export type Action = 'read' | 'write' | 'delete';