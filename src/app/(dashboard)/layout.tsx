
import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { auth } from "@/lib/auth";
import { Heart, Sparkles } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  const role = user.role as "vendor" | "customer" | "admin";

  return (
    <SidebarProvider>
      <DashboardSidebar
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
          role,
        }}
      />

      <main className="min-w-0 flex-1 bg-[#FAF5F0]">

        {/* Dashboard Header */}
        <header className="sticky top-0 z-30 border-b border-[#E7D5CC] bg-[#FAF5F0]/95 backdrop-blur-xl">

          <div className="flex h-[76px] items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* Left Section */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="rounded-lg text-[#722F3E] transition hover:bg-[#E7D5CC]/50 hover:text-[#4A1F2A]" />

              <div>
                <h1 className="text-lg font-bold tracking-tight text-[#4A1F2A] sm:text-xl">
                  Dashboard
                </h1>

                <p className="hidden text-xs text-[#8B7478] sm:block">
                  Welcome to your WedPlan workspace
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">

              <div className="hidden items-center gap-2 rounded-full border border-[#C6A15B]/40 bg-white px-4 py-2 sm:flex">
                <Sparkles size={15} className="text-[#C6A15B]" />

                <span className="text-xs font-semibold capitalize text-[#722F3E]">
                  {role} Account
                </span>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C6A15B]/50 bg-white shadow-sm">
                <Heart
                  size={18}
                  className="text-[#722F3E]"
                  fill="#722F3E"
                />
              </div>

            </div>
          </div>

          {/* Elegant Gold Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C6A15B]/70 to-transparent" />

        </header>

        {/* Dashboard Content */}
        <div className="min-h-[calc(100vh-77px)] p-4 sm:p-6 lg:p-8">
          {children}
        </div>

      </main>
    </SidebarProvider>
  );
}
