
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  UserRound,
  Mail,
  Ban,
  Eye,
  Crown,
  CircleCheck,
  CircleX,
} from "lucide-react";

const ManageUsersPage = async () => {
  // Get logged-in user
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Only admin can access this page
  const currentUser = session.user as typeof session.user & {
    role?: string;
  };

  if (currentUser.role !== "admin") {
    redirect("/dashboard");
  }

  // Get all registered users
  let users: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
    plan?: string;
    banned?: boolean;
  }[] = [];

  let totalUsers = 0;

  try {
    const result = await auth.api.listUsers({
      query: {
        limit: 100,
        offset: 0,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
      headers: requestHeaders,
    });

    users = result.users as typeof users;
    totalUsers = result.total;
  } catch (error) {
    console.error("Failed to load users:", error);
  }

  // Calculate user statistics
  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const vendorCount = users.filter(
    (user) => user.role === "vendor"
  ).length;

  const customerCount = users.filter(
    (user) => user.role === "customer"
  ).length;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Admins",
      value: adminCount,
      icon: ShieldCheck,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Vendors",
      value: vendorCount,
      icon: BriefcaseBusiness,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Customers",
      value: customerCount,
      icon: UserRound,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#B87965]">
          <Users size={18} />

          <span className="text-xs font-semibold uppercase tracking-[2px]">
            Admin Dashboard
          </span>
        </div>

        <h2 className="mt-2 text-3xl font-bold text-[#4A1F2A]">
          Manage Users
        </h2>

        <p className="mt-2 text-sm text-[#8B7478]">
          View and manage all registered vendors and customers.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[#F0E7E9] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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
            </div>
          );
        })}
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-[#F0E7E9] bg-white">

        {/* Table Header */}
        <div className="flex flex-col justify-between gap-2 border-b border-[#F0E7E9] p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold text-[#4A1F2A]">
              All Registered Users
            </h3>

            <p className="mt-1 text-xs text-[#9A8589]">
              Total {totalUsers} registered accounts
            </p>
          </div>

          <div className="rounded-lg bg-[#F5E4D8] px-4 py-2 text-sm font-semibold text-[#722F3E]">
            {users.length} Users Loaded
          </div>
        </div>

        {users.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
            <Users size={45} className="mb-4 text-[#C6A15B]" />

            <h3 className="text-lg font-semibold text-[#4A1F2A]">
              No Users Found
            </h3>

            <p className="mt-2 text-sm text-[#8B7478]">
              Registered users will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">

              <thead className="bg-[#F5E4D8] text-sm text-[#4A1F2A]">
                <tr>
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Plan</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0E7E9]">
                {users.map((user) => {
                  const role = user.role || "customer";
                  const isAdmin = role === "admin";

                  const roleStyle =
                    role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : role === "vendor"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700";

                  const plan =
                    user.plan?.toLowerCase() === "premium"
                      ? "Premium"
                      : "Free";

                  return (
                    <tr
                      key={user.id}
                      className="transition hover:bg-[#FAF5F0]"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5E4D8] font-bold text-[#722F3E]">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-[#4A1F2A]">
                              {user.name}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#9A8589]">
                              <Mail size={13} />
                              {user.email}
                            </div>
                          </div>

                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            plan === "Premium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {plan === "Premium" && (
                            <Crown size={13} />
                          )}
                          {plan}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${roleStyle}`}
                        >
                          {role === "admin" && (
                            <ShieldCheck size={13} />
                          )}

                          {role === "vendor" && (
                            <BriefcaseBusiness size={13} />
                          )}

                          {role === "customer" && (
                            <UserRound size={13} />
                          )}

                          {role}
                        </span>
                      </td>

                      {/* Status and Block/Unblock UI */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          {isAdmin ? (
                            <>
                              <CircleCheck
                                size={16}
                                className="text-green-600"
                              />
                              <span className="text-xs font-semibold text-green-600">
                                Active
                              </span>
                            </>
                          ) : (
                            <div>
                              <input
                                type="checkbox"
                                id={`block-${user.id}`}
                                defaultChecked={user.banned || false}
                                className="peer sr-only"
                              />

                              <label
                                htmlFor={`block-${user.id}`}
                                className="hidden"
                              />

                              <style>
                                {`
                                  #block-${user.id}:checked ~ .status-label .active-status {
                                    display: none;
                                  }
                                  #block-${user.id}:checked ~ .status-label .inactive-status {
                                    display: inline-flex;
                                  }
                                  #block-${user.id}:not(:checked) ~ .status-label .active-status {
                                    display: inline-flex;
                                  }
                                  #block-${user.id}:not(:checked) ~ .status-label .inactive-status {
                                    display: none;
                                  }
                                `}
                              </style>

                              <label
                                htmlFor={`block-${user.id}`}
                                className="status-label flex cursor-pointer items-center gap-2"
                              >
                                <span className="active-status items-center gap-1.5 text-xs font-semibold text-green-600">
                                  <CircleCheck size={16} />
                                  Active
                                </span>

                                <span className="inactive-status items-center gap-1.5 text-xs font-semibold text-red-600">
                                  <CircleX size={16} />
                                  Inactive
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          {/* View Details */}
                          <button
                            type="button"
                            className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                          >
                            <Eye size={14} />
                            Details
                          </button>

                          {/* Admin cannot be blocked */}
                          {!isAdmin && (
                            <div>
                              <input
                                type="checkbox"
                                id={`action-${user.id}`}
                                defaultChecked={user.banned || false}
                                className="peer sr-only"
                              />

                              <label
                                htmlFor={`action-${user.id}`}
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 peer-checked:hidden"
                              >
                                <Ban size={14} />
                                Block
                              </label>

                              <label
                                htmlFor={`action-${user.id}`}
                                className="hidden cursor-pointer items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100 peer-checked:flex"
                              >
                                <ShieldCheck size={14} />
                                Unblock
                              </label>
                            </div>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default ManageUsersPage;
