
import type { AccountType } from "@/lib/roles";

export interface DashboardUser {
  name: string;
  email: string;
  image?: string | null;
  /** Better Auth admin-plugin role. Only "admin" grants admin access. */
  role?: string | null;
  /** WedPlan account type. */
  accountType?: AccountType | null;
}
export type ServiceData = Omit<
  Service,
  "_id" | "status" | "createdAt"
>;
// service

export type Service = {
  image: string;
  _id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  /** Better Auth admin-plugin role. Only "admin" grants admin access. */
  role?: string | null;
  /** WedPlan account type. */
  accountType?: string | null;
  isBlocked?: boolean;
  banned?: boolean;
  businessName?: string;
  subscriptionPlan?: "free" | "premium" | string | null;
  subscriptionExpiresAt?: Date | string | null;
};