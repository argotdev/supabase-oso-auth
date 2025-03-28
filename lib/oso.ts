import { Oso } from 'oso-cloud';

// Initialize Oso client
export const createOsoClient = () => {
  const osoUrl = process.env.OSO_CLOUD_URL || "https://cloud.osohq.com";
  const osoApiKey = process.env.OSO_API_KEY;

  if (!osoApiKey) {
    throw new Error('Missing OSO_API_KEY environment variable');
  }

  return new Oso(osoUrl, osoApiKey);
};

// In a real app, you might want to reuse a single client instance
let osoClient: Oso | null = null;

export const getOsoClient = () => {
  if (!osoClient) {
    osoClient = createOsoClient();
  }
  return osoClient;
};

// Helper functions for Oso fact manipulation
export const addUserRole = async (userId: string, role: string) => {
  const oso = getOsoClient();
  await oso.insert([
    "has_role",
    { type: "User", id: userId },
    role
  ]);
};

export const removeUserRole = async (userId: string, role: string) => {
  const oso = getOsoClient();
  await oso.delete([
    "has_role",
    { type: "User", id: userId },
    role
  ]);
};

export const checkUserRole = async (userId: string, role: string) => {
  const oso = getOsoClient();
  const facts = await oso.get([
    "has_role",
    { type: "User", id: userId },
    role
  ]);
  return facts.length > 0;
};

export const checkAccess = async (userId: string, resourceId: string) => {
  // For protected resources, we check if the user has admin role
  //if (resourceId === "protected-section") {
  //  return await checkUserRole(userId, "admin");
  //}
  
  // For now, we only handle protected section access
  //return false;
  const oso = getOsoClient();
  const user = { type: "User", id: userId };
  const resource = { type: "Section", id: resourceId };
  return await oso.authorize(user, "access", resource);
};