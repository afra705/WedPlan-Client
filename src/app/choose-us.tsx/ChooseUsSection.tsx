
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CircleDollarSign,
  HeartHandshake,
  SearchCheck,
  Sparkles,
  Users,
  MoveUpRight,
  Check,
  type LucideIcon,
} from "lucide-react";

type Benefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const benefits: Benefit[] = [
  {
    title: "Verified Vendors",
    description:
      "Every vendor is carefully reviewed so you can connect with trusted wedding professionals.",
    icon: BadgeCheck,
  },
  {
    title: "Transparent Pricing",
    description:
      "Explore clear starting prices, compare packages, and find services that match your budget.",
    icon: CircleDollarSign,
  },
  {
    title: "Effortless Booking",
    description:
      "Book your favorite vendors with a few clicks and manage every request from one dashboard.",
    icon: CalendarCheck,
  },
  {
    title: "Everything in One Place",
    description:
      "Discover venues, catering, photography, decoration, fashion, and more in one destination.",
    icon: SearchCheck,
  },
  {
    title: "Genuine Vendor Details",
    description:
      "Explore vendor profiles, contact information, and detailed service descriptions with confidence.",
    icon: Users,
  },
  {
    title: "We're Here for You",
    description:
      "Enjoy a smoother planning journey with a simple experience designed around your special day.",
    icon: HeartHandshake,
  },
];

const ChooseUsSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#FBF8F6] py-20 sm:py-28">

      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-[#C6A15B]/15 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 -z-10 h-96 w-96 rounded-full bg-[#722F3E]/10 blur-[110px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-white/80 px-5 py-2 shadow-sm backdrop-blur-md">
            <Sparkles size={15} className="text-[#C6A15B]" />
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#722F3E]">
              Why WedPlan
            </span>
          </div>

          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-[#4A1F2A] sm:text-5xl lg:text-6xl">
            Making Your Wedding
            <br />
            <span className="font-serif italic text-[#B18B4C]">
              Dreams Come True.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#8B7478] sm:text-base">
            Your dream wedding deserves the perfect team. Discover trusted
            professionals, transparent prices, and effortless planning
            — all in one beautiful place.
          </p>
        </motion.div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.article
                key={benefit.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.09,
                }}
                className="group relative overflow-hidden rounded-3xl border border-[#EADFE0] bg-white/75 p-7 shadow-[0_8px_35px_rgba(74,31,42,0.035)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#C6A15B]/50 hover:bg-white hover:shadow-[0_20px_55px_rgba(74,31,42,0.11)] sm:p-8"
              >
                {/* Hover background */}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#C6A15B]/0 blur-3xl transition-all duration-500 group-hover:bg-[#C6A15B]/15" />

                {/* Card top */}
                <div className="relative flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F0ED] text-[#722F3E] transition-all duration-500 group-hover:rotate-6 group-hover:bg-[#722F3E] group-hover:text-white">
                    <Icon size={26} strokeWidth={1.7} />
                  </div>

                  <span className="font-serif text-3xl italic text-[#C6A15B]/50 transition-colors group-hover:text-[#C6A15B]">
                    0{index + 1}
                  </span>
                </div>

                {/* Card content */}
                <div className="relative mt-7">
                  <h3 className="text-xl font-semibold tracking-tight text-[#4A1F2A] transition-colors group-hover:text-[#722F3E]">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#8B7478]">
                    {benefit.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="relative mt-7 flex items-center justify-between">
                  <div className="h-[2px] w-10 rounded-full bg-[#C6A15B] transition-all duration-500 group-hover:w-20" />

                  <ArrowRight
                    size={18}
                    className="text-[#C6A15B] opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Premium CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative mt-20 overflow-hidden rounded-[2rem] bg-[#4A1F2A] px-7 py-12 shadow-2xl shadow-[#4A1F2A]/15 sm:px-12 sm:py-16"
        >
          {/* CTA Decorations */}
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#C6A15B]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-9 text-center lg:flex-row lg:text-left">

            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-[#D9BC82]">
                <Sparkles size={15} />
                Your Perfect Day Starts Here
              </span>

              <h3 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Let&apos;s Make Your
                <span className="block font-serif italic text-[#D9BC82]">
                  Dream Wedding Happen.
                </span>
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/65">
                Find your dream wedding vendors and start creating
                unforgettable memories today.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-5 text-xs text-white/75 lg:justify-start">
                <span className="flex items-center gap-2">
                  <Check size={15} className="text-[#D9BC82]" />
                  Trusted Vendors
                </span>
                <span className="flex items-center gap-2">
                  <Check size={15} className="text-[#D9BC82]" />
                  Easy Booking
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[210px]">
              <Link
                href="/browse-services"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#C6A15B] px-7 py-4 text-sm font-bold text-[#4A1F2A] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#E0C58E] hover:shadow-[#C6A15B]/20"
              >
                Explore Services
                <MoveUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ChooseUsSection;
