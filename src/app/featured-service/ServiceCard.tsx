
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Mail,
  MapPin,
  UserRound,
} from "lucide-react";

import type { Service } from "@/type/types";

const ServiceCard = ({
  service,
  index,
}: {
  service: Service;
  index: number;
}) => {
  const image = service.image || service.images?.[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: "easeOut",
      }}
      whileHover={{ y: -8 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#F0E5E7] bg-white shadow-sm transition-shadow duration-300 hover:border-[#DDBFC6] hover:shadow-xl hover:shadow-[#4A1F2A]/10"
    >
      {/* Image */}
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

      {/* Details */}
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

            {service.vendorEmail && (
              <p className="flex items-center gap-1 truncate text-xs text-[#8B7478]">
                <Mail size={12} className="shrink-0" />
                {service.vendorEmail}
              </p>
            )}
          </div>
        </div>

        {/* Button */}
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
    </motion.article>
  );
};

export default ServiceCard;
