
"use client";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import Logo from "@/app/shared/Logo";

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };


  const router = useRouter();
 
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!formData.email.trim() || !formData.password) {
    toast.error("Please fill in all required fields.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    toast.error("Please enter a valid email address.");
    return;
  }

  try {
    setIsLoading(true);

    const { data, error } = await signIn.email({
      email: formData.email.trim(),
      password: formData.password,
      rememberMe,
    });

    console.log("Login Response:", data);
    console.log("Login Error:", error);

    if (error) {
      toast.error(error.message || "Invalid email or password.");
      return;
    }

    if (data) {
      toast.success("Welcome back! Login successful.");

      router.replace("/");
      router.refresh();
    }
  } catch (err) {
    console.error("Login Error:", err);

    toast.error(
      err instanceof Error
        ? err.message
        : "Unable to sign in. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};

const handleGoogleLogin = async () => {
  try {
    setError("");
    setSuccess("");
    setIsLoading(true);

    const { error } = await signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message || "Google login failed!");
      setIsLoading(false);
      return;
    }
  } catch (error) {
    console.error("Google Login Error:", error);

    toast.error("Unable to login with Google. Please try again.");
    setIsLoading(false);
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF5F0] px-4 py-10 sm:px-6">

      {/* Centered Auth Card */}
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#E7D5CC] bg-white shadow-2xl shadow-[#4A1F2A]/10 lg:min-h-[650px] lg:grid-cols-2">

        {/* Left Branding Panel */}
        <section className="relative hidden overflow-hidden bg-[#4A1F2A] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

          <div className="absolute -left-28 top-16 h-80 w-80 rounded-full bg-[#C6A15B]/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#722F3E]/60 blur-3xl" />

          {/* Logo */}
          <div className="relative z-10">
  <Logo light={true} />
</div>

          {/* Content */}
          <div className="relative z-10 my-12">
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
              <Sparkles className="h-4 w-4" />
              Welcome Back
            </div>

            <h2 className="font-serif text-4xl font-semibold leading-tight xl:text-5xl">
              Your dream day
              <br />
              begins <span className="italic text-[#C6A15B]">here.</span>
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#E7D5CC]">
              Sign in to continue your wedding journey. Connect with
              trusted vendors, manage your bookings, and create
              unforgettable memories.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px w-12 bg-[#C6A15B]" />
              <p className="font-serif text-base italic text-[#E7D5CC]">
                Every love story deserves a beautiful beginning.
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 border-t border-white/15 pt-5 text-xs text-[#E7D5CC]/70">
            © 2026 WedPlan. All rights reserved.
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-14">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link href="/" className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#722F3E]">
                <Heart className="h-5 w-5 text-[#C6A15B]" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#722F3E]">
                Wed<span className="text-[#C6A15B]">Plan</span>
              </h1>
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#722F3E]">
                <Sparkles className="h-3.5 w-3.5" />
                Welcome Back
              </div>

              <h2 className="font-serif text-4xl font-bold text-[#4A1F2A]">
                Sign <span className="italic text-[#C6A15B]">In</span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#7C6965]">
                Welcome back! Enter your details to access your account.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div role="status" className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#4A1F2A]">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A18A83]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-[#E7D5CC] bg-[#FAF5F0]/50 pl-12 pr-4 text-sm text-[#4A1F2A] outline-none transition placeholder:text-[#B6A7A1] focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-[#4A1F2A]">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#A17B3E] transition hover:text-[#722F3E]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A18A83]" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-[#E7D5CC] bg-[#FAF5F0]/50 pl-12 pr-12 text-sm text-[#4A1F2A] outline-none transition placeholder:text-[#B6A7A1] focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A18A83] hover:text-[#722F3E]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-[#722F3E]"
                />
                <label htmlFor="rememberMe" className="text-sm text-[#7C6965]">
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#722F3E] px-6 text-sm font-semibold text-white shadow-lg shadow-[#722F3E]/15 transition hover:bg-[#4A1F2A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing In..." : "Sign In"}
                {!isLoading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E7D5CC]" />
              <span className="text-xs font-medium uppercase tracking-wider text-[#A18A83]">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-[#E7D5CC]" />
            </div>

            {/* Google */}
     <button
  type="button"
  onClick={handleGoogleLogin}
  disabled={isLoading}
  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#E7D5CC] bg-white text-sm font-semibold text-[#4A1F2A] transition hover:border-[#C6A15B] hover:bg-[#FAF5F0] disabled:cursor-not-allowed disabled:opacity-60"
>
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15z" />
                <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4.1 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.2A20 20 0 0 0 24 44z" />
                <path fill="#FBBC05" d="M12.8 27.7a12 12 0 0 1 0-7.4v-5.2H5.9a20 20 0 0 0 0 17.8l6.9-5.2z" />
                <path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8A19.5 19.5 0 0 0 24 4 20 20 0 0 0 5.9 15.1l6.9 5.2c1.6-4.7 6-8.2 11.2-8.2z" />
              </svg>
              Continue with Google
            </button>

            {/* Sign Up */}
            <p className="mt-7 text-center text-sm text-[#7C6965]">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-[#722F3E] transition hover:text-[#A17B3E]"
              >
                Sign Up
              </Link>
            </p>

            <p className="mt-7 text-center text-xs text-[#A18A83]">
              © 2026 WedPlan. All rights reserved.
            </p>

          </div>
        </section>
      </div>
    </main>
  );
};

export default SignInPage;
