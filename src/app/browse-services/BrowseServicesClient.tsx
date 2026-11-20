
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpRight,
  BriefcaseBusiness,
  X,
  Sparkles,
  UserRound,
  ArrowDownWideNarrow,
} from "lucide-react";

import type { Service } from "@/type/types";
import { useEffect, useMemo, useState } from "react";
import { getFilteredServices } from "../all-api/filter";

type Props = {
  services: Service[];
  initialCategory?: string;
};

const BrowseServicesClient = ({
  services,
  initialCategory = "all",
}: Props) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [locationFilter, setLocationFilter] = useState("all");

  // Price Sorting
  const [sort, setSort] = useState("");

  const [filteredServices, setFilteredServices] = useState<Service[]>(
    initialCategory === "all"
      ? services
      : services.filter(
          (service) =>
            service.category?.trim().toLowerCase() ===
            initialCategory.trim().toLowerCase()
        )
  );

  const categories = useMemo(() => {
    return [
      ...new Set(
        services
          .map((service) => service.category?.trim())
          .filter((category) => category)
      ),
    ];
  }, [services]);

  // Fetch services with search, filters and sorting
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getFilteredServices(
          search,
          categoryFilter,
          locationFilter,
          sort
        );

        setFilteredServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServices();
  }, [search, categoryFilter, locationFilter, sort]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setLocationFilter("all");
    setSort("");
  };

  return (
    <section className="min-h-screen bg-[#FCF9F9] pb-20">

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#4A1F2A] px-5 py-12 text-center sm:py-14">

        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#C8795B]/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-[#C6A15B]/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">

          <span className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/40 bg-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[1.5px] text-[#E7D5CC]">
            <Sparkles size={13} className="text-[#C6A15B]" />
            Discover Wedding Services
          </span>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Find Your Perfect{" "}
            <span className="font-serif italic text-[#E7B9C2]">
              Wedding Services
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/65">
            Explore trusted wedding professionals and make every moment of your
            special day unforgettable.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3 text-xs font-medium text-[#E7D5CC]">
            <span className="h-px w-8 bg-[#C6A15B]/60" />
            <span>{services.length} Available Services</span>
            <span className="h-px w-8 bg-[#C6A15B]/60" />
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-xs font-bold uppercase tracking-[2px] text-[#A65B6D]">
              Explore Our Collection
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#4A1F2A] sm:text-4xl">
              Browse Wedding Services
            </h2>

            <p className="mt-2 text-sm text-[#8B7478]">
              Find everything you need for your perfect wedding day.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-[#8B7478]">
            <SlidersHorizontal size={17} />
            <span>{filteredServices.length} results found</span>
          </div>

        </div>

        {/* Search & Filters UI */}
        <div className="mb-10 rounded-2xl border border-[#F0E5E7] bg-white p-4 shadow-sm sm:p-5">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* Search */}
            <div className="relative">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A89599]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services or vendors..."
                className="w-full rounded-xl border border-[#EDE1E4] bg-[#FCF9F9] py-3.5 pl-11 pr-4 text-sm text-[#4A1F2A] outline-none transition placeholder:text-[#B5A3A7] focus:border-[#A65B6D] focus:bg-white focus:ring-2 focus:ring-[#A65B6D]/10"
              />

            </div>

            {/* Category */}
            <div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#EDE1E4] bg-[#FCF9F9] px-4 py-3.5 text-sm text-[#6B5157] outline-none transition focus:border-[#A65B6D] focus:bg-white"
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

            </div>

            {/* Location */}
            <div className="relative">

              <MapPin
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A89599]"
              />

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#EDE1E4] bg-[#FCF9F9] py-3.5 pl-10 pr-4 text-sm text-[#6B5157] outline-none transition focus:border-[#A65B6D] focus:bg-white"
              >
                <option value="all">All Locations</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
              </select>

            </div>

            {/* Price Sorting */}
            <div className="relative">

              <ArrowDownWideNarrow
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A89599]"
              />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#EDE1E4] bg-[#FCF9F9] py-3.5 pl-10 pr-4 text-sm text-[#6B5157] outline-none transition focus:border-[#A65B6D] focus:bg-white"
              >
                <option value="">Default Sorting</option>
                <option value="low-to-high">
                  Price: Low to High
                </option>
                <option value="high-to-low">
                  Price: High to Low
                </option>
              </select>

            </div>

          </div>

          {/* Clear Filters UI */}
          <div className="mt-4 flex justify-end">

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A65B6D] transition hover:text-[#4A1F2A]"
            >
              <X size={14} />
              Clear all filters
            </button>

          </div>

        </div>

        {/* Service Cards */}
        {filteredServices.length > 0 ? (

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {filteredServices.map((service) => {

              const image = service.image || service.images?.[0];

              return (
                <div
                  key={service._id}
                  className="group overflow-hidden rounded-2xl border border-[#F0E5E7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#DDBFC6] hover:shadow-xl hover:shadow-[#4A1F2A]/10"
                >

                  {/* Image */}
                  <div className="relative h-60 overflow-hidden bg-[#F8EDF0]">

                    {image ? (
                      <Image
                        src={image}
                        alt={service.serviceName}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BriefcaseBusiness
                          size={48}
                          className="text-[#C9B5BA]"
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#8B354B] shadow-sm">
                      {service.category}
                    </span>

                    {/* Price */}
                    <div className="absolute bottom-4 right-4 rounded-xl bg-[#4A1F2A]/90 px-4 py-2 text-white backdrop-blur-sm">

                      <p className="text-[10px] uppercase tracking-wider text-white/70">
                        Starting from
                      </p>

                      <p className="text-lg font-bold">
                        ${Number(service.price || 0).toLocaleString("en-BD")}
                      </p>

                    </div>

                  </div>

                  {/* Card Content */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <h3 className="line-clamp-1 text-lg font-bold text-[#4A1F2A] transition group-hover:text-[#A65B6D]">
                        {service.serviceName}
                      </h3>

                      <Sparkles
                        size={17}
                        className="mt-1 shrink-0 text-[#C8795B]"
                      />

                    </div>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-[#8B7478]">
                      {service.description || "Discover this beautiful wedding service."}
                    </p>

                    {/* Location */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-[#8B7478]">

                      <MapPin
                        size={16}
                        className="shrink-0 text-[#A65B6D]"
                      />

                      <span className="truncate">
                        {service.location || "Location not specified"}
                      </span>

                    </div>

                    {/* Vendor */}
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

                        <p className="truncate text-xs text-[#A89599]">
                          {service.vendorEmail}
                        </p>

                      </div>

                    </div>

                    {/* View Details */}
                    <Link
                      href={`/browse-services/${service._id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A1F2A] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#713746]"
                    >
                      View Details

                      <ArrowUpRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
                      />

                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

        ) : (

          /* Empty State */
          <div className="rounded-2xl border border-dashed border-[#DFC9CE] bg-white px-5 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F8EDF0]">
              <Search size={28} className="text-[#A65B6D]" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#4A1F2A]">
              No Services Found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8B7478]">
              There are currently no services available.
              Please check back later.
            </p>

          </div>

        )}

      </div>
    </section>
  );
};

export default BrowseServicesClient;
