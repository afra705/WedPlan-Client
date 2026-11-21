
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
    admin({
      defaultRole: "user",
    }),
  ],

  user: {
    additionalFields: {
      // Customer or Vendor account type
      accountType: {
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
          // Account type is user-controlled (vendor or customer), but it is
          // normalized here so it can never become an admin role. Admin access
          // is controlled only by the admin plugin's `role` field, which is
          // input: false and cannot be set through signup or updateUser.
          let accountType = (user as { accountType?: string }).accountType;

          // Google OAuth signup stores the selected account type in OAuth state.
          if (ctx?.path === "/callback/:id") {
            const additionalData = await getOAuthState<{
              accountType?: string;
            }>();

            accountType = additionalData?.accountType;
          }

          return {
            data: {
              ...user,
              accountType:
                accountType === "vendor" ? "vendor" : "customer",
            },
          };
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
