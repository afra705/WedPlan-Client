"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Check,
  Crown,
  CreditCard,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import { createCheckoutSession } from "@/app/all-api/payment";
import {
  formatSubscriptionExpiry,
  getActivePlan,
} from "@/lib/subscription";

const SubscriptionPage = () => {
  const { data: session, isPending, refetch } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  
  const vendorId = session?.user?.id;


  const currentPlan = getActivePlan(session?.user);

  const renewalDate =
    currentPlan === "premium"
      ? formatSubscriptionExpiry(session?.user?.subscriptionExpiresAt)
      : null;


  useEffect(() => {
    if (isPending || currentPlan === "premium") return;

    void refetch();
  }, [isPending, currentPlan, refetch]);

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Get started with the basic vendor features.",
      features: [
        "Maximum 3 Active Services",
        "Basic Vendor Dashboard",
        "Booking Request Management",
      ],
    },
    {
      name: "Premium",
      price: "$19",
      description: "Unlock all features and grow your business.",
      features: [
        "Unlimited Active Services",
        "Premium Vendor Badge",
        "Booking Request Management",
        "Basic Vendor Dashboard",
      ],
    },
  ];

  const handleUpgrade = async () => {
    // Prevent repeated clicks while the request / redirect is running.
    if (isLoading) return;

    if (!vendorId) {
      toast.error("Please sign in as a vendor to upgrade.");
      return;
    }

    try {
      setIsLoading(true);

      const data = await createCheckoutSession(vendorId);

      // Send the vendor to Stripe Checkout.
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not start checkout. Please try again."
      );

      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A1F2A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#4A1F2A]">
          Subscription
        </h2>
        <p className="mt-2 text-sm text-[#8B7478]">
          Manage your vendor subscription plan and billing details.
        </p>
      </div>

      {/* Current Plan */}
      <div
        className={`mb-8 rounded-2xl border p-5 shadow-sm sm:p-6 ${
          currentPlan === "premium"
            ? "border-amber-200 bg-amber-50"
            : "border-[#EAD8DC] bg-white"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                currentPlan === "premium"
                  ? "bg-amber-500 text-white"
                  : "bg-[#F8E9EC] text-[#8B354B]"
              }`}
            >
              {currentPlan === "premium" ? (
                <Crown size={24} />
              ) : (
                <BriefcaseBusiness size={24} />
              )}
            </div>

            <div>
              <p className="text-sm text-[#8B7478]">
                Current Subscription
              </p>
              <h3 className="text-xl font-bold capitalize text-[#4A1F2A]">
                {currentPlan} Plan
              </h3>

              {renewalDate && (
                <p className="mt-1 text-xs font-medium text-[#B87965]">
                  Renews on {renewalDate}
                </p>
              )}
            </div>
          </div>

          <span
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
              currentPlan === "premium"
                ? "bg-amber-100 text-amber-700"
                : "bg-[#E8F5EB] text-[#278348]"
            }`}
          >
            Active
          </span>
        </div>
      </div>

      {/* Plans */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#4A1F2A]">
            Available Plans
          </h3>
          <p className="mt-1 text-sm text-[#8B7478]">
            Choose the right plan for your business.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {plans.map((plan) => {
            const isCurrent =
              currentPlan === plan.name.toLowerCase();

            const isPremium = plan.name === "Premium";

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                  isPremium
                    ? "border-[#8B354B] ring-1 ring-[#8B354B]"
                    : "border-[#EAD8DC]"
                }`}
              >
                {isPremium && (
                  <span className="absolute -top-3 right-6 flex items-center gap-1 rounded-full bg-[#8B354B] px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles size={13} />
                    Recommended
                  </span>
                )}

                <div className="mb-5">
                  <h4 className="text-xl font-bold text-[#4A1F2A]">
                    {plan.name}
                  </h4>

                  <p className="mt-2 text-sm text-[#8B7478]">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6 flex items-end gap-1">
                  <span className="text-4xl font-bold text-[#4A1F2A]">
                    {plan.price}
                  </span>
                  <span className="pb-1 text-sm text-[#8B7478]">
                    {isPremium ? "/ month" : "/ forever"}
                  </span>
                </div>

                <div className="mb-7 border-t border-[#F0E4E6] pt-5">
                  <p className="mb-4 text-sm font-semibold text-[#4A1F2A]">
                    What&apos;s included:
                  </p>

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-[#6F555B]"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F8E9EC]">
                          <Check
                            size={13}
                            className="text-[#8B354B]"
                          />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-[#F2E8EA] py-3 text-sm font-semibold text-[#8B354B]"
                  >
                    Current Plan
                  </button>
                ) : isPremium ? (
                  <button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B354B] py-3 text-sm font-semibold text-white transition hover:bg-[#6F263A] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Redirecting to Stripe...
                      </>
                    ) : (
                      <>
                        <CreditCard size={17} />
                        Upgrade to Premium
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-[#F2E8EA] py-3 text-sm font-semibold text-[#8B354B]"
                  >
                    Included in Premium
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default SubscriptionPage;
