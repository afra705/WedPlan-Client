"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import {
  formatSubscriptionExpiry,
  isPremiumActive,
} from "@/lib/subscription";

const SubscriptionSuccessPage = () => {
  const { data: session, isPending, isRefetching, refetch } =
    useSession();

  
  const isPremium = isPremiumActive(session?.user);

  const renewalDate = isPremium
    ? formatSubscriptionExpiry(session?.user?.subscriptionExpiresAt)
    : null;


  useEffect(() => {
    if (isPending || isPremium) return;

    let attempts = 0;

    const interval = window.setInterval(() => {
      attempts += 1;
      void refetch();

      if (attempts >= 20) {
        window.clearInterval(interval);
      }
    }, 3000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refetch();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.clearInterval(interval);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [isPending, isPremium, refetch]);

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-2xl border border-[#EAD8DC] bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-[#F0E4E6] bg-[#FAF5F0] px-6 py-9 text-center">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                isPremium
                  ? "bg-amber-100 text-amber-600"
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
                : "Stripe has sent us your payment. This verification usually takes a few moments. We check for confirmation automatically, and the page updates as soon as Stripe confirms it."}
            </p>

            {isPremium && renewalDate && (
              <p className="mt-3 text-sm font-medium text-[#B87965]">
                Renews on {renewalDate}
              </p>
            )}

            {!isPremium && (
              <p className="mt-4 flex items-center gap-2 text-xs font-medium text-[#8B7478]">
                <Loader2
                  size={14}
                  className={`animate-spin ${
                    isRefetching ? "" : "opacity-60"
                  }`}
                />
                {isRefetching
                  ? "Checking Stripe confirmation..."
                  : "Waiting for Stripe confirmation..."}
              </p>
            )}

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
