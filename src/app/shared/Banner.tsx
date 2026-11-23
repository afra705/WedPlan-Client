"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BadgeCheck,
    CalendarCheck,
    Star,
    Heart,
    Sparkles,
    CheckCircle2,
} from "lucide-react";

const HERO_IMAGE = "";

// Animation Variants
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" as const },
    },
};

const imageVariants = {
    hidden: { opacity: 0, x: 60, scale: 0.95 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 1, ease: "easeOut" as const },
    },
};

// ---------- Illustration helpers ----------
const r2 = (n: number) => Number(n.toFixed(2));

const ROSE_COLORS = ["#722F3E", "#C98C86", "#FAF5F0", "#9C5560", "#E7D5CC"];

// Roses + leaves along the arch (semicircle centred at 200,250 radius 130)
const archFlora = Array.from({ length: 15 }, (_, i) => {
    const a = Math.PI - (i / 14) * Math.PI;
    return {
        x: r2(200 + 130 * Math.cos(a)),
        y: r2(250 - 130 * Math.sin(a)),
        tx: -Math.sin(a),
        ty: -Math.cos(a),
        r: 8 + (i % 3) * 2.5,
        c: ROSE_COLORS[(i * 2) % ROSE_COLORS.length],
    };
});

// Roses down both arch legs
const legFlora = [275, 312, 352, 396, 438].flatMap((y, i) => [
    { x: 70 + (i % 2 ? 3 : -3), y, r: 9 + (i % 3) * 2, c: ROSE_COLORS[(i + 1) % 5] },
    { x: 330 + (i % 2 ? -3 : 3), y, r: 9 + ((i + 1) % 3) * 2, c: ROSE_COLORS[(i + 3) % 5] },
]);

// Fairy lights on two swags (quadratic bezier points)
const swagPoint = (
    p0: [number, number],
    p1: [number, number],
    p2: [number, number],
    t: number,
): [number, number] => [
    r2((1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0]),
    r2((1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]),
];
const lightTs = [0.08, 0.24, 0.4, 0.56, 0.72, 0.88];
const lightsLeft = lightTs.map((t) => swagPoint([0, 28], [100, 84], [200, 34], t));
const lightsRight = lightTs.map((t) => swagPoint([200, 34], [300, 84], [400, 28], t));

const Rose = ({ x, y, r, c }: { x: number; y: number; r: number; c: string }) => (
    <g>
        <circle cx={x} cy={y} r={r} fill={c} />
        <circle cx={x} cy={y} r={r * 0.72} fill="#FAF5F0" opacity="0.28" />
        <path
            d={`M${r2(x - r * 0.38)} ${y} a${r2(r * 0.38)} ${r2(r * 0.38)} 0 1 1 ${r2(r * 0.38)} ${r2(r * 0.38)}`}
            fill="none"
            stroke="#4A1F2A"
            strokeWidth="0.9"
            opacity="0.5"
        />
        <path
            d={`M${r2(x - r * 0.75)} ${r2(y + r * 0.1)} q${r2(r * 0.7)} ${r2(r * 0.9)} ${r2(r * 1.5)} 0`}
            fill="none"
            stroke="#4A1F2A"
            strokeWidth="0.7"
            opacity="0.3"
        />
    </g>
);

const Leaf = ({ x, y, rot, s = 1 }: { x: number; y: number; rot: number; s?: number }) => (
    <ellipse
        cx={x}
        cy={y}
        rx={10 * s}
        ry={3.6 * s}
        fill="#5E6B4E"
        opacity="0.92"
        transform={`rotate(${r2(rot)} ${x} ${y})`}
    />
);

