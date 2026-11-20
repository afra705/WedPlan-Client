// Stripe Premium subscription API wrapper.
// The Stripe secret key and webhook secret stay on the backend only.

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CheckoutSessionResponse = {
  success: boolean;
  url: string;
};

type CheckoutErrorResponse = {
  message?: string;
};

// Ask the backend to create a Stripe Checkout session for a vendor.
export const createCheckoutSession = async (
  vendorId: string
): Promise<CheckoutSessionResponse> => {
  const response = await fetch(
    `${API_URL}/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ vendorId }),
    }
  );

  const data: CheckoutSessionResponse & CheckoutErrorResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create checkout session"
    );
  }

  if (!data.success || !data.url) {
    throw new Error(
      "The payment server did not return a checkout link."
    );
  }

  // Stripe Checkout links are always HTTPS.
  if (!data.url.startsWith("https://")) {
    throw new Error("Received an invalid checkout link.");
  }

  return data;
};
