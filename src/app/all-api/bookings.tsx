
import { getAuthHeaders } from "@/lib/auth-client";
import { Booking } from "@/type/bookings";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// POST - Create Booking (Customer)
export const createBooking = async (
  bookingData: Partial<Booking>
) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create booking");
  }

  return data;
};

// GET - My Bookings (Customer)
export const getMyBookings = async () => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/my-bookings`, {
    headers,
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch my bookings");
  }

  return data;
};

// PATCH - Cancel Booking (Customer)
export const cancelBooking = async (bookingId: string) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/cancel`,
    {
      method: "PATCH",
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel booking");
  }

  return data;
};

// GET - Vendor Booking Requests
export const getVendorBookingRequests = async () => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/vendor-booking-requests`,
    {
      headers,
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch vendor booking requests"
    );
  }

  return data;
};

// PATCH - Accept / Reject Booking (Vendor)
export const updateBookingStatus = async (
  bookingId: string,
  status: "accepted" | "rejected"
) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update booking");
  }

  return data;
};
