"use client";

import  { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import Logo from "./Logo";

const links = [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
];

const Navbar = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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

    // Active route checker
    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    // Close mobile menu
    const closeMenu = () => setOpen(false);

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
                {/* Logo - Left */}
                <div className="shrink-0">
                    <Logo />
                </div>

                {/* Desktop Navigation - Center */}
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

                {/* Auth Buttons - Right */}
                <div className="hidden shrink-0 items-center gap-3 md:flex">
                    <Link
                        href="/sign-in"
                        className="rounded-full px-5 py-2.5 text-sm font-medium text-[#722F3E] transition-colors hover:bg-[#E7D5CC]/60"
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/sign-up"
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-[#8B3A4C] via-[#722F3E] to-[#4A1F2A] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(114,47,62,0.7)] ring-1 ring-[#C6A15B]/60 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_26px_-6px_rgba(114,47,62,0.8)]"
                    >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#C6A15B]/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                        <Sparkles className="relative h-4 w-4 text-[#E4C98A]" />

                        <span className="relative">Sign Up</span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7D5CC] bg-white text-[#4A1F2A] shadow-sm transition-colors hover:bg-[#FAF5F0] md:hidden"
                >
                    {open ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
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
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{
                                show: {
                                    transition: { staggerChildren: 0.06 },
                                },
                            }}
                            className="flex flex-col gap-2 px-5 py-5"
                        >
                            {/* Navigation Links */}
                            {links.map((link) => (
                                <motion.div
                                    key={link.href}
                                    variants={{
                                        hidden: { opacity: 0, y: -8 },
                                        show: { opacity: 1, y: 0 },
                                    }}
                                >
                                    <Link
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
                                </motion.div>
                            ))}

                            <div className="my-2 h-px bg-[#E7D5CC]" />

                            {/* Sign In */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: -8 },
                                    show: { opacity: 1, y: 0 },
                                }}
                            >
                                <Link
                                    href="/signin"
                                    onClick={closeMenu}
                                    className="block rounded-xl px-4 py-3 text-base font-semibold text-[#722F3E] transition-colors hover:bg-[#FAF5F0]"
                                >
                                    Sign In
                                </Link>
                            </motion.div>

                            {/* Sign Up */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: -8 },
                                    show: { opacity: 1, y: 0 },
                                }}
                            >
                                <Link
                                    href="/signup"
                                    onClick={closeMenu}
                                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#8B3A4C] to-[#4A1F2A] px-4 py-3 text-base font-semibold text-white shadow-md ring-1 ring-[#C6A15B]/60"
                                >
                                    <Sparkles className="h-4 w-4 text-[#E4C98A]" />
                                    Sign Up
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
