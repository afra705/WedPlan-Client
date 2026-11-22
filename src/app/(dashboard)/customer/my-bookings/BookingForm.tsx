
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  MapPin,
  Sparkles,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { createBooking } from "@/app/all-api/bookings";

type BookingFormProps = {
  serviceId: string;
  vendorId: string;
  vendorEmail: string;
};

const BookingForm = ({
  serviceId,
  vendorId,
  vendorEmail,
}: BookingFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check login
   // Check login
if (!session?.user?.email) {
  toast.error("Please login first!");
  return;
}

// Only customers can book
if (session.user.role !== "customer") {
  toast.error("Only customers can book services!");
  return;
}

// Prevent booking own service
if (
  session.user.email.toLowerCase() === vendorEmail.toLowerCase()
) {
  toast.error("You cannot book your own service!");
  return;
}

    // Check required fields
    if (!eventDate || !eventLocation.trim()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        serviceId,
        vendorId,
        customerId: session.user.email,
        eventDate,
        eventLocation: eventLocation.trim(),
        message: message.trim(),
      };

      await createBooking(bookingData);

      toast.success("Booking request submitted successfully!");

      router.push("/customer/my-bookings");
} catch (error) {
  toast.error(
    error instanceof Error
      ? error.message
      : "Failed to submit booking!"
  );
} finally {
  setLoading(false);
}
  };

  return (
    <form onSubmit={handleBooking} className="space-y-4 p-6">
      <h2 className="text-base font-bold text-[#4A1F2A]">
        Book this service
      </h2>

      <div>
        <label
          htmlFor="eventDate"
          className="mb-2 block text-sm font-semibold text-[#4A1F2A]"
        >
          Event Date
        </label>

        <div className="relative">
          <CalendarDays
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A89599]"
          />

          <input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
            className="w-full rounded-xl border border-[#EADDE0] bg-[#FCF9F9] py-3 pl-11 pr-4 text-sm text-[#4A1F2A] outline-none transition focus:border-[#B1556B] focus:bg-white focus:ring-2 focus:ring-[#B1556B]/10"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="eventLocation"
          className="mb-2 block text-sm font-semibold text-[#4A1F2A]"
        >
          Event Location
        </label>

        <div className="relative">
          <MapPin
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A89599]"
          />

          <input
            id="eventLocation"
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            placeholder="Enter event location"
            required
            className="w-full rounded-xl border border-[#EADDE0] bg-[#FCF9F9] py-3 pl-11 pr-4 text-sm text-[#4A1F2A] outline-none transition placeholder:text-[#B5A3A7] focus:border-[#B1556B] focus:bg-white focus:ring-2 focus:ring-[#B1556B]/10"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-semibold text-[#4A1F2A]"
        >
          Additional Message
          <span className="ml-1 font-normal text-[#A99599]">
            (Optional)
          </span>
        </label>

        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your requirements..."
          className="w-full resize-none rounded-xl border border-[#EADDE0] bg-[#FCF9F9] px-4 py-3 text-sm text-[#4A1F2A] outline-none transition placeholder:text-[#B5A3A7] focus:border-[#B1556B] focus:bg-white focus:ring-2 focus:ring-[#B1556B]/10"
        />
      </div>

      {/* Book Now Button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-[#8B3A4C] via-[#722F3E] to-[#4A1F2A] px-5 py-3.5 text-sm font-semibold text-white shadow-lg ring-1 ring-[#C6A15B]/40 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#C6A15B]/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        <Sparkles
          size={16}
          className="relative text-[#E4C98A]"
        />

        <span className="relative">
          {loading ? "Submitting..." : "Book Now"}
        </span>
      </button>

      <p className="text-center text-xs text-[#A99599]">
        {loading
          ? "Please wait, submitting your booking..."
          : "Submit your booking request to get started."}
      </p>
    </form>
  );
};

export default BookingForm;
