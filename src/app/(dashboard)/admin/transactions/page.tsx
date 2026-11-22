import {
  getCurrentUser,
  getServerToken,
} from "@/app/all-api/get-current-user";

import { getDashboardPath, isAdmin } from "@/lib/roles";
import { redirect } from "next/navigation";

import {
  CreditCard,
  CalendarDays,
  Crown,
  CheckCircle2,
  Clock,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { getAllTransactions } from "@/app/all-api/transictions";

// Transaction type
interface Transaction {
  _id: string;
  vendorId: string;
  plan: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId: string | null;
  status: string;
  createdAt: string;
  vendor: {
    name: string;
    email: string;
    businessName: string;
    image?: string;
  } | null;
}

const TransactionsPage = async () => {
  // Admin authentication
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!isAdmin(user)) {
    redirect(getDashboardPath(user));
  }

  // Fetch transactions
  let transactions: Transaction[] = [];
  let errorMessage = "";

try {
  const token = await getServerToken();

  transactions = await getAllTransactions(token);
} catch (error) {
  console.error("Transactions fetch error:", error);
  errorMessage = "Failed to load transactions. Please try again.";
}

  // Calculate statistics
  const totalTransactions = transactions.length;

 const totalRevenue = transactions.reduce(
  (total, transaction) => total + transaction.amount,
  0
);

  const successfulPayments = transactions.filter(
    (transaction) => transaction.status === "paid"
  ).length;

  const pendingPayments = transactions.filter(
    (transaction) => transaction.status === "pending"
  ).length;

  // Format amount
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Status badge
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#4A1F2A] sm:text-3xl">
            Transactions
          </h2>

          <p className="mt-2 text-sm text-[#8B7478]">
            Track all payments and transactions across the platform.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Transactions */}
          <div className="rounded-2xl border border-[#EAD8DC] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8B7478]">
                  Total Transactions
                </p>

                <h3 className="mt-2 text-3xl font-bold text-[#4A1F2A]">
                  {totalTransactions}
                </h3>
              </div>

              <div className="rounded-xl bg-[#F5E7EA] p-3">
                <Receipt className="h-6 w-6 text-[#8B354B]" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="rounded-2xl border border-[#EAD8DC] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8B7478]">
                  Total Revenue
                </p>

                <h3 className="mt-2 text-3xl font-bold text-[#4A1F2A]">
                  ${totalRevenue.toFixed(2)}
                </h3>
              </div>

              <div className="rounded-xl bg-green-100 p-3">
                <CreditCard className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </div>

          {/* Successful Payments */}
          <div className="rounded-2xl border border-[#EAD8DC] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8B7478]">
                  Successful Payments
                </p>

                <h3 className="mt-2 text-3xl font-bold text-[#4A1F2A]">
                  {successfulPayments}
                </h3>
              </div>

              <div className="rounded-xl bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="rounded-2xl border border-[#EAD8DC] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8B7478]">
                  Pending Payments
                </p>

                <h3 className="mt-2 text-3xl font-bold text-[#4A1F2A]">
                  {pendingPayments}
                </h3>
              </div>

              <div className="rounded-xl bg-yellow-100 p-3">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </div>

        </div>

        {/* Transactions Table */}
        <div className="overflow-hidden rounded-2xl border border-[#EAD8DC] bg-white shadow-sm">

          <div className="flex flex-col gap-2 border-b border-[#EAD8DC] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#4A1F2A]">
                All Transactions
              </h3>

              <p className="mt-1 text-sm text-[#8B7478]">
                View all vendor subscription payments.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#8B7478]">
              <Receipt className="h-4 w-4" />
              {totalTransactions} Transactions
            </div>
          </div>

          {errorMessage ? (
            <div className="px-5 py-16 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-400" />

              <p className="mt-3 font-medium text-red-600">
                {errorMessage}
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Receipt className="mx-auto h-12 w-12 text-[#C9AEB5]" />

              <h3 className="mt-4 text-lg font-semibold text-[#4A1F2A]">
                No Transactions Found
              </h3>

              <p className="mt-2 text-sm text-[#8B7478]">
                No subscription transactions are available yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">

                <thead className="bg-[#FAF5F0]">
                  <tr className="text-xs uppercase tracking-wider text-[#8B7478]">
                    <th className="px-5 py-4 font-semibold">Vendor</th>
                    <th className="px-5 py-4 font-semibold">Plan</th>
                    <th className="px-5 py-4 font-semibold">Amount</th>
                    <th className="px-5 py-4 font-semibold">Date</th>
                    <th className="px-5 py-4 font-semibold">Session ID</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0E5E5]">

                  {transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="transition hover:bg-[#FAF7F5]"
                    >

                      {/* Vendor */}
                      <td className="px-5 py-5">
                        <div>
                          <p className="font-semibold text-[#4A1F2A]">
                            {transaction.vendor?.name || "Unknown Vendor"}
                          </p>

                          <p className="mt-1 text-xs text-[#8B7478]">
                            {transaction.vendor?.email || "No email"}
                          </p>

                          <p className="mt-1 text-xs font-medium text-[#8B354B]">
                            {transaction.vendor?.businessName || "No Business Name"}
                          </p>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5E7EA] px-3 py-1.5 text-xs font-semibold capitalize text-[#8B354B]">
                          <Crown className="h-3.5 w-3.5" />
                          {transaction.plan}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-5">
                        <p className="font-bold text-[#4A1F2A]">
                          {formatAmount(
                            transaction.amount,
                            transaction.currency
                          )}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 text-sm text-[#8B7478]">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>

                      {/* Stripe Session ID */}
                      <td className="px-5 py-5">
                        <p
                          title={transaction.stripeSessionId}
                          className="max-w-[180px] truncate text-xs text-[#8B7478]"
                        >
                          {transaction.stripeSessionId}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
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
    </div>
  );
};

export default TransactionsPage;
