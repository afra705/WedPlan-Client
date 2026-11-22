/**
 * Subscription helpers.
 *
 * `subscriptionPlan` and `subscriptionExpiresAt` are written only by the
 * verified Stripe webhook in the backend. The frontend never changes them;
 * it only reads the values from the Better Auth session.
 *
 * A premium plan is considered active only while the expiry date is in the
 * future. This keeps an expired (or manually edited) plan from unlocking
 * premium features.
 */

export type SubscriptionFields = {
  subscriptionPlan?: string | null;
  subscriptionExpiresAt?: Date | string | null;
};

/** Parse a Date / ISO string from the session into a timestamp. */
const parseExpiry = (
  value?: Date | string | null
): number | null => {
  if (!value) return null;

  const time =
    value instanceof Date
      ? value.getTime()
      : new Date(value).getTime();

  return Number.isFinite(time) ? time : null;
};

/** True only for a `"premium"` plan whose expiry is in the future. */
export const isPremiumActive = (
  user?: SubscriptionFields | null
): boolean => {
  if (user?.subscriptionPlan?.toLowerCase() !== "premium") {
    return false;
  }

  const expiresAt = parseExpiry(user.subscriptionExpiresAt);

  return expiresAt !== null && expiresAt > Date.now();
};

/** The plan that should be displayed: `"premium"` or `"free"`. */
export const getActivePlan = (
  user?: SubscriptionFields | null
): "premium" | "free" => (isPremiumActive(user) ? "premium" : "free");

/** Timestamp of an active premium plan, or `null` for free / expired. */
export const getSubscriptionExpiry = (
  user?: SubscriptionFields | null
): number | null =>
  isPremiumActive(user)
    ? parseExpiry(user?.subscriptionExpiresAt)
    : null;

/** Human-readable renewal date, or `null` when there is no active expiry. */
export const formatSubscriptionExpiry = (
  value?: Date | string | null
): string | null => {
  const time = parseExpiry(value);

  if (time === null) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(time));
};
