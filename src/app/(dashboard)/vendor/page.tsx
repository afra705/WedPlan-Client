
import {
  BriefcaseBusiness,
  CheckCircle2,
  CalendarCheck,
  Clock,
  Crown,
  Sparkles,
} from "lucide-react";

import { getVendorServices } from "@/app/all-api/service";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/all-api/get-current-user";
import { getDashboardPath, isVendor } from "@/lib/roles";

type Service = {
  _id: string;
  vendorId: string;
  vendorEmail: string;
  status: string;
};

const VendorOverviewPage = async () => {
  // Get logged-in user
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!isVendor(user)) {
    redirect(getDashboardPath(user));
  }

  // Get only logged-in vendor's services
  let services: Service[] = [];

  try {
    const data = await getVendorServices(user.id);
    services = data;
  } catch (error) {
    console.error("Dashboard error:", error);
  }

  // Calculate statistics
  const totalServices = services.length;

  const activeServices = services.filter(
    (service) => service.status === "approved"
  ).length;

  const pendingServices = services.filter(
    (service) => service.status === "pending"
  ).length;

  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      description: "Total services added",
      icon: BriefcaseBusiness,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Services",
      value: activeServices,
      description: "Approved services",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Pending Services",
      value: pendingServices,
      description: "Waiting for approval",
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Accepted Bookings",
      value: 0,
      description: "Successfully accepted bookings",
      icon: CalendarCheck,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#B87965]">
          <Sparkles size={18} />

          <span className="text-xs font-semibold uppercase tracking-[2px]">
            Vendor Dashboard
          </span>
        </div>

        <h2 className="mt-2 text-3xl font-bold text-[#4A1F2A]">
          Overview
        </h2>

        <p className="mt-2 text-sm text-[#8B7478]">
          Welcome back! Here is a summary of your business.
        </p>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A1F2A] to-[#824557] p-8 text-white">
        <div className="relative z-10 max-w-lg">

          <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
            Your Business at a Glance
          </span>

          <h3 className="mt-5 text-2xl font-bold sm:text-3xl">
            Grow Your Business with WedPlan
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/75">
            Manage your services, track your business performance,
            and build meaningful connections with customers.
          </p>
        </div>

        <Sparkles
          size={160}
          className="absolute -right-5 -top-5 text-white/10"
        />
      </div>

   {/* Subscription */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-[#4A1F2A]">
          Current Subscription
        </h3>

        <div className="relative overflow-hidden rounded-2xl border border-[#EBD8D0] bg-[#FFF9F5] p-7">

          <div className="relative z-10 flex items-center gap-5">

            <div className="rounded-2xl bg-[#4A1F2A] p-4 text-white">
              <Crown size={28} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#B87965]">
                Your Current Plan
              </p>

              <h3 className="mt-1 text-2xl font-bold text-[#4A1F2A]">
                Free Plan
              </h3>

              <p className="mt-1 text-sm text-[#947E82]">
                Upgrade your plan to unlock more features.
              </p>
            </div>

          </div>

          <Sparkles
            size={120}
            className="absolute -bottom-8 -right-5 text-[#B87965]/10"
          />
        </div>
      </div>
      {/* Statistics */}
      <div>
        <h3 className="text-lg font-bold text-[#4A1F2A]">
          Business Statistics
        </h3>

        <p className="mt-1 text-xs text-[#9A8589]">
          An overview of your service performance
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-[#F0E7E9] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`w-fit rounded-xl p-3 ${item.color}`}>
                  <Icon size={23} />
                </div>

                <p className="mt-5 text-sm font-medium text-[#907C80]">
                  {item.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-[#4A1F2A]">
                  {item.value}
                </h3>

                <p className="mt-2 text-xs text-[#A8979A]">
                  {item.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>

   

    </div>
  );
};

export default VendorOverviewPage;
