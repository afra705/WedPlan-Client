
"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Eye, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Booking } from "@/type/bookings";
import { cancelBooking, getMyBookings } from "@/app/all-api/bookings";



const MyBookingsPage = () => {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);
    
  // Get customer bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (isPending) return;

      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMyBookings(session.user.email);
        setBookings(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session, isPending]);

  // Cancel booking
const handleCancel = async (bookingId: string) => {
  toast("Are you sure you want to cancel this booking?", {
    action: {
      label: "Yes, Cancel",
      onClick: async () => {
        try {
          setCancellingId(bookingId);

          await cancelBooking(bookingId, session!.user.email);

          setBookings((previousBookings) =>
            previousBookings.map((booking) =>
              booking._id === bookingId
                ? { ...booking, status: "cancelled" }
                : booking
            )
          );

          toast.success("Booking cancelled successfully!");
        } catch (error) {
          console.error(error);
          toast.error("Failed to cancel booking.");
        } finally {
          setCancellingId(null);
        }
      },
    },
    cancel: {
      label: "No",
      onClick: () => {},
    },
  });
};

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F5]">
        <Loader2 className="animate-spin text-[#8B3A4C]" size={35} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <h2 className="text-3xl font-bold text-[#4A1F2A]">
          My Bookings
        </h2>

        <p className="mt-2 text-sm text-[#8B7478]">
          View and track all of your wedding service bookings.
        </p>

        {/* Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#EADDE0] bg-white shadow-sm">
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-[#F8F0F1] text-sm text-[#4A1F2A]">
                  <tr>
                    <th className="px-5 py-4">Service</th>
                    <th className="px-5 py-4">Vendor</th>
                    <th className="px-5 py-4">Event Date</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Request Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0E5E7]">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="text-sm">

                      {/* Service */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.service?.image || "/placeholder.png"}
                            alt={booking.service?.serviceName || "Service"}
                            className="h-12 w-12 rounded-lg object-cover"
                          />

                          <span className="font-semibold text-[#4A1F2A]">
                            {booking.service?.serviceName || "Service"}
                          </span>
                        </div>
                      </td>

                      {/* Vendor */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#4A1F2A]">
                          {booking.service?.vendorName || "N/A"}
                        </p>
                        <p className="mt-1 text-xs text-[#8B7478]">
                          {booking.service?.vendorEmail || ""}
                        </p>
                      </td>

                      {/* Event Date */}
                      <td className="px-5 py-4 text-[#6F555A]">
                        {formatDate(booking.eventDate)}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4 text-[#6F555A]">
                        {booking.eventLocation}
                      </td>

                      {/* Request Date */}
                      <td className="px-5 py-4 text-[#6F555A]">
                        {formatDate(booking.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            booking.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : booking.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            title="View Details"
                            className="rounded-lg border border-[#EADDE0] p-2 text-[#8B3A4C] transition hover:bg-[#F8F0F1]"
                          >
                            <Eye size={17} />
                          </button>

                          {booking.status === "pending" && (
                            <button
                              onClick={() => handleCancel(booking._id)}
                              disabled={cancellingId === booking._id}
                              title="Cancel Booking"
                              className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {cancellingId === booking._id ? (
                                <Loader2 size={17} className="animate-spin" />
                              ) : (
                                <X size={17} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <CalendarDays
                size={42}
                className="mx-auto mb-3 text-[#B5A3A7]"
              />
              <h3 className="text-lg font-semibold text-[#4A1F2A]">
                No Bookings Yet
              </h3>
              <p className="mt-2 text-sm text-[#8B7478]">
                You have not submitted any booking requests yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#4A1F2A]">
                Booking Details
              </h3>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={selectedBooking.service?.image || "/placeholder.png"}
              alt="Service"
              className="mb-5 h-48 w-full rounded-xl object-cover"
            />

            <div className="space-y-3 text-sm">
              <p>
                <strong>Service:</strong>{" "}
                {selectedBooking.service?.serviceName || "N/A"}
              </p>

              <p>
                <strong>Vendor:</strong>{" "}
                {selectedBooking.service?.vendorName || "N/A"}
              </p>

              <p>
                <strong>Vendor Email:</strong>{" "}
                {selectedBooking.service?.vendorEmail || "N/A"}
              </p>

              <p>
                <strong>Event Date:</strong>{" "}
                {formatDate(selectedBooking.eventDate)}
              </p>

              <p>
                <strong>Event Location:</strong>{" "}
                {selectedBooking.eventLocation}
              </p>

              <p>
                <strong>Request Date:</strong>{" "}
                {formatDate(selectedBooking.createdAt)}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">
                  {selectedBooking.status}
                </span>
              </p>

              <p>
                <strong>Additional Message:</strong>{" "}
                {selectedBooking.message || "No additional message"}
              </p>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full rounded-xl bg-[#4A1F2A] py-3 font-semibold text-white transition hover:bg-[#722F3E]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
