
"use client";

import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    CalendarCheck,
    Camera,
    Flower2,
    MapPin,
    Star,
    Utensils,
    Heart,
    Sparkles,
    CheckCircle2,
} from "lucide-react";

// Optional: Add your wedding image URL here
const HERO_IMAGE = "";

// const categories = [
//     { icon: Camera, label: "Photography" },
//     { icon: MapPin, label: "Venues" },
//     { icon: Flower2, label: "Florist" },
//     { icon: Utensils, label: "Catering" },
// ];

const Illustration = () => (
    <svg
        viewBox="0 0 400 520"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="bn-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A1F2A" />
                <stop offset="45%" stopColor="#722F3E" />
                <stop offset="78%" stopColor="#C98C86" />
                <stop offset="100%" stopColor="#E7D5CC" />
            </linearGradient>

            <radialGradient id="bn-sun" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#F4E2B0" />
                <stop offset="60%" stopColor="#C6A15B" />
                <stop offset="100%" stopColor="#C6A15B" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="bn-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EBD59B" />
                <stop offset="100%" stopColor="#9C7A38" />
            </linearGradient>
        </defs>

        <rect width="400" height="520" fill="url(#bn-sky)" />

        <circle
            cx="200"
            cy="330"
            r="150"
            fill="url(#bn-sun)"
            opacity="0.85"
        />

        {/* Hills */}
        <path
            d="M0 400 Q90 350 200 390 T400 370 V520 H0Z"
            fill="#4A1F2A"
            opacity="0.55"
        />

        <path
            d="M0 440 Q120 400 230 436 T400 420 V520 H0Z"
            fill="#3A1822"
            opacity="0.8"
        />

        {/* Wedding Arch */}
        <path
            d="M70 470 V250 a130 130 0 0 1 260 0 V470"
            fill="none"
            stroke="url(#bn-gold)"
            strokeWidth="3"
        />

        <path
            d="M86 470 V252 a114 114 0 0 1 228 0 V470"
            fill="none"
            stroke="#FAF5F0"
            strokeWidth="1"
            opacity="0.35"
        />

        {/* Flowers */}
        {[
            [72, 300, 14],
            [78, 350, 11],
            [70, 400, 13],
            [82, 440, 10],
            [328, 300, 14],
            [322, 350, 11],
            [330, 400, 13],
            [318, 440, 10],
            [90, 215, 12],
            [120, 165, 14],
            [160, 135, 11],
            [200, 122, 15],
            [240, 135, 11],
            [280, 165, 14],
            [310, 215, 12],
        ].map(([cx, cy, r], i) => (
            <g key={i}>
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={
                        i % 3 === 0
                            ? "#FAF5F0"
                            : i % 3 === 1
                              ? "#E7D5CC"
                              : "#C6A15B"
                    }
                    opacity="0.92"
                />
                <circle
                    cx={cx}
                    cy={cy}
                    r={r * 0.4}
                    fill="#722F3E"
                    opacity="0.55"
                />
            </g>
        ))}

        {/* Couple Silhouette */}
        <g fill="#2A0F17">
            <circle cx="178" cy="352" r="11" />
            <path d="M166 366 h24 l8 100 h-40z" />

            <circle cx="224" cy="356" r="10" />
            <path d="M206 368 h36 l16 98 h-68z" />
        </g>

        {/* Wedding Rings */}
        <circle
            cx="188"
            cy="498"
            r="11"
            fill="none"
            stroke="#C6A15B"
            strokeWidth="3"
        />

        <circle
            cx="207"
            cy="498"
            r="11"
            fill="none"
            stroke="#FAF5F0"
            strokeWidth="3"
        />

        {/* Sparkles */}
        {[
            [60, 90],
            [340, 70],
            [310, 130],
            [100, 130],
            [355, 220],
        ].map(([x, y], i) => (
            <path
                key={i}
                d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2}Z`}
                fill="#F4E2B0"
                opacity="0.85"
            />
        ))}
    </svg>
);

const Banner = () => {
    return (
        <section className="relative isolate overflow-hidden bg-[#FAF5F0]">

            {/* Background Decoration */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#722F3E]/10 blur-3xl" />

                <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-[#C6A15B]/15 blur-3xl" />

                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage:
                            "radial-gradient(#E7D5CC 1px, transparent 1px)",
                        backgroundSize: "26px 26px",
                    }}
                />
            </div>

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-20">

                {/* LEFT CONTENT */}
                <div className="max-w-2xl">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/50 bg-white px-4 py-2 text-sm font-medium text-[#722F3E] shadow-sm">
                        <BadgeCheck className="h-4 w-4 text-[#C6A15B]" />
                        Trusted by couples planning their big day
                    </div>

                    {/* Heading */}
                    <h1
                        className="mt-7 text-4xl font-bold leading-[1.15] tracking-tight text-[#4A1F2A] sm:text-5xl lg:text-6xl"
                        style={{
                            fontFamily: "var(--font-playfair), Georgia, serif",
                        }}
                    >
                        Plan Your Dream Wedding

                        <span className="mt-2 block bg-gradient-to-r from-[#722F3E] via-[#9C5560] to-[#C6A15B] bg-clip-text italic text-transparent">
                            With Vendors You Can Trust.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-6 max-w-xl text-base leading-8 text-[#4A1F2A]/75 sm:text-lg">
                        Discover photographers, beautiful venues, florists,
                        caterers and wedding stylists in one place. Compare
                        services, send booking requests and organize every
                        detail of your special celebration.
                    </p>

                    {/* CTA */}
                    <div className="mt-9 flex flex-col gap-4 sm:flex-row">

                        <Link
                            href="/services"
                            className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-br from-[#8B3A4C] via-[#722F3E] to-[#4A1F2A] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#722F3E]/25 ring-1 ring-[#C6A15B]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            Explore Wedding Services

                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#722F3E]/25 bg-white px-8 py-4 text-sm font-semibold text-[#722F3E] transition-all duration-300 hover:-translate-y-1 hover:border-[#C6A15B] hover:bg-[#FAF5F0]"
                        >
                            <Heart className="h-4 w-4 text-[#C6A15B]" />
                            Join as a Vendor
                        </Link>

                    </div>

                    {/* Category Quick Links */}
                    {/* <div className="mt-9 flex flex-wrap gap-2.5">
                        {categories.map(({ icon: Icon, label }) => (
                            <Link
                                key={label}
                                href={`/services?category=${encodeURIComponent(label)}`}
                                className="inline-flex items-center gap-2 rounded-full border border-[#E7D5CC] bg-white px-4 py-2.5 text-sm font-medium text-[#4A1F2A] shadow-sm transition-all hover:-translate-y-1 hover:border-[#C6A15B]"
                            >
                                <Icon className="h-4 w-4 text-[#C6A15B]" />
                                {label}
                            </Link>
                        ))}
                    </div> */}

                    {/* Trust Information */}
                    <div className="mt-10 grid max-w-lg grid-cols-2 gap-5 border-t border-[#E7D5CC] pt-7 sm:grid-cols-3">

                        <div>
                            <p className="font-serif text-3xl font-bold text-[#722F3E]">
                                6
                            </p>
                            <p className="mt-1 text-sm text-[#4A1F2A]/65">
                                Service Categories
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-5 w-5 text-[#C6A15B]" />
                                <p className="font-serif text-xl font-bold text-[#722F3E]">
                                    Verified
                                </p>
                            </div>
                            <p className="mt-1 text-sm text-[#4A1F2A]/65">
                                Vendor Profiles
                            </p>
                        </div>

                        <div className="hidden sm:block">
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 fill-[#C6A15B] text-[#C6A15B]" />
                                <p className="font-serif text-xl font-bold text-[#722F3E]">
                                    Premium
                                </p>
                            </div>
                            <p className="mt-1 text-sm text-[#4A1F2A]/65">
                                Wedding Services
                            </p>
                        </div>

                    </div>
                </div>

                {/* RIGHT VISUAL */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-none">

                    {/* Gold Border Decoration */}
                    <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[999px] rounded-b-[2rem] border border-[#C6A15B]/70" />

                    {/* Main Image */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-[#E7D5CC] shadow-[0_30px_70px_-25px_rgba(74,31,42,0.35)] ring-1 ring-[#C6A15B]/40">

                        {HERO_IMAGE ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={HERO_IMAGE}
                                alt="Beautiful wedding celebration"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Illustration />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#4A1F2A]/30 via-transparent to-transparent" />
                    </div>

                    {/* Booking Card */}
                    <div className="absolute -left-1 bottom-16 flex items-center gap-3 rounded-2xl border border-[#E7D5CC] bg-white p-3.5 pr-5 shadow-xl sm:-left-5">

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#722F3E] text-[#E4C98A]">
                            <CalendarCheck className="h-5 w-5" />
                        </span>

                        <div>
                            <p className="text-sm font-bold text-[#4A1F2A]">
                                Easy Booking
                            </p>

                            <p className="text-xs text-[#4A1F2A]/60">
                                Plan every detail with ease
                            </p>
                        </div>
                    </div>

                    {/* Rating Card */}
                    <div className="absolute -right-1 top-20 rounded-2xl border border-[#E7D5CC] bg-white p-4 shadow-xl sm:-right-5">

                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className="h-4 w-4 fill-[#C6A15B] text-[#C6A15B]"
                                />
                            ))}
                        </div>

                        <p className="mt-2 text-sm font-bold text-[#4A1F2A]">
                            Quality Services
                        </p>

                        <p className="text-xs text-[#4A1F2A]/60">
                            Find your perfect vendors
                        </p>
                    </div>

                    {/* Decorative Sparkle */}
                    <div className="absolute -right-1 bottom-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-white shadow-lg sm:-right-4">
                        <Sparkles className="h-6 w-6 text-[#C6A15B]" />
                    </div>

                </div>
            </div>

            {/* Bottom Gold Line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent opacity-70" />

        </section>
    );
};

export default Banner;
