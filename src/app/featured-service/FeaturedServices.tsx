
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";

import { getServices } from "@/app/all-api/service";
import type { Service } from "@/type/types";

import ServiceCard from "./ServiceCard";
import AnimatedSection from "./AnimatedSection";


const FEATURED_LIMIT = 6;

const FeaturedServices = async () => {
  let featuredServices: Service[] = [];

  try {
    const allServices = (await getServices()) as Service[];

    featuredServices = allServices
      .filter((service) => service.status === "approved")
      .slice(0, FEATURED_LIMIT);
  } catch (error) {
    console.error("Failed to load featured services:", error);
  }

  return (
    <section className="relative overflow-hidden bg-[#FAF5F0] py-16 sm:py-20">
      {/* Background Decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#C6A15B]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#722F3E]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <AnimatedSection>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/40 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#722F3E]">
                <Sparkles size={13} className="text-[#C6A15B]" />
                Handpicked for you
              </span>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#4A1F2A] sm:text-4xl">
                Featured <span className="italic text-[#C6A15B]">Services</span>
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#8B7478] sm:text-base">
                Explore approved and active wedding services from our trusted
                vendors.
              </p>
            </div>

            <Link
              href="/browse-services"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E7D5CC] bg-white px-5 py-2.5 text-sm font-semibold text-[#722F3E] shadow-sm transition hover:border-[#C6A15B] hover:bg-[#FFFCFA]"
            >
              Browse all services
              <ArrowRight size={16} />
            </Link>
          </div>
        </AnimatedSection>

        {/* Service Cards */}
        {featuredServices.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-[#DDBFC6] bg-white/70 px-6 py-14 text-center">
            <BriefcaseBusiness
              size={42}
              className="mx-auto text-[#C6A15B]"
            />
            <h3 className="mt-4 text-lg font-semibold text-[#4A1F2A]">
              No featured services yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8B7478]">
              Approved services will appear here as soon as vendors publish
              them.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedServices;
