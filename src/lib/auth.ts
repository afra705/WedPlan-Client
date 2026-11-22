
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin, jwt } from "better-auth/plugins";
import { getOAuthState } from "better-auth/api";

const uri = process.env.MONGODB_URL;

if (!uri) {
  throw new Error("MONGODB_URL is missing");
}

// Reuse MongoDB connection across requests and hot reloads
const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
  mongoClientPromise?: Promise<MongoClient>;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(uri);

if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = client;
}

const clientPromise =
  globalForMongo.mongoClientPromise ??
  client.connect();

globalForMongo.mongoClientPromise = clientPromise;

await clientPromise;

const db = client.db("wedplan");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

  plugins: [
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL!,
        audience: process.env.BETTER_AUTH_URL!,
        expirationTime: "15m",
      },
    }),

    admin({
      defaultRole: "user",
    }),
  ],

  user: {
    additionalFields: {
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
          let accountType = (
            user as { accountType?: string }
          ).accountType;

          if (ctx?.path === "/callback/:id") {
            const additionalData =
              await getOAuthState<{ accountType?: string }>();

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
