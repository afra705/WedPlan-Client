
"use client";

import { useState } from "react";
import { Eye, X, Mail, ShieldCheck, Crown, UserRound } from "lucide-react";
import { User } from "@/type/types";



const UserDetailsButton = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);

  const role = user.role || "customer";
const plan =
  user.subscriptionPlan?.toLowerCase() === "premium"
    ? "Premium"
    : "Free";

const status = user.isBlocked ? "Inactive" : "Active";

  return (
    <>
      {/* Details Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
      >
        <Eye size={14} />
        Details
      </button>

      {/* Details Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <h2 className="text-xl font-bold text-[#4A1F2A]">
              User Details
            </h2>

            <p className="mt-1 text-sm text-[#8B7478]">
              View registered user information.
            </p>

            {/* User Image */}
            <div className="mt-6 flex flex-col items-center">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5E4D8] text-2xl font-bold text-[#722F3E]">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <h3 className="mt-3 text-lg font-bold text-[#4A1F2A]">
                {user.name}
              </h3>

              <p className="text-sm text-[#8B7478]">
                {user.email}
              </p>
            </div>

            {/* User Information */}
            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between border-b border-[#F0E7E9] pb-3">
                <span className="text-sm text-[#8B7478]">User ID</span>
                <span className="text-sm font-medium text-[#4A1F2A]">
                  {user.id.slice(0, 12)}...
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#F0E7E9] pb-3">
                <span className="text-sm text-[#8B7478]">Role</span>
                <span className="flex items-center gap-1 text-sm font-semibold capitalize text-[#722F3E]">
                  <UserRound size={15} />
                  {role}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#F0E7E9] pb-3">
                <span className="text-sm text-[#8B7478]">Email</span>
                <span className="flex items-center gap-1 text-sm text-[#4A1F2A]">
                  <Mail size={14} />
                  {user.email}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#F0E7E9] pb-3">
                <span className="text-sm text-[#8B7478]">Plan</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-[#B87965]">
                  <Crown size={15} />
                  {plan}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8B7478]">Status</span>
                <span className={`text-sm font-semibold ${
                  status === "Active" ? "text-green-600" : "text-red-600"
                }`}>
                  {status}
                </span>
              </div>

            </div>

            {/* Footer */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-7 w-full rounded-xl bg-[#4A1F2A] py-3 text-sm font-semibold text-white transition hover:bg-[#722F3E]"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default UserDetailsButton;
