import { Sparkles } from "lucide-react";

import Navbar from "../shared/Navbar";
import CategoriesSection from "./CategoriesSection";
import { categories } from "./category-data";


export const dynamic = "force-dynamic";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF5F0]">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#4A1F2A] px-4 py-14 text-center sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#C6A15B]/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#C8795B]/15 blur-3xl"
          />

          <div className="relative mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/40 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#E7D5CC]">
              <Sparkles size={13} className="text-[#C6A15B]" />
              Wedding Categories
            </span>

            <h1 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Find the right service for every part of your{" "}
              <span className="font-serif italic text-[#E7B9C2]">
                wedding
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Choose a category to explore approved services from trusted
              local vendors.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 text-xs font-medium text-[#E7D5CC]">
              <span className="h-px w-8 bg-[#C6A15B]/60" />
              <span>{categories.length} Categories</span>
              <span className="h-1 w-1 rounded-full bg-[#C6A15B]" />
              <span>Approved local vendors</span>
              <span className="h-px w-8 bg-[#C6A15B]/60" />
            </div>
          </div>
        </section>

        {/* Category cards (shared with the home page) */}
        <CategoriesSection />
      </main>
    </div>
  );
};

export default CategoriesPage;
