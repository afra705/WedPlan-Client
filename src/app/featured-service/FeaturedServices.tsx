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
      {/* Soft background decoration */}
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

        {/* Service cards */}
        {featuredServices.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => {
              const image = service.image || service.images?.[0];

              return (
                <article
                  key={service._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#F0E5E7] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#DDBFC6] hover:shadow-xl hover:shadow-[#4A1F2A]/10"
                >
                  {/* Image + category + price */}
                  <div className="relative h-56 overflow-hidden bg-[#F8EDF0]">
                    {image ? (
                      <Image
                        src={image}
                        alt={service.serviceName}
                        fill
                        unoptimized
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BriefcaseBusiness size={46} className="text-[#C9B5BA]" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#8B354B] shadow-sm">
                      {service.category}
                    </span>

                    <div className="absolute bottom-4 right-4 rounded-xl bg-[#4A1F2A]/90 px-4 py-2 text-white backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-wider text-white/70">
                        Starting from
                      </p>
                      <p className="text-lg font-bold">
                        ${Number(service.price || 0).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>

                  {/* Card details */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-[#4A1F2A] transition group-hover:text-[#A65B6D]">
                      {service.serviceName}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-[#8B7478]">
                      {service.description ||
                        "Discover this beautiful wedding service."}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-[#8B7478]">
                      <MapPin size={16} className="shrink-0 text-[#A65B6D]" />
                      <span className="truncate">
                        {service.location || "Location not specified"}
                      </span>
                    </div>

                    {/* Vendor information */}
                    <div className="mt-4 flex items-center gap-3 border-t border-[#F0E5E7] pt-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8EDF0] text-[#8B354B]">
                        <UserRound size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A89599]">
                          Service Provider
                        </p>
                        <p className="truncate text-sm font-semibold text-[#4A1F2A]">
                          {service.vendorName || "Unknown Vendor"}
                        </p>
                        {service.vendorEmail && (
                          <p className="flex items-center gap-1 truncate text-xs text-[#8B7478]">
                            <Mail size={12} className="shrink-0" />
                            {service.vendorEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* View Details button */}
                    <Link
                      href={`/browse-services/${service._id}`}
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#722F3E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4A1F2A]"
                    >
                      View Details
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
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
