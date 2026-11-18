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
  emailAndPassword: {
    enabled: true,
  },
});