
export type UserRole = "vendor" | "customer" | "admin";

export interface DashboardUser {
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
}

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
  role?: string;
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: "free" | "premium";
  subscriptionExpiresAt?: Date | string | null;
};