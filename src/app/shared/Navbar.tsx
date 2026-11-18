
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  UserRound,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import Logo from "./Logo";
import { signOut, useSession } from "@/lib/auth-client";

const links = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = session?.user;

  // Access custom role field
 
const role = (
  user as typeof user & {
    role?: "admin" | "vendor" | "customer";
  }
)?.role;

// Role-based Dashboard URL
const dashboardLink =
  role === "admin"
    ? "/admin"
    : role === "vendor"
      ? "/vendor"
      : "/customer";

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMenu = () => setOpen(false);

  // Better Auth Logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const { error } = await signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      setProfileOpen(false);
      setOpen(false);

      toast.success("Logged out successfully!");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Unable to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF5F0]/85 shadow-[0_8px_30px_-12px_rgba(74,31,42,0.25)] backdrop-blur-xl"
          : "bg-[#FAF5F0]"
      }`}
    >
      <nav
        className={`relative mx-auto flex max-w-7xl items-center justify-between px-3 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "h-[68px]" : "h-20"
        }`}
      >
        {/* Logo */}
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
          <ul className="flex items-center gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative block rounded-full px-6 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-[#722F3E]"
                      : "text-[#4A1F2A]/80 hover:text-[#722F3E]"
                  }`}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full border border-[#C6A15B]/50 bg-white shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Auth / Profile */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-[#E7D5CC]" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-[#E7D5CC] bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-[#C6A15B]"
                aria-expanded={profileOpen}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#722F3E] text-white">
                    <UserRound className="h-5 w-5" />
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-[#4A1F2A]">
                  {user.name || "My Account"}
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-[#722F3E] transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-[#E7D5CC] bg-white p-2 shadow-xl"
                  >
                    <div className="border-b border-[#E7D5CC] px-3 py-3">
                      <p className="truncate text-sm font-semibold text-[#4A1F2A]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-1 py-2">
                      <Link
                        href={dashboardLink}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#4A1F2A] transition hover:bg-[#FAF5F0] hover:text-[#722F3E]"
                      >
                        <LayoutDashboard className="h-4 w-4 text-[#C6A15B]" />
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#4A1F2A] transition hover:bg-[#FAF5F0] hover:text-[#722F3E]"
                      >
                        <Settings className="h-4 w-4 text-[#C6A15B]" />
                        Profile Settings
                      </Link>
                    </div>

                    <div className="border-t border-[#E7D5CC] pt-2">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-5 py-2.5 text-sm font-medium text-[#722F3E] transition-colors hover:bg-[#E7D5CC]/60"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-[#8B3A4C] via-[#722F3E] to-[#4A1F2A] px-6 py-2.5 text-sm font-semibold text-white shadow-md ring-1 ring-[#C6A15B]/60 transition-all hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#C6A15B]/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Sparkles className="relative h-4 w-4 text-[#E4C98A]" />
                <span className="relative">Sign Up</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7D5CC] bg-white text-[#4A1F2A] shadow-sm transition-colors hover:bg-[#FAF5F0] md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Gold Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent opacity-70" />

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden bg-white md:hidden"
          >
            <div className="flex flex-col gap-2 px-5 py-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "border border-[#C6A15B]/50 bg-[#FAF5F0] text-[#722F3E]"
                      : "text-[#4A1F2A] hover:bg-[#FAF5F0]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 h-px bg-[#E7D5CC]" />

              {isPending ? (
                <div className="h-10 animate-pulse rounded-xl bg-[#FAF5F0]" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl bg-[#FAF5F0] p-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Profile"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#722F3E] text-white">
                        <UserRound className="h-5 w-5" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#4A1F2A]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={dashboardLink}
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#4A1F2A] hover:bg-[#FAF5F0]"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#C6A15B]" />
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#4A1F2A] hover:bg-[#FAF5F0]"
                  >
                    <Settings className="h-4 w-4 text-[#C6A15B]" />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={closeMenu}
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-[#722F3E] hover:bg-[#FAF5F0]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={closeMenu}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#8B3A4C] to-[#4A1F2A] px-4 py-3 text-base font-semibold text-white shadow-md ring-1 ring-[#C6A15B]/60"
                  >
                    <Sparkles className="h-4 w-4 text-[#E4C98A]" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
