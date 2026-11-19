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

  if (!response.ok) {
    throw new Error("Failed to create booking");
  }

  return response.json();
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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to cancel booking");
  }

  return response.json();
};
