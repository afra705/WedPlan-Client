
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Home,
  SearchX,
  Sparkles,
} from "lucide-react";

const NotFound = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FBF7F0] px-5 py-16">
      {/* Background Decorations */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#E8D5D8] opacity-60 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#EADFCB] opacity-70 blur-3xl" />

      {/* Decorative Icons */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute left-[12%] top-[18%] hidden text-[#C9A45C] md:block"
      >
        <Heart size={32} strokeWidth={1.2} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-[20%] right-[13%] hidden text-[#A77B42] md:block"
      >
        <Sparkles size={36} strokeWidth={1.2} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mx-auto w-full max-w-2xl text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A45C]/30 bg-[#F0E4DF]"
        >
          <SearchX
            className="h-9 w-9 text-[#641E32]"
            strokeWidth={1.4}
          />
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[110px] font-bold leading-none tracking-tighter text-[#641E32] sm:text-[150px]"
        >
          404
        </motion.h1>

        {/* Heading */}
        <div className="mt-7 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A77B42]">
            Oops! Lost in the Wedding Details?
          </p>

          <h2 className="font-serif text-3xl font-semibold text-[#3B101D] sm:text-4xl">
            This Page Has Gone Missing!
          </h2>

          <p className="mx-auto max-w-md text-sm leading-7 text-[#76666A] sm:text-base">
            Looks like this page couldn&apos;t make it to the guest list.
            Don&apos;t worry, your dream wedding journey is still waiting for you!
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#641E32] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#3B101D] hover:shadow-lg hover:shadow-[#641E32]/20 sm:w-auto"
          >
            <Home size={18} />
            Back to Home
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9A45C]/50 px-7 py-3.5 text-sm font-semibold text-[#641E32] transition-all duration-300 hover:bg-[#F0E4DF] sm:w-auto"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-[#A77B42]">
          <Heart size={14} fill="currentColor" />
          <span>
            Made with love for your perfect day
          </span>
        </div>
      </motion.div>
    </main>
  );
};

export default NotFound;
