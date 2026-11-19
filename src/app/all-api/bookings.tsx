
import { Booking } from "@/type/bookings";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// POST - Create Booking
export const createBooking = async (bookingData: Partial<Booking>) => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create booking");
  }

  return data;
};

// GET - Customer Bookings
export const getMyBookings = async (customerId: string) => {
  const response = await fetch(
    `${API_URL}/my-bookings/${encodeURIComponent(customerId)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return response.json();
};

// PATCH - Cancel Booking
export const cancelBooking = async (
  bookingId: string,
  customerId: string
) => {
  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/cancel`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerId }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel booking");
  }

  return data;
};


// vendorbooking



// Get vendor booking requests
export const getVendorBookingRequests = async (
  vendorId: string
): Promise<Booking[]> => {
  const response = await fetch(
    `${API_URL}/vendor-booking-requests/${vendorId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch booking requests");
  }

  return response.json();
};


// Accept or Reject booking
export const updateBookingStatus = async (
  bookingId: string,
  vendorId: string,
  status: "accepted" | "rejected"
) => {
  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendorId,
        status,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update booking");
  }

  return response.json();
};
