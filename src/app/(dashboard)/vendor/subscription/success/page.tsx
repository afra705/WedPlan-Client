
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { getAuthHeaders } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SubscriptionSuccessPage() {
  const [isChecking, setIsChecking] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");

        if (!sessionId) {
          throw new Error("Stripe session ID not found");
        }

        const authHeaders = await getAuthHeaders();

        const response = await fetch(
          `${API_URL}/payments/checkout-verify`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify({ sessionId }),
            cache: "no-store",
          }
        );

        const data = await response.json();

        console.log("Checkout Verify Status:", response.status);
        console.log("Checkout Verify Response:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Payment verification failed"
          );
        }

        if (!cancelled) {
          setIsPremium(true);
        }
      } catch (error) {
        console.error("Payment Verification Error:", error);

        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong"
          );
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    };

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-2xl border border-[#EAD8DC] bg-white shadow-sm">

          {/* Header */}
          <div className="border-b border-[#F0E4E6] bg-[#FAF5F0] px-6 py-9 text-center">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                isChecking
                  ? "bg-[#E8EBDD] text-[#283D32]"
                  : isPremium
                    ? "bg-amber-100 text-amber-600"
                    : "bg-red-100 text-red-500"
              }`}
            >
              {isChecking ? (
                <Clock3 size={34} />
              ) : isPremium ? (
                <CheckCircle2 size={34} />
              ) : (
                <XCircle size={34} />
              )}
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#4A1F2A] sm:text-3xl">
              {isChecking
                ? "Verifying Your Payment"
                : isPremium
                  ? "Premium is Active"
                  : "Verification Failed"}
            </h1>

            <p className="mt-2 text-sm text-[#8B7478]">
              {isChecking
                ? "Please wait while we confirm your payment."
                : isPremium
                  ? "Thank you for upgrading to WedPlan Premium."
                  : "We couldn't verify your payment."}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-7 sm:px-8">

            <p className="text-sm leading-6 text-[#6F555B]">
              {isChecking
                ? "Your payment is being verified securely through Stripe. This usually takes a few moments. Please don't close this page."
                : isPremium
                  ? "Your payment has been verified successfully. Your Premium subscription is now active. You can publish unlimited active services and enjoy all premium vendor features."
                  : "Unfortunately, we couldn't verify your payment. Please try again or contact our support team if the problem continues."}
            </p>

            {/* Loading */}
            {isChecking && (
              <p className="mt-4 flex items-center gap-2 text-xs font-medium text-[#8B7478]">
                <Loader2 size={14} className="animate-spin" />
                Checking Stripe confirmation...
              </p>
            )}

            {/* Success Message */}
            {isPremium && (
              <div className="mt-5 rounded-xl border border-[#E8EBDD] bg-[#F8F5ED] p-4">
                <p className="text-sm font-semibold text-[#283D32]">
                  Your Premium Journey Starts Now!
                </p>

                <p className="mt-1 text-xs leading-5 text-[#8B7478]">
                  Thank you for choosing WedPlan. Enjoy all the exclusive
                  features of your Premium subscription.
                </p>
              </div>
            )}

            {/* Error Message */}
            {!isChecking && !isPremium && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-600">
                  Verification Error
                </p>

                <p className="mt-1 text-xs leading-5 text-red-500">
                  {error}
                </p>
              </div>
            )}

            {/* Security Information */}
            <div className="mt-6 flex gap-3 rounded-xl border border-[#F0E4E6] bg-[#FFF9F5] p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#C6A15B]"
              />

              <div>
                <p className="text-sm font-semibold text-[#4A1F2A]">
                  Secure Payment Verification
                </p>

                <p className="mt-1 text-xs leading-5 text-[#8B7478]">
                  For your security, Premium is activated only after
                  successful payment verification through Stripe on our
                  server. This page never changes your subscription
                  independently.
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            {!isChecking && (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={
                    isPremium
                      ? "/vendor/subscription"
                      : "/vendor/subscription"
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#8B354B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6F263A]"
                >
                  {isPremium ? "View Subscription" : "Try Again"}
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/vendor"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E7D5CC] bg-white px-5 py-3 text-sm font-semibold text-[#722F3E] transition hover:bg-[#FAF5F0]"
                >
                  Vendor Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
