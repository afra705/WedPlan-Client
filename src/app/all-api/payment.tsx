
import { getAuthHeaders } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CheckoutSessionResponse = {
  success: boolean;
  url: string;
};

type CheckoutErrorResponse = {
  message?: string;
};

export const createCheckoutSession = async (vendorId: string) => {
  // The backend authenticates the vendor from the Better Auth JWT, not from
  // the request body. Send the token so `verifyToken` / `verifyVendor` pass.
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}/create-checkout-session`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    // Kept for compatibility; the backend prefers the verified JWT user.
    body: JSON.stringify({ vendorId }),
  });

  const data: (Partial<CheckoutSessionResponse> &
    CheckoutErrorResponse) | null = await response
    .json()
    .catch(() => null);

  if (!response.ok || !data?.success || typeof data.url !== "string") {
    throw new Error(
      data?.message || "Failed to create checkout session"
    );
  }

  // Only ever redirect to a real Stripe HTTPS checkout URL.
  let checkoutUrl: URL;

  try {
    checkoutUrl = new URL(data.url);
  } catch {
    throw new Error("Invalid checkout URL returned by the server");
  }

  if (checkoutUrl.protocol !== "https:") {
    throw new Error("Invalid checkout URL returned by the server");
  }

  return data as CheckoutSessionResponse;
};
