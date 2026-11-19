import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Sparkles } from "lucide-react";

import { getServices } from "@/app/all-api/service";
import type { Service } from "@/type/types";
import { categories } from "./category-data";

// This section is used on the home page and on /categories.
const CategoriesSection = async () => {
  let approvedServices: Service[] = [];

  try {
    const allServices = (await getServices()) as Service[];

    approvedServices = allServices.filter(
      (service) => service.status === "approved"
    );
  } catch (error) {
    console.error("Failed to load categories:", error);
  }

  const countServices = (categoryName: string) =>
    approvedServices.filter(
      (service) =>
        service.category?.trim().toLowerCase() === categoryName.toLowerCase()
    ).length;

  return (
    <section className="relative overflow-hidden bg-[#FAF5F0] py-14 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#C6A15B]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#722F3E]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/40 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#722F3E]">
            <Sparkles size={13} className="text-[#C6A15B]" />
            Browse by category
          </span>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#4A1F2A] sm:text-4xl">
            Explore Wedding{" "}
            <span className="italic text-[#C6A15B]">Categories</span>
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#8B7478] sm:text-base">
            Choose a category to discover approved services from trusted local
            vendors.
          </p>
        </div>

        {/* Category cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const serviceCount = countServices(category.name);

            return (
              <Link
                key={category.name}
                href={`/browse-services?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group flex flex-col rounded-2xl border border-[#F0E5E7] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#DDBFC6] hover:shadow-xl hover:shadow-[#4A1F2A]/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8EDF0] text-[#8B354B] transition group-hover:bg-[#722F3E] group-hover:text-white">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#4A1F2A] transition group-hover:text-[#A65B6D]">
                  {category.name}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-[#8B7478]">
                  {category.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[#F0E5E7] pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B7478]">
                    <BriefcaseBusiness size={14} className="text-[#A65B6D]" />
                    {serviceCount} {serviceCount === 1 ? "service" : "services"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#722F3E]">
                    Explore
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/browse-services"
            className="inline-flex items-center gap-2 rounded-full border border-[#E7D5CC] bg-white px-6 py-3 text-sm font-semibold text-[#722F3E] shadow-sm transition hover:border-[#C6A15B] hover:bg-[#FFFCFA]"
          >
            View all services
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
