"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, CalendarDays, MapPin, Check, X } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Booking } from "@/type/bookings";

import {
  getVendorBookingRequests,
  updateBookingStatus,
} from "@/app/all-api/bookings";

const BookingRequestsPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const vendorId = session?.user?.id;

  // Get booking requests

useEffect(() => {
  if (isPending || !vendorId) return;

  const fetchBookings = async () => {
    try {
      const data = await getVendorBookingRequests(vendorId);
      setBookings(data);
    } catch (error) {
      toast.error("Failed to load booking requests");
    } finally {
      setLoading(false);
    }
  };

  fetchBookings();
}, [vendorId, isPending]);


  // Accept or Reject booking
  const handleStatusChange = async (
    bookingId: string,
    status: "accepted" | "rejected"
  ) => {
    if (!vendorId) return;

    try {
      setProcessingId(bookingId);

      await updateBookingStatus(bookingId, vendorId, status);

      // Update UI without reloading the page
      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status }
            : booking
        )
      );

      toast.success(
        `Booking ${status} successfully!`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="animate-spin text-[#4A1F2A]" size={32} />
      </div>
    );
  }

  if (!vendorId) {
    return <p className="p-6">Please login first.</p>;
  }

 
return (
  <div className="min-h-screen bg-[#FAF7F5] px-4 py-10">
    <div className="mx-auto max-w-7xl">

      <h2 className="text-2xl font-bold text-[#4A1F2A]">
        Booking Requests
      </h2>

      <p className="mt-2 text-sm text-[#8B7478]">
        Review and respond to booking requests from your customers.
      </p>

      {bookings.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-10 text-center">
          <CalendarDays
            size={40}
            className="mx-auto text-[#8B7478]"
          />
          <h3 className="mt-4 text-lg font-semibold text-[#4A1F2A]">
            No Booking Requests
          </h3>
          <p className="mt-2 text-sm text-[#8B7478]">
            You haven&apos;t received any booking requests yet.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#EADDDD] bg-white shadow-sm">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">

              <thead className="bg-[#F0E7E5]">
                <tr className="text-sm text-[#4A1F2A]">
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Service</th>
                  <th className="px-5 py-4 font-semibold">Event Date</th>
                  <th className="px-5 py-4 font-semibold">Location</th>
                  <th className="px-5 py-4 font-semibold">Message</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0E7E5]">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-[#FAF7F5]"
                  >

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#4A1F2A]">
                        {booking.customerId}
                      </p>
                    </td>

                    {/* Service */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {booking.service?.image && (
                          <img
                            src={booking.service.image}
                            alt={booking.service.serviceName}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <span className="text-sm font-medium text-[#4A1F2A]">
                          {booking.service?.serviceName || "Unavailable"}
                        </span>
                      </div>
                    </td>

                    {/* Event Date */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-[#8B7478]">
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <p className="flex items-center gap-1 text-sm text-[#8B7478]">
                        <MapPin size={14} />
                        {booking.eventLocation}
                      </p>
                    </td>

                    {/* Message */}
                    <td className="max-w-[180px] px-5 py-4">
                      <p className="truncate text-sm text-[#8B7478]" title={booking.message}>
                        {booking.message || "No message"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      {booking.status === "pending" ? (
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              handleStatusChange(booking._id, "accepted")
                            }
                            disabled={processingId === booking._id}
                            className="rounded-lg bg-green-600 p-2 text-white transition hover:bg-green-700 disabled:opacity-50"
                            title="Accept"
                          >
                            {processingId === booking._id ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <Check size={17} />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              handleStatusChange(booking._id, "rejected")
                            }
                            disabled={processingId === booking._id}
                            className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700 disabled:opacity-50"
                            title="Reject"
                          >
                            <X size={17} />
                          </button>

                        </div>
                      ) : (
                        <p className="text-center text-xs text-gray-400">
                          Processed
                        </p>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}

    </div>
  </div>
);

};

export default BookingRequestsPage;
