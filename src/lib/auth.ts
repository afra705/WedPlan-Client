import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("wedplan");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: ["admin", "vendor", "customer"],
        input: false,
        defaultValue: "customer",
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
});