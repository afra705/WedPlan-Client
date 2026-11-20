import { createAuthClient } from "better-auth/react"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
export const authClient = createAuthClient({
    
    baseURL: process.env.BETTER_AUTH_URL,
      plugins: [inferAdditionalFields<typeof auth>(),  adminClient(),],
  
})

export const { signIn, signUp, signOut,
  useSession, updateUser} = authClient