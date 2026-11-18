
export type UserRole = "vendor" | "customer" | "admin";

export interface DashboardUser {
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
}