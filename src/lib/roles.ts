/**
 * Central authorization helpers for the WedPlan user schema.
 *
 * - `user.role` is owned by the Better Auth admin plugin.
 *   Only `"admin"` grants admin access; every other value (including the
 *   plugin default `"user"`) is a regular account.
 * - `user.accountType` is the WedPlan account type: `"vendor"` or `"customer"`.
 *
 * Keep every vendor/customer decision in this file so the rules cannot drift
 * between the navbar, dashboards, and API calls.
 */

export type AccountType = "vendor" | "customer";
export type DashboardRole = "admin" | AccountType;

export type RoleUser = {
  role?: string | null;
  accountType?: string | null;
};

/** Admin access is controlled exclusively by the Better Auth admin role. */
export const isAdmin = (
  user: RoleUser | null | undefined
): boolean => user?.role === "admin";

/**
 * Resolve the WedPlan account type.
 *
 * The `role` fallback keeps accounts created before `accountType` existed
 * working until the database is backfilled. New accounts always store
 * `accountType`, and the auth hook normalizes it to vendor/customer.
 */
export const getAccountType = (
  user: RoleUser | null | undefined
): AccountType => {
  if (user?.accountType === "vendor" || user?.accountType === "customer") {
    return user.accountType;
  }

  if (user?.role === "vendor" || user?.role === "customer") {
    return user.role;
  }

  return "customer";
};

/** Admins are never treated as vendors, even if they also have a vendor profile. */
export const isVendor = (
  user: RoleUser | null | undefined
): boolean => !isAdmin(user) && getAccountType(user) === "vendor";

/** Admins are never treated as customers, even if accountType defaults to customer. */
export const isCustomer = (
  user: RoleUser | null | undefined
): boolean => !isAdmin(user) && getAccountType(user) === "customer";

/** The dashboard a signed-in user belongs to. Admin takes precedence. */
export const getDashboardRole = (
  user: RoleUser | null | undefined
): DashboardRole => (isAdmin(user) ? "admin" : getAccountType(user));

/** URL of the user's dashboard. */
export const getDashboardPath = (
  user: RoleUser | null | undefined
): string => `/${getDashboardRole(user)}`;

/** URL of the user's profile settings page (admins have no profile page). */
export const getProfilePath = (
  user: RoleUser | null | undefined
): string =>
  isAdmin(user) ? "/admin" : `/${getAccountType(user)}/profile`;
