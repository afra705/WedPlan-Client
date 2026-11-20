import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

const SubscriptionCancelPage = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-2xl border border-[#EAD8DC] bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-[#F0E4E6] bg-[#FAF5F0] px-6 py-9 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F8E9EC] text-[#8B354B]">
              <XCircle size={34} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#4A1F2A]">
              Payment cancelled
            </h2>

            <p className="mt-2 text-sm text-[#8B7478]">
              You have not been charged.
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-7 sm:px-8">
            <p className="text-sm leading-6 text-[#6F555B]">
              Your Stripe Checkout was cancelled before the payment was
              completed. Your current plan has not changed, and you can upgrade
              to Premium at any time.
            </p>

            <Link
              href="/vendor/subscription"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B354B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6F263A]"
            >
              <ArrowLeft size={17} />
              Back to Subscription
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancelPage;
