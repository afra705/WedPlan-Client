import { getServiceById } from "@/app/all-api/service";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Service } from "@/type/types";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Image as ImageIcon,
  Mail,
  MapPin,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Tag,
  UserRound,
} from "lucide-react";
import BookingForm from "@/app/(dashboard)/customer/my-bookings/BookingForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const formatDate = (value?: string) => {
  if (!value) return "Recently added";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently added";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ServiceDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  let service: Service | null = null;

  try {
    service = await getServiceById(id);
  } catch {
    service = null;
  }

  if (!service) notFound();

  const gallery = [service.image, ...(service.images ?? [])].filter(
    (src, index, all): src is string =>
      Boolean(src) && all.indexOf(src) === index
  );

  const coverImage = gallery[0] ?? "";
  const extraImages = gallery.slice(1);
  const price = Number(service.price || 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF7F5] pb-20">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-[#C6A15B]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-72 h-96 w-96 rounded-full bg-[#A65B6D]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Back */}
        <Link
          href="/browse-services"
          className="inline-flex items-center gap-2 rounded-full border border-[#EADDE0] bg-white/80 px-4 py-2 text-sm font-medium text-[#8B7478] shadow-sm backdrop-blur transition hover:border-[#D9BFC5] hover:text-[#4A1F2A]"
        >
          <ArrowLeft size={16} />
          Back to Services
        </Link>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* LEFT SIDE */}
          <div className="min-w-0 space-y-6">
            {/* Cover image — always shown fully */}
            <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-[#F1E4E1] shadow-[0_24px_60px_-32px_rgba(74,31,42,0.45)]">
              {coverImage ? (
                <>
                  {/* Blurred backdrop fills the frame without cropping the photo */}
                  <img
                    src={coverImage}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FAF5F0]/70 via-[#F3E2DF]/60 to-[#E9D3D6]/70" />

                  <div className="relative flex h-[300px] items-center justify-center p-4 sm:h-[420px] sm:p-6 lg:h-[480px]">
                    <a
                      href={coverImage}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="View full size image"
                      className="group relative flex h-full w-full items-center justify-center"
                    >
                      <img
                        src={coverImage}
                        alt={service.serviceName}
                        className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_18px_45px_-20px_rgba(74,31,42,0.6)] transition duration-500 group-hover:scale-[1.02]"
                      />

                      <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-[#4A1F2A]/85 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
                        <Maximize2 size={13} />
                        View full
                      </span>
                    </a>
                  </div>
                </>
              ) : (
                <div className="flex h-[300px] flex-col items-center justify-center gap-3 text-[#A65B6D] sm:h-[420px]">
                  <ImageIcon size={44} />
                  <p className="text-sm font-medium">No image available</p>
                </div>
              )}

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-5 sm:top-5">
                <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#8B354B] shadow-sm backdrop-blur">
                  {service.category}
                </span>

                {service.status === "approved" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#4A1F2A]/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    <BadgeCheck size={13} className="text-[#E4C98A]" />
                    Verified listing
                  </span>
                )}
              </div>
            </div>

            {/* Extra photos */}
            {/* {extraImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {extraImages.slice(0, 4).map((image, index) => (
                  <a
                    key={`${image}-${index}`}
                    href={image}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View photo ${index + 2} full size`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#EADDE0] bg-[#F3E6E4]"
                  >
                    <img
                      src={image}
                      alt={`${service.serviceName} photo ${index + 2}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-[#4A1F2A]/0 transition group-hover:bg-[#4A1F2A]/10" />
                  </a>
                ))}
              </div>
            )} */}

            {/* Title + quick info */}
            <section className="rounded-3xl border border-[#EADDE0] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-[2.5px] text-[#A65B6D]">
                    Wedding Service
                  </span>

                  <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-[#4A1F2A] sm:text-4xl">
                    {service.serviceName}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#8B7478]">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={16} className="text-[#A65B6D]" />
                      {service.location || "Location not specified"}
                    </span>

                    <span className="hidden h-4 w-px bg-[#EADDE0] sm:block" />

                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={16} className="text-[#A65B6D]" />
                      Listed {formatDate(service.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 rounded-2xl border border-[#F0E5E7] bg-[#FCF7F6] px-5 py-4 sm:text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#A89599]">
                    Starting from
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#B1556B]">
                    ${price.toLocaleString("en-BD")}
                  </p>
                  <p className="mt-1 text-[11px] text-[#A89599]">
                    Depends on your requirements
                  </p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="rounded-3xl border border-[#EADDE0] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8ECEE] text-[#A65B6D]">
                  <Sparkles size={18} />
                </span>

                <div>
                  <h2 className="text-lg font-bold text-[#4A1F2A]">
                    About This Service
                  </h2>
                  <p className="text-xs text-[#A89599]">
                    What you can expect on your big day
                  </p>
                </div>
              </div>

              <div className="mt-5 h-px w-full bg-gradient-to-r from-[#C6A15B]/40 via-[#F0E5E7] to-transparent" />

              <p className="mt-5 whitespace-pre-line text-[15px] leading-8 text-[#76666A]">
                {service.description ||
                  "The vendor has not added a description for this service yet."}
              </p>
            </section>

            {/* Provider */}
            <section className="rounded-3xl border border-[#EADDE0] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[#4A1F2A]">
                  Service Provider
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F7F1] px-3 py-1 text-[11px] font-semibold text-[#4F7A46]">
                  <BadgeCheck size={13} />
                  Verified
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-[#FCF7F6] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B3A4C] to-[#4A1F2A] text-white shadow-md ring-2 ring-white">
                    <UserRound size={26} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-[#4A1F2A]">
                      {service.vendorName || "Unknown Vendor"}
                    </h3>
                    {service.vendorEmail && (
                      <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-[#8B7478]">
                        <Mail size={14} className="shrink-0" />
                        {service.vendorEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* {service.vendorEmail && (
                  <a
                    href={`mailto:${service.vendorEmail}`}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#EADDE0] bg-white px-4 py-2.5 text-sm font-semibold text-[#4A1F2A] transition hover:border-[#C6A15B] hover:text-[#722F3E]"
                  >
                    Contact
                    <ArrowUpRight size={15} />
                  </a>
                )} */}
              </div>
            </section>
          </div>

          {/* RIGHT SIDE — BOOKING UI */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-[#EADDE0] bg-white shadow-[0_24px_60px_-35px_rgba(74,31,42,0.5)]">
              <div className="relative overflow-hidden bg-gradient-to-br from-[#4A1F2A] via-[#5C2634] to-[#722F3E] p-6">
                <div
                  aria-hidden
                  className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#C6A15B]/25 blur-2xl"
                />

                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#E7D5CC]">
                    <Sparkles size={12} className="text-[#E4C98A]" />
                    Reserve your date
                  </span>

                  <p className="mt-4 text-xs uppercase tracking-wider text-white/60">
                    Starting from
                  </p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    ${price.toLocaleString("en-BD")}
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    Final price may vary by requirements.
                  </p>
                </div>
              </div>
{/* form  */}
           
<BookingForm
  serviceId={service._id}
  vendorId={service.vendorId}
/>
              <div className="flex items-start gap-2 border-t border-[#F0E5E7] bg-[#FCF9F9] px-6 py-4 text-[11px] leading-5 text-[#8B7478]">
                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0 text-[#4F7A46]"
                />
                Safe and secure. No payment is taken until the vendor confirms
                your booking.
              </div>
            </div>

            {/* Category hint */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#EADDE0] bg-white/80 p-4 text-sm text-[#8B7478] shadow-sm backdrop-blur">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8ECEE] text-[#A65B6D]">
                <Tag size={18} />
              </span>
              <p>
                Category:{" "}
                <span className="font-semibold text-[#4A1F2A]">
                  {service.category}
                </span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ServiceDetailsPage;
