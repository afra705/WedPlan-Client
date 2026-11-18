
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  PlusCircle,
  CalendarCheck,
  CreditCard,
  UserRound,
  Users,
  Settings,
  Heart,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import { DashboardUser } from "@/type/types";

const sidebarItems = {
  vendor: [
    { title: "Overview", url: "/vendor", icon: LayoutDashboard },
    { title: "My Services", url: "/vendor/my-services", icon: BriefcaseBusiness },
    { title: "Add Service", url: "/vendor/add-service", icon: PlusCircle },
    { title: "Booking Requests", url: "/vendor/booking-requests", icon: CalendarCheck },
    { title: "Subscription", url: "/vendor/subscription", icon: CreditCard },
    { title: "Profile Settings", url: "/vendor/profile", icon: UserRound },
  ],

  customer: [
    { title: "Overview", url: "/customer", icon: LayoutDashboard },
    { title: "My Bookings", url: "/customer/my-bookings", icon: CalendarCheck },
    { title: "Profile Settings", url: "/customer/profile", icon: UserRound },
  ],

  admin: [
    { title: "Overview", url: "/admin", icon: LayoutDashboard },
    { title: "Manage Users", url: "/admin/manage-users", icon: Users },
    { title: "Manage Services", url: "/admin/manage-services", icon: BriefcaseBusiness },
    { title: "Transactions", url: "/admin/transactions", icon: CreditCard },
  ],
};

const DashboardSidebar = ({ user }: { user: DashboardUser }) => {
  const pathname = usePathname();

  const items = sidebarItems[user.role] ?? [];

  const initials =
    user.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[#E7D5CC]  bg-white"
    >
      {/* Logo */}
      <SidebarHeader className="border-b border-[#E7D5CC] bg-[#FAF5F0] px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B3A4C] to-[#4A1F2A] text-white shadow-md shadow-[#722F3E]/20">
            <Heart size={21} fill="currentColor" />
          </div>

          <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-xl font-bold tracking-tight text-[#4A1F2A]">
              Wed<span className="text-[#722F3E]">Plan</span>
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[2px] text-[#9B8183]">
              Make it memorable
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-white px-3 py-5">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-[#A18B8A]">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  pathname.startsWith(item.url + "/");

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
             
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-11 rounded-xl px-3 transition-all duration-200 ${
                        isActive
                          ? "bg-[#722F3E] text-white shadow-md shadow-[#722F3E]/15 hover:bg-[#4A1F2A] hover:text-white"
                          : "text-[#66565A] hover:bg-[#FAF5F0] hover:text-[#722F3E]"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon size={19} />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Wedding Inspiration Card */}
        <SidebarGroup className="mt-auto group-data-[collapsible=icon]:hidden">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8B3A4C] via-[#722F3E] to-[#4A1F2A] p-4 text-white shadow-lg shadow-[#722F3E]/10">
            <Sparkles
              size={23}
              className="mb-3 text-[#E4C98A]"
            />

            <h3 className="text-sm font-bold">
              Make Every Moment Special
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-[#F5E5E1]">
              Your perfect wedding journey starts with the right planning.
            </p>

            <Link
              href="/services"
              className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#E4C98A] transition hover:text-white"
            >
              Explore Services
              <ArrowUpRight size={14} />
            </Link>

            <Heart
              size={78}
              className="absolute -bottom-5 -right-5 rotate-12 text-white/10"
              fill="currentColor"
            />
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile */}
      <SidebarFooter className="border-t border-[#E7D5CC] bg-[#FAF5F0] p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
 
              tooltip="Profile Settings"
              className="h-auto rounded-xl p-2 transition hover:bg-[#E7D5CC]/50"
            >
              <Link
                href={`/${user.role}/profile`}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#C6A15B]/50 bg-[#E7D5CC] text-sm font-bold text-[#722F3E]">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-semibold text-[#4A1F2A]">
                    {user.name}
                  </span>

                  <span className="truncate text-[11px] capitalize text-[#927D7F]">
                    {user.role} Account
                  </span>
                </div>

                <Settings
                  size={16}
                  className="ml-auto shrink-0 text-[#A18B8A] group-data-[collapsible=icon]:hidden"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