// Illustration Component
const Illustration = () => (
    <svg
        viewBox="0 0 400 520"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="bn-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3A1822" />
                <stop offset="35%" stopColor="#722F3E" />
                <stop offset="72%" stopColor="#C98C86" />
                <stop offset="100%" stopColor="#E7D5CC" />
            </linearGradient>

            <radialGradient id="bn-sun" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#F4E2B0" />
                <stop offset="55%" stopColor="#C6A15B" />
                <stop offset="100%" stopColor="#C6A15B" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="bn-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EBD59B" />
                <stop offset="50%" stopColor="#C6A15B" />
                <stop offset="100%" stopColor="#9C7A38" />
            </linearGradient>

            <linearGradient id="bn-gown" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E7D5CC" />
                <stop offset="45%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#EBDCD2" />
            </linearGradient>

            <linearGradient id="bn-veil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FAF5F0" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FAF5F0" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="bn-drape" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FAF5F0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FAF5F0" stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="bn-floor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A1F2A" />
                <stop offset="100%" stopColor="#2A0F17" />
            </linearGradient>

            <linearGradient id="bn-aisle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F4E2B0" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FAF5F0" stopOpacity="0.95" />
            </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="400" height="520" fill="url(#bn-sky)" />

        {/* Golden glow behind arch */}
        <circle cx="200" cy="300" r="190" fill="url(#bn-sun)" opacity="0.8" />
        <circle cx="200" cy="300" r="110" fill="url(#bn-sun)" opacity="0.5" />

        {/* Distant soft hills */}
        <path
            d="M0 410 Q90 365 200 400 T400 385 V520 H0Z"
            fill="#4A1F2A"
            opacity="0.5"
        />

        {/* Sheer drapes */}
        <g>
            <path
                d="M0 0 H62 Q38 110 56 240 Q68 330 38 430 Q18 396 0 410Z"
                fill="url(#bn-drape)"
            />
            <path d="M18 0 Q6 120 22 240 Q30 330 12 410" fill="none" stroke="#FAF5F0" strokeWidth="0.8" opacity="0.35" />
            <path d="M38 0 Q22 120 40 240 Q48 330 26 420" fill="none" stroke="#FAF5F0" strokeWidth="0.8" opacity="0.3" />
        </g>
        <g transform="translate(400 0) scale(-1 1)">
            <path
                d="M0 0 H62 Q38 110 56 240 Q68 330 38 430 Q18 396 0 410Z"
                fill="url(#bn-drape)"
            />
            <path d="M18 0 Q6 120 22 240 Q30 330 12 410" fill="none" stroke="#FAF5F0" strokeWidth="0.8" opacity="0.35" />
            <path d="M38 0 Q22 120 40 240 Q48 330 26 420" fill="none" stroke="#FAF5F0" strokeWidth="0.8" opacity="0.3" />
        </g>

        {/* Fairy lights */}
        <path d="M0 28 Q100 84 200 34" fill="none" stroke="#C6A15B" strokeWidth="0.8" opacity="0.7" />
        <path d="M200 34 Q300 84 400 28" fill="none" stroke="#C6A15B" strokeWidth="0.8" opacity="0.7" />
        {[...lightsLeft, ...lightsRight].map(([x, y], i) => (
            <g key={i}>
                <circle cx={x} cy={y} r="6" fill="#F4E2B0" opacity="0.22" />
                <circle cx={x} cy={y} r="2" fill="#F4E2B0" />
            </g>
        ))}

        {/* Gold sparkles */}
        {[
            [52, 120],
            [346, 100],
            [318, 160],
            [98, 160],
            [362, 250],
            [36, 250],
        ].map(([x, y], i) => (
            <path
                key={i}
                d={`M${x} ${y - 8} L${x + 2} ${y - 2} L${x + 8} ${y} L${x + 2} ${y + 2} L${x} ${y + 8} L${x - 2} ${y + 2} L${x - 8} ${y} L${x - 2} ${y - 2}Z`}
                fill="#F4E2B0"
                opacity="0.85"
            />
        ))}

        {/* Floor */}
        <path
            d="M0 440 Q120 425 200 432 T400 436 V520 H0Z"
            fill="url(#bn-floor)"
        />

        {/* Aisle runner */}
        <path d="M118 520 L282 520 L214 434 L186 434Z" fill="url(#bn-aisle)" />
        <path d="M118 520 L186 434" stroke="url(#bn-gold)" strokeWidth="1.6" fill="none" />
        <path d="M282 520 L214 434" stroke="url(#bn-gold)" strokeWidth="1.6" fill="none" />
        <path d="M200 520 L200 436" stroke="#C6A15B" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.6" />

        {/* Double gold arch */}
        <path
            d="M70 470 V250 a130 130 0 0 1 260 0 V470"
            fill="none"
            stroke="url(#bn-gold)"
            strokeWidth="3.5"
        />
        <path
            d="M84 470 V252 a116 116 0 0 1 232 0 V470"
            fill="none"
            stroke="#FAF5F0"
            strokeWidth="1"
            opacity="0.4"
        />
        <path
            d="M58 470 V250 a142 142 0 0 1 284 0 V470"
            fill="none"
            stroke="#C6A15B"
            strokeWidth="0.8"
            opacity="0.55"
        />

        {/* Garland leaves */}
        {archFlora.map((p, i) => (
            <g key={`al-${i}`}>
                <Leaf x={r2(p.x + p.tx * 13)} y={r2(p.y + p.ty * 13)} rot={(Math.atan2(p.ty, p.tx) * 180) / Math.PI + 22} />
                <Leaf x={r2(p.x - p.tx * 13)} y={r2(p.y - p.ty * 13)} rot={(Math.atan2(p.ty, p.tx) * 180) / Math.PI - 22} />
            </g>
        ))}
        {legFlora.map((p, i) => (
            <g key={`ll-${i}`}>
                <Leaf x={p.x - 11} y={p.y + 14} rot={115} />
                <Leaf x={p.x + 11} y={p.y - 14} rot={-65} />
            </g>
        ))}

        {/* Garland roses */}
        {archFlora.map((p, i) => (
            <Rose key={`ar-${i}`} x={p.x} y={p.y} r={p.r} c={p.c} />
        ))}
        {legFlora.map((p, i) => (
            <Rose key={`lr-${i}`} x={p.x} y={p.y} r={p.r} c={p.c} />
        ))}

        {/* Hanging ring pendant */}
        <line x1="200" y1="124" x2="200" y2="176" stroke="url(#bn-gold)" strokeWidth="1.2" />
        <circle cx="200" cy="124" r="4" fill="#C6A15B" />
        <circle cx="200" cy="205" r="34" fill="url(#bn-sun)" opacity="0.55" />
        <circle cx="190" cy="206" r="13" fill="none" stroke="url(#bn-gold)" strokeWidth="3" />
        <circle cx="210" cy="206" r="13" fill="none" stroke="#FAF5F0" strokeWidth="3" />
        <path d="M190 176 l5 7 l-5 7 l-5 -7Z" fill="#FAF5F0" />
        <path d="M190 176 l5 7 h-10Z" fill="#E7D5CC" />

        {/* Floral urns */}
        {[44, 356].map((x, i) => (
            <g key={`urn-${i}`} transform={`translate(${x} 484)`}>
                <ellipse cx="0" cy="2" rx="22" ry="5" fill="#2A0F17" opacity="0.5" />
                <path d="M-15 0 H15 L11 -30 H-11Z" fill="url(#bn-gold)" />
                <path d="M-13 -30 H13" stroke="#FAF5F0" strokeWidth="1" opacity="0.5" />
                <Leaf x={-18} y={-44} rot={-30} s={1.2} />
                <Leaf x={18} y={-44} rot={30} s={1.2} />
                <Leaf x={0} y={-58} rot={90} s={1.1} />
                <Rose x={-11} y={-40} r={9} c="#C98C86" />
                <Rose x={11} y={-40} r={9} c="#FAF5F0" />
                <Rose x={0} y={-48} r={11} c="#722F3E" />
                <Rose x={0} y={-62} r={7} c="#E7D5CC" />
            </g>
        ))}

        {/* Scattered petals on the aisle */}
        {[
            [160, 492, 20, "#C98C86"],
            [236, 500, -30, "#FAF5F0"],
            [188, 470, 60, "#E7D5CC"],
            [218, 480, 10, "#C98C86"],
            [140, 508, -40, "#FAF5F0"],
            [262, 510, 35, "#C98C86"],
            [200, 454, -15, "#722F3E"],
            [176, 512, 50, "#722F3E"],
            [104, 486, 15, "#C98C86"],
            [300, 490, -20, "#E7D5CC"],
        ].map(([x, y, rot, c], i) => (
            <ellipse
                key={i}
                cx={x as number}
                cy={y as number}
                rx="5"
                ry="2.6"
                fill={c as string}
                opacity="0.9"
                transform={`rotate(${rot} ${x} ${y})`}
            />
        ))}

        {/* Couple shadow */}
        <ellipse cx="200" cy="456" rx="62" ry="7" fill="#2A0F17" opacity="0.45" />

        {/* Bride: veil */}
        <path
            d="M178 306 Q146 318 140 372 Q136 420 128 458 Q158 446 176 430 Q172 372 186 322Z"
            fill="url(#bn-veil)"
        />
        <path
            d="M178 306 Q158 330 156 372 Q154 410 148 442"
            fill="none"
            stroke="#FAF5F0"
            strokeWidth="0.8"
            opacity="0.5"
        />

        {/* Bride: gown */}
        <path
            d="M169 334 Q178 329 187 334 L185 360 Q210 404 224 452 Q178 466 132 452 Q150 404 171 360Z"
            fill="url(#bn-gown)"
        />
        <path
            d="M172 362 Q160 410 150 450 M182 362 Q184 412 182 458 M186 366 Q208 410 216 452"
            fill="none"
            stroke="#C98C86"
            strokeWidth="0.8"
            opacity="0.45"
        />
        <path d="M171 360 Q178 365 185 360" fill="none" stroke="url(#bn-gold)" strokeWidth="2.4" />
        <path d="M132 452 Q178 466 224 452" fill="none" stroke="url(#bn-gold)" strokeWidth="1.4" />
        {/* Bride: head and hair */}
        <circle cx="178" cy="318" r="10" fill="#EBC9B5" />
        <path d="M168 318 Q168 304 179 304 Q190 305 188 318 Q184 310 178 310 Q172 311 168 318Z" fill="#3A1F1A" />
        <circle cx="181" cy="304" r="5" fill="#3A1F1A" />
        {/* Tiara */}
        <path d="M170 309 l3 -5 l3 4 l3 -5 l3 4 l3 -4 l1 5" fill="none" stroke="url(#bn-gold)" strokeWidth="1.4" />

        {/* Groom: jacket */}
        <path
            d="M211 336 Q227 327 243 336 L248 402 L242 456 L229 456 L227 414 L225 414 L223 456 L210 456 L206 402Z"
            fill="#2A0F17"
        />
        <path d="M220 332 L227 358 L234 332Z" fill="#FAF5F0" />
        <path d="M218 333 L227 366 M236 333 L227 366" stroke="#722F3E" strokeWidth="1.4" fill="none" />
        {/* Groom: bow tie and boutonniere */}
        <path d="M222 337 l5 3 l5 -3 v6 l-5 -3 l-5 3Z" fill="url(#bn-gold)" />
        <circle cx="238" cy="350" r="2.6" fill="#C98C86" />
        {/* Groom: head and hair */}
        <circle cx="227" cy="318" r="10.5" fill="#EBC9B5" />
        <path d="M216 316 Q217 303 228 303 Q239 304 238 316 Q234 309 226 309 Q219 310 216 316Z" fill="#2A0F17" />

        {/* Joined hands and arms */}
        <path d="M212 342 Q204 360 197 374" stroke="#2A0F17" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M184 342 Q186 360 194 374" stroke="#FAF5F0" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="196" cy="376" r="3.6" fill="#EBC9B5" />

        {/* Bridal bouquet */}
        <g>
            <Leaf x={181} y={388} rot={150} s={0.9} />
            <Leaf x={206} y={388} rot={30} s={0.9} />
            <Rose x={188} y={382} r={6.5} c="#722F3E" />
            <Rose x={199} y={382} r={6.5} c="#C98C86" />
            <Rose x={193} y={376} r={6} c="#FAF5F0" />
            <circle cx="193" cy="388" r="2" fill="#C6A15B" />
        </g>

        {/* Floating petals in the air */}
        {[
            [96, 330, 30, "#FAF5F0"],
            [306, 300, -25, "#E7D5CC"],
            [120, 260, 70, "#C98C86"],
            [290, 360, 15, "#FAF5F0"],
            [262, 250, -50, "#C98C86"],
            [150, 400, -20, "#E7D5CC"],
        ].map(([x, y, rot, c], i) => (
            <ellipse
                key={i}
                cx={x as number}
                cy={y as number}
                rx="4.5"
                ry="2.2"
                fill={c as string}
                opacity="0.75"
                transform={`rotate(${rot} ${x} ${y})`}
            />
        ))}
    </svg>
);

