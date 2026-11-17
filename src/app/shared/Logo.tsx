import React, { useId } from "react";

type LogoProps = {
    className?: string;
    showText?: boolean;
    light?: boolean; // use on dark burgundy backgrounds (e.g. footer)
};

/** WedPlan logo: interlocking rings crowned with a gold diamond. */
export const LogoMark = ({ className = "h-11 w-11" }: { className?: string }) => {
    const id = useId().replace(/:/g, "");
    return (
        <svg
            viewBox="0 0 56 56"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#EBD59B" />
                    <stop offset="50%" stopColor="#C6A15B" />
                    <stop offset="100%" stopColor="#9C7A38" />
                </linearGradient>
                <linearGradient id={`wine-${id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8B3A4C" />
                    <stop offset="100%" stopColor="#4A1F2A" />
                </linearGradient>
                <clipPath id={`clip-${id}`}>
                    <rect x="21" y="38" width="14" height="14" />
                </clipPath>
            </defs>

            {/* Soft backing disc */}
            <circle cx="28" cy="33" r="21" fill="#E7D5CC" opacity="0.35" />

            {/* Rings */}
            <circle cx="21.5" cy="33" r="13" stroke={`url(#wine-${id})`} strokeWidth="3" />
            <circle cx="34.5" cy="33" r="13" stroke={`url(#gold-${id})`} strokeWidth="3" />

            {/* Interlock: redraw wine ring over gold ring at the lower crossing */}
            <circle
                cx="21.5"
                cy="33"
                r="13"
                stroke={`url(#wine-${id})`}
                strokeWidth="3"
                clipPath={`url(#clip-${id})`}
            />

            {/* Diamond */}
            <path d="M28 3 L34 9.5 L28 17 L22 9.5 Z" fill={`url(#gold-${id})`} />
            <path
                d="M22 9.5 H34 M28 3 L25.5 9.5 L28 17 L30.5 9.5 Z"
                stroke="#FAF5F0"
                strokeWidth="0.8"
                strokeLinejoin="round"
                opacity="0.85"
            />
        </svg>
    );
};

const Logo = ({ className = "", showText = true, light = false }: LogoProps) => {
    return (
        <span className={`inline-flex items-center gap-3 ${className}`}>
            <LogoMark />
            {showText && (
                <span className="flex flex-col leading-none">
                    <span
                        className={`text-[1.65rem] font-semibold tracking-tight ${
                            light ? "text-[#FAF5F0]" : "text-[#4A1F2A]"
                        }`}
                        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                        Wed<span className="text-[#C6A15B]">Plan</span>
                    </span>
                    <span
                        className={`mt-1 text-[0.62rem] tracking-[0.32em] ${
                            light ? "text-[#E7D5CC]" : "text-[#722F3E]/70"
                        }`}
                    >
                        Luxury Weddings
                    </span>
                </span>
            )}
        </span>
    );
};

export default Logo;
