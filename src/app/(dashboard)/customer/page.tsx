
"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Booking } from "@/type/bookings";
import { getMyBookings } from "@/app/all-api/bookings";



const CustomerOverviewPage = () => {
  const { data: session } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session?.user?.email]);

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "accepted"
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) => booking.status === "rejected"
  ).length;

  const stats = [
    {
      title: "Total Booking Requests",
      count: totalBookings,
      icon: CalendarCheck,
      color: "bg-[#F5E4E8] text-[#8B3A4C]",
    },
    {
      title: "Pending Bookings",
      count: pendingBookings,
      icon: Clock,
      color: "bg-[#FFF0D9] text-[#C08025]",
    },
    {
      title: "Accepted Bookings",
      count: acceptedBookings,
      icon: CheckCircle2,
      color: "bg-[#E4F2E8] text-[#388451]",
    },
    {
      title: "Rejected Bookings",
      count: rejectedBookings,
      icon: XCircle,
      color: "bg-[#FCE6E6] text-[#C34D4D]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-[#4A1F2A]">
          Customer Overview
        </h2>

        <p className="mt-2 text-sm text-[#8B7478]">
          Welcome back! Here is a summary of your bookings and activity.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[#EADDE0] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B7478]">
                    {item.title}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold text-[#4A1F2A]">
                    {loading ? "..." : item.count}
                  </h3>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerOverviewPage;
