"use client";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  Lock,
  Camera,
  Store,
  Heart,
  ArrowRight,
  Sparkles,
  ImagePlus,
} from "lucide-react";
import Logo from "@/app/shared/Logo";


const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordRules = [
    {
      label: "At least 6 characters",
      valid: formData.password.length >= 6,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(formData.password),
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error("Profile image upload failed.");
  }

  return result.data.url;
};
const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
    setSuccess("");
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));

    setError("");
    setSuccess("");
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!formData.fullName.trim()) {
    toast.error("Please enter your full name.");
    return;
  }

  if (!formData.email.trim()) {
    toast.error("Please enter your email address.");
    return;
  }

  if (!passwordRules.every((rule) => rule.valid)) {
    toast.error("Please fulfill all password requirements.");
    return;
  }

  try {
    let imageUrl: string | undefined;

    if (profileImage) {
      imageUrl = await uploadProfileImage(profileImage);
    }

   const { data, error } = await signUp.email({
  name: formData.fullName.trim(),
  email: formData.email.trim(),
  password: formData.password,
  image: imageUrl,
  role: formData.role, // Add this
});

    console.log("Signup Response:", data);
    console.log("Signup Error:", error);

    if (error) {
      console.error("Signup Failed:", error);
      toast.error(error.message || "Registration failed.");
      return;
    }

    if (data) {
      console.log("Registration Successful!");
      toast.success("Account created successfully!");

      router.replace("/sign-in");
    }
  } catch (err) {
    console.error("Registration Error:", err);

    toast.error(
      err instanceof Error
        ? err.message
        : "Something went wrong. Please try again."
    );
  }
};


  const handleGoogleSignUp = () => {
    setError("Google authentication is not connected yet.");
    setSuccess("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF5F0] px-4 py-10 sm:px-6">

      {/* Centered Auth Card */}
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#E7D5CC]/60 bg-white shadow-[0_20px_70px_rgba(74,31,42,0.10)] lg:grid-cols-2">

        {/* Left Side - Branding */}
        <section className="relative hidden overflow-hidden bg-[#4A1F2A] p-10 text-white lg:flex lg:min-h-[750px] lg:flex-col lg:justify-between xl:p-12">

          {/* Decorations */}
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#C6A15B]/30" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-[#C6A15B]/30" />
          <div className="absolute right-10 top-1/2 h-48 w-48 rounded-full bg-[#C6A15B]/5 blur-3xl" />

          {/* Shared Logo */}
           {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3">
           <div className="relative z-10">
            <Logo light />
          </div>
          </Link>

          {/* Branding Content */}
          <div className="relative z-10 my-10">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#C6A15B]">
              <Sparkles className="h-4 w-4" />
              Begin Your Journey
            </p>

            <h1 className="font-serif text-4xl leading-tight xl:text-5xl">
              Every love story deserves a
              <span className="block italic text-[#C6A15B]">
                beautiful beginning.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-8 text-white/70">
              Join WedPlan and discover a world of beautiful
              wedding services. Plan, connect, and make your
              dream wedding unforgettable.
            </p>
          </div>

          {/* Decorative Illustration */}
          <div className="relative z-10 mx-auto flex h-48 w-full max-w-sm items-center justify-center">
            <div className="absolute h-44 w-44 rounded-t-full border-[3px] border-[#C6A15B]/70" />
            <div className="absolute h-36 w-36 rounded-t-full border border-[#E7D5CC]/50" />

            <div className="relative flex flex-col items-center">
              <Heart className="h-12 w-12 fill-[#C6A15B]/20 text-[#C6A15B]" />
              <Sparkles className="mt-3 h-7 w-7 text-[#E7D5CC]" />
              <p className="mt-3 font-serif text-xl italic text-[#E7D5CC]">
                Your forever starts here
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="relative z-10 border-t border-white/15 pt-5 text-xs text-white/50">
            © 2026 WedPlan. Made for your special moments.
          </p>
        </section>

        {/* Right Side - Sign Up Form */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-10 xl:px-12">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-7 flex justify-center lg:hidden">
              <Logo />
            </div>

            {/* Heading */}
            <div className="mb-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
                Create Account
              </p>

              <h2 className="font-serif text-4xl font-bold text-[#4A1F2A]">
                Join <span className="italic text-[#C6A15B]">WedPlan</span>
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create your account and start your wedding journey.
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* 1. Account Role */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#4A1F2A]">
                  Select Account Role
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => handleRoleChange("vendor")}
                    aria-pressed={formData.role === "vendor"}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      formData.role === "vendor"
                        ? "border-[#722F3E] bg-[#722F3E]/5 ring-1 ring-[#722F3E]"
                        : "border-gray-200 hover:border-[#C6A15B]"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-2 ${
                        formData.role === "vendor"
                          ? "bg-[#722F3E] text-white"
                          : "bg-[#FAF5F0] text-[#722F3E]"
                      }`}
                    >
                      <Store className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#4A1F2A]">
                        Vendor
                      </p>
                      <p className="text-xs text-gray-400">
                        Offer services
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange("customer")}
                    aria-pressed={formData.role === "customer"}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      formData.role === "customer"
                        ? "border-[#722F3E] bg-[#722F3E]/5 ring-1 ring-[#722F3E]"
                        : "border-gray-200 hover:border-[#C6A15B]"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-2 ${
                        formData.role === "customer"
                          ? "bg-[#722F3E] text-white"
                          : "bg-[#FAF5F0] text-[#722F3E]"
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#4A1F2A]">
                        Customer
                      </p>
                      <p className="text-xs text-gray-400">
                        Plan your wedding
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Profile Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4A1F2A]">
                  Profile Image
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#C6A15B]/60 bg-[#FAF5F0]/60 p-3 transition hover:border-[#722F3E]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7D5CC]">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlus className="h-5 w-5 text-[#722F3E]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#4A1F2A]">
                      Upload your photo
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-400">
                      {profileImage
                        ? profileImage.name
                        : "PNG, JPG or JPEG (Max 5MB)"}
                    </p>
                  </div>

                  <Camera className="h-5 w-5 shrink-0 text-[#C6A15B]" />

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* 3. Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-[#4A1F2A]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-[#FAF5F0]/50 pl-12 pr-4 text-sm outline-none transition focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20"
                    required
                  />
                </div>
              </div>

              {/* 4. Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#4A1F2A]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-[#FAF5F0]/50 pl-12 pr-4 text-sm outline-none transition focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20"
                    required
                  />
                </div>
              </div>

              {/* 5. Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#4A1F2A]"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-[#FAF5F0]/50 pl-12 pr-12 text-sm outline-none transition focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#722F3E]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Rules */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {passwordRules.map((rule) => (
                    <div
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-[11px] ${
                        rule.valid ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <span>{rule.valid ? "✓" : "○"}</span>
                      {rule.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#722F3E] text-sm font-semibold text-white shadow-lg shadow-[#722F3E]/20 transition hover:bg-[#4A1F2A]"
              >
                Create Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">
                OR REGISTER WITH
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:border-[#C6A15B] hover:bg-[#FAF5F0]"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.91c-.58 2.96-2.26 5.48-4.73 7.17l7.29 5.65c4.25-3.92 7.51-9.7 7.51-17.29Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.81l-7.29-5.65c-2.02 1.35-4.6 2.16-8.62 2.16-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-[#722F3E] transition hover:text-[#C6A15B]"
              >
                Sign In
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-6 text-gray-400">
              By creating an account, you agree to our Terms of Service
              and Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignUpPage;
