import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

// lucide-react no longer ships brand icons, so the marks are inlined here.
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.152 0-3.526.013-4.77.069-1.15.052-1.774.244-2.19.406-.55.214-.943.469-1.355.882-.413.412-.668.805-.882 1.355-.162.416-.354 1.04-.406 2.19-.056 1.244-.069 1.618-.069 4.77s.013 3.526.069 4.77c.052 1.15.244 1.774.406 2.19.214.55.469.943.882 1.355.412.413.805.668 1.355.882.416.162 1.04.354 2.19.406 1.244.056 1.618.069 4.77.069s3.526-.013 4.77-.069c1.15-.052 1.774-.244 2.19-.406.55-.214.943-.469 1.355-.882.413-.412.668-.805.882-1.355.162-.416.354-1.04.406-2.19.056-1.244.069-1.618.069-4.77s-.013-3.526-.069-4.77c-.052-1.15-.244-1.774-.406-2.19a3.64 3.64 0 0 0-.882-1.355 3.64 3.64 0 0 0-1.355-.882c-.416-.162-1.04-.354-2.19-.406-1.244-.056-1.618-.069-4.77-.069zm0 3.065a4.972 4.972 0 1 1 0 9.944 4.972 4.972 0 0 1 0-9.944zm0 1.802a3.17 3.17 0 1 0 0 6.34 3.17 3.17 0 0 0 0-6.34zm6.32-3.02a1.162 1.162 0 1 1-2.324 0 1.162 1.162 0 0 1 2.324 0z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/browse-services" },
  { label: "Categories", href: "/categories" },
  { label: "Featured Service", href: "/featured-service" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

// Placeholder destinations: swap in the real profile URLs once they exist.
const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    Icon: FacebookIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    Icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    Icon: LinkedinIcon,
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#4A1F2A] text-[#FAF5F0]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div>
            <Logo light />

            <p className="mt-4 max-w-xs text-sm leading-7 text-[#E7D5CC]">
              Making your special day unforgettable. Discover trusted vendors
              and plan your perfect wedding with ease.
            </p>

            <div className="mt-6 flex gap-4">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-[#E7D5CC] transition-colors hover:text-[#C6A15B]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Footer">
            <h3 className="mb-5 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3 text-sm text-[#E7D5CC]">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#C6A15B]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Information */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-4 text-sm text-[#E7D5CC]">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="shrink-0 text-[#C6A15B]" />
                Chattogram, Bangladesh
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-[#C6A15B]" />
                <a
                  href="tel:+8801234567890"
                  className="transition-colors hover:text-[#C6A15B]"
                >
                  +880 1234-567***
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-[#C6A15B]" />
                <a
                  href="mailto:support@wedplan.com"
                  className="transition-colors hover:text-[#C6A15B]"
                >
                  support@wedplan.com
                </a>
              </li>
            </ul>
          </div>

          {/* Short Message */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Plan Your Day</h3>
            <p className="text-sm leading-7 text-[#E7D5CC]">
              Your dream wedding starts here. Find the right professionals and
              turn your vision into reality.
            </p>
            <Link
              href="/browse-services"
              className="mt-5 inline-block rounded-md bg-[#C6A15B] px-5 py-2.5 text-sm font-semibold text-[#4A1F2A] transition-colors hover:bg-[#B08C46]"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-[#FAF5F0]/15 pt-6 text-center">
          <p className="text-sm text-[#E7D5CC]">
            © {new Date().getFullYear()} WedPlan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
