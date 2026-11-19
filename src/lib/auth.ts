import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("wedplan");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

    user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
    },
  },
  plugins: [
    admin({
      adminRoles: ["admin"],
    }),],
    users: {
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
  emailAndPassword: {
    enabled: true,
  },
});