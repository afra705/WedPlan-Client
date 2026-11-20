import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";
import { getOAuthState } from "better-auth/api";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("wedplan");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

     plugins: [
    admin(),
  ],
user: {
  additionalFields: {
    role: {
      type: "string",
      required: false,
      defaultValue: "customer",
      input: true,
    },
    isBlocked: {
      type: "boolean",
      required: false,
      defaultValue: false,
      input: false,
    },
    businessName: {
      type: "string",
      required: false,
      input: false,
    },
    subscriptionPlan: {
      type: "string",
      required: false,
      defaultValue: "free",
      input: false,
    },
    subscriptionExpiresAt: {
      type: "date",
      required: false,
      input: false,
    },
  },
},

databaseHooks: {
  user: {
    create: {
      before: async (user, ctx) => {
        if (ctx?.path === "/callback/:id") {
          const additionalData = await getOAuthState<{
            role?: string;
          }>();

          const selectedRole =
            additionalData?.role === "vendor"
              ? "vendor"
              : "customer";

          return {
            data: {
              ...user,
              role: selectedRole,
            },
          };
        }
      },
    },
  },
},

  emailAndPassword: {
    enabled: true,
  },
   socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});