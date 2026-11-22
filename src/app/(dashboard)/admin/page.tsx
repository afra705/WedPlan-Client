
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  CreditCard,
  Users,
  Sparkles,
} from "lucide-react";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/app/all-api/get-current-user";
import { getServices } from "@/app/all-api/service";
import { getUserStats } from "@/app/all-api/user";
import { getDashboardPath, isAdmin } from "@/lib/roles";
import { Service } from "@/type/types";
import { getServerToken } from "@/app/all-api/get-current-user";


const AdminOverviewPage = async () => {
  // Check current user
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!isAdmin(user)) {
    redirect(getDashboardPath(user));
  }

  // Dashboard data
 // Dashboard data
let services: Service[] = [];
let totalVendors = 0;
let totalCustomers = 0;

try {
  const token = await getServerToken();

  const [serviceData, userStats] = await Promise.all([
    getServices(token),
    getUserStats(token),
  ]);

  services = serviceData;
  totalVendors = userStats.totalVendors;
  totalCustomers = userStats.totalCustomers;
} catch (error) {
  console.error("Dashboard data error:", error);
}

  // Service statistics
  const totalServices = services.length;

  const pendingServices = services.filter(
    (service) => service.status === "pending"
  ).length;

  const approvedServices = services.filter(
    (service) => service.status === "approved"
  ).length;

  const rejectedServices = services.filter(
    (service) => service.status === "rejected"
  ).length;

  // Dashboard cards
  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      description: "All registered services",
      icon: BriefcaseBusiness,
      bg: "bg-[#F8EDF0]",
      color: "text-[#8B354B]",
    },
    {
      title: "Pending Services",
      value: pendingServices,
      description: "Waiting for approval",
      icon: Clock,
      bg: "bg-[#FFF4E5]",
      color: "text-[#D28A2E]",
    },
    {
      title: "Approved Services",
      value: approvedServices,
      description: "Successfully approved",
      icon: CheckCircle2,
      bg: "bg-[#EAF5EE]",
      color: "text-[#37845A]",
    },
    {
      title: "Total Vendors",
      value: totalVendors,
      description: "Registered service providers",
      icon: Users,
      bg: "bg-[#EEF0FA]",
      color: "text-[#5966A5]",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      description: "Registered customers",
      icon: Users,
      bg: "bg-[#EAF5EE]",
      color: "text-[#37845A]",
    },
    {
      title: "Total Transactions",
      value: 0,
      description: "Payment overview",
      icon: CreditCard,
      bg: "bg-[#F8EDF0]",
      color: "text-[#8B354B]",
    },
  ];

  // Calculate percentage
  const getPercentage = (value: number) => {
    return totalServices > 0
      ? (value / totalServices) * 100
      : 0;
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#A65B6D]" />

          <span className="text-sm font-medium text-[#A65B6D]">
            Admin Dashboard
          </span>
        </div>

        <h1 className="mt-2 text-3xl font-bold text-[#4A1F2A]">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-sm text-[#8B7478]">
          Welcome back! Here&apos;s what&apos;s happening with WedPlan.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#F0E5E7] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-[#8B7478]">
                    {stat.title}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold text-[#4A1F2A]">
                    {stat.value.toLocaleString()}
                  </h3>

                  <p className="mt-2 text-xs text-[#A89599]">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Service Overview */}
      <div className="rounded-2xl border border-[#F0E5E7] bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#4A1F2A]">
            Service Overview
          </h2>

          <p className="mt-1 text-sm text-[#8B7478]">
            Overview of all vendor service submissions.
          </p>
        </div>

        <div className="space-y-6">

          {/* Pending Services */}
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-[#6B5157]">
                Pending Services
              </span>

              <span className="font-semibold text-[#D28A2E]">
                {pendingServices}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#F4EDEF]">
              <div
                className="h-full rounded-full bg-[#D9A04C] transition-all"
                style={{
                  width: `${getPercentage(pendingServices)}%`,
                }}
              />
            </div>
          </div>

          {/* Approved Services */}
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-[#6B5157]">
                Approved Services
              </span>

              <span className="font-semibold text-[#37845A]">
                {approvedServices}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#F4EDEF]">
              <div
                className="h-full rounded-full bg-[#5A9B72] transition-all"
                style={{
                  width: `${getPercentage(approvedServices)}%`,
                }}
              />
            </div>
          </div>

          {/* Rejected Services */}
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-[#6B5157]">
                Rejected Services
              </span>

              <span className="font-semibold text-red-500">
                {rejectedServices}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#F4EDEF]">
              <div
                className="h-full rounded-full bg-red-400 transition-all"
                style={{
                  width: `${getPercentage(rejectedServices)}%`,
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Recent Services */}
      <div className="rounded-2xl border border-[#F0E5E7] bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#4A1F2A]">
            Recent Services
          </h2>

          <p className="mt-1 text-sm text-[#8B7478]">
            Latest services submitted by vendors.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="py-10 text-center">
            <BriefcaseBusiness className="mx-auto h-10 w-10 text-[#C9B5BA]" />

            <p className="mt-3 text-sm text-[#8B7478]">
              No services found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px] text-left">

              <thead>
                <tr className="border-b border-[#F0E5E7] text-xs uppercase tracking-wider text-[#A89599]">
                  <th className="pb-4 font-semibold">Service</th>
                  <th className="pb-4 font-semibold">Vendor</th>
                  <th className="pb-4 font-semibold">Category</th>
                  <th className="pb-4 font-semibold">Price</th>
                  <th className="pb-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {services.slice(0, 5).map((service) => (
                  <tr
                    key={service._id}
                    className="border-b border-[#F8F1F2] last:border-0"
                  >
                    <td className="py-4 text-sm font-semibold text-[#4A1F2A]">
                      {service.serviceName}
                    </td>

                    <td className="py-4 text-sm text-[#8B7478]">
                      {service.vendorName || "Vendor"}
                    </td>

                    <td className="py-4 text-sm text-[#8B7478]">
                      {service.category}
                    </td>

                    <td className="py-4 text-sm font-medium text-[#4A1F2A]">
                      ${service.price.toLocaleString()}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          service.status === "approved"
                            ? "bg-[#EAF5EE] text-[#37845A]"
                            : service.status === "rejected"
                              ? "bg-red-50 text-red-500"
                              : "bg-[#FFF4E5] text-[#D28A2E]"
                        }`}
                      >
                        {service.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOverviewPage;
