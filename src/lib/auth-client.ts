
import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
  jwtClient,
} from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    jwtClient(),
  ],
});

// Get JWT Token
export const getJwtToken = async () => {
  const response = await fetch("/api/auth/token", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.token) {
    throw new Error(data.message || "Failed to generate JWT");
  }

  return data.token as string;
};

// Authorization Headers
export const getAuthHeaders = async (token?: string) => {
  const jwt = token || await getJwtToken();

  return {
    Authorization: `Bearer ${jwt}`,
  };
};

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  updateUser,
} = authClient;
