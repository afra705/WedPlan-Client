"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";

const SubscriptionSuccessPage = () => {
  const { data: session } = useSession();

  // Read-only: the backend (Stripe webhook) is the only thing that upgrades a plan.
  const currentPlan = (
    session?.user?.subscriptionPlan || "free"
  ).toLowerCase();

  const isPremium = currentPlan === "premium";

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-2xl border border-[#EAD8DC] bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-[#F0E4E6] bg-[#FAF5F0] px-6 py-9 text-center">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                isPremium
                  ? "bg-[#E8F5EB] text-[#278348]"
                  : "bg-[#F8E9EC] text-[#8B354B]"
              }`}
            >
              {isPremium ? (
                <CheckCircle2 size={34} />
              ) : (
                <Clock3 size={34} />
              )}
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#4A1F2A]">
              {isPremium ? "Premium is active" : "Payment received"}
            </h2>

            <p className="mt-2 text-sm text-[#8B7478]">
              {isPremium
                ? "Thank you for upgrading to WedPlan Premium."
                : "Thank you! We are verifying your payment."}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-7 sm:px-8">
            <p className="text-sm leading-6 text-[#6F555B]">
              {isPremium
                ? "Your account now shows the Premium plan. You can publish unlimited active services and enjoy all premium vendor features."
                : "Stripe has sent us your payment. This verification usually takes a few moments. Refresh this page or open your Subscription page to see your updated plan."}
            </p>

            <div className="mt-6 flex gap-3 rounded-xl border border-[#F0E4E6] bg-[#FFF9F5] p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#C6A15B]"
              />

              <div>
                <p className="text-sm font-semibold text-[#4A1F2A]">
                  Secure activation
                </p>

                <p className="mt-1 text-xs leading-5 text-[#8B7478]">
                  For your security, Premium is activated only after Stripe
                  confirms the payment on our server. This page never changes
                  your plan by itself.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/vendor/subscription"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#8B354B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6F263A]"
              >
                Back to Subscription
              </Link>

              <Link
                href="/vendor"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E7D5CC] bg-white px-5 py-3 text-sm font-semibold text-[#722F3E] transition hover:bg-[#FAF5F0]"
              >
                Vendor Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;