// Banner Component
const Banner = () => {
    return (
        <section className="relative isolate overflow-hidden bg-[#FAF5F0]">

            {/* Background Decoration */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 7, repeat: Infinity }}
                    className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#722F3E]/10 blur-3xl"
                />

                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-[#C6A15B]/15 blur-3xl"
                />

                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: "radial-gradient(#E7D5CC 1px, transparent 1px)",
                        backgroundSize: "26px 26px",
                    }}
                />
            </div>

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-20">

                {/* Left Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl"
                >
                    <motion.div
                        variants={fadeUp}
                        className="inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/50 bg-white px-4 py-2 text-sm font-medium text-[#722F3E] shadow-sm"
                    >
                        <BadgeCheck className="h-4 w-4 text-[#C6A15B]" />
                        Trusted by couples planning their big day
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="mt-7 text-4xl font-bold leading-[1.15] tracking-tight text-[#4A1F2A] sm:text-5xl lg:text-6xl"
                        style={{
                            fontFamily: "var(--font-playfair), Georgia, serif",
                        }}
                    >
                        Plan Your Dream Wedding

                        <span className="mt-2 block bg-gradient-to-r from-[#722F3E] via-[#9C5560] to-[#C6A15B] bg-clip-text italic text-transparent">
                            With Vendors You Can Trust.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="mt-6 max-w-xl text-base leading-8 text-[#4A1F2A]/75 sm:text-lg"
                    >
                        Discover photographers, beautiful venues, florists,
                        caterers and wedding stylists in one place. Compare
                        services, send booking requests and organize every
                        detail of your special celebration.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        variants={fadeUp}
                        className="mt-9 flex flex-col gap-4 sm:flex-row"
                    >
                        <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.96 }}>
                            <Link
                                href="/browse-services"
                                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-br from-[#8B3A4C] via-[#722F3E] to-[#4A1F2A] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#722F3E]/25 ring-1 ring-[#C6A15B]/50 transition-all hover:shadow-xl"
                            >
                                Explore Wedding Services
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.96 }}>
                            <Link
                                href="/sign-up"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#722F3E]/25 bg-white px-8 py-4 text-sm font-semibold text-[#722F3E] transition-all hover:border-[#C6A15B] hover:bg-[#FAF5F0]"
                            >
                                <Heart className="h-4 w-4 text-[#C6A15B]" />
                                Join as a Vendor
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Trust Information */}
                    <motion.div
                        variants={fadeUp}
                        className="mt-10 grid max-w-lg grid-cols-2 gap-5 border-t border-[#E7D5CC] pt-7 sm:grid-cols-3"
                    >
                        <div>
                            <p className="font-serif text-3xl font-bold text-[#722F3E]">6</p>
                            <p className="mt-1 text-sm text-[#4A1F2A]/65">Service Categories</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-5 w-5 text-[#C6A15B]" />
                                <p className="font-serif text-xl font-bold text-[#722F3E]">Verified</p>
                            </div>
                            <p className="mt-1 text-sm text-[#4A1F2A]/65">Vendor Profiles</p>
                        </div>

                        <div className="hidden sm:block">
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 fill-[#C6A15B] text-[#C6A15B]" />
                                <p className="font-serif text-xl font-bold text-[#722F3E]">Premium</p>
                            </div>
                            <p className="mt-1 text-sm text-[#4A1F2A]/65">Wedding Services</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Visual */}
                <motion.div
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative mx-auto w-full max-w-md lg:max-w-none"
                >
                    <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[999px] rounded-b-[2rem] border border-[#C6A15B]/70" />

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
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={{ scale: 1.05 }}
                        className="absolute -left-1 bottom-16 flex items-center gap-3 rounded-2xl border border-[#E7D5CC] bg-white p-3.5 pr-5 shadow-xl sm:-left-5"
                    >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#722F3E] text-[#E4C98A]">
                            <CalendarCheck className="h-5 w-5" />
                        </span>

                        <div>
                            <p className="text-sm font-bold text-[#4A1F2A]">Easy Booking</p>
                            <p className="text-xs text-[#4A1F2A]/60">Plan every detail with ease</p>
                        </div>
                    </motion.div>

                    {/* Rating Card */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={{ scale: 1.05 }}
                        className="absolute -right-1 top-20 rounded-2xl border border-[#E7D5CC] bg-white p-4 shadow-xl sm:-right-5"
                    >
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className="h-4 w-4 fill-[#C6A15B] text-[#C6A15B]"
                                />
                            ))}
                        </div>

                        <p className="mt-2 text-sm font-bold text-[#4A1F2A]">Quality Services</p>
                        <p className="text-xs text-[#4A1F2A]/60">Find your perfect vendors</p>
                    </motion.div>

                    {/* Sparkle */}
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute -right-1 bottom-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-white shadow-lg sm:-right-4"
                    >
                        <Sparkles className="h-6 w-6 text-[#C6A15B]" />
                    </motion.div>
                </motion.div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent opacity-70" />
        </section>
    );
};

export default Banner;