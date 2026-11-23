
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MapPin,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { authClient, getJwtToken } from "@/lib/auth-client";
import { getDashboardPath, isVendor } from "@/lib/roles";
import { isPremiumActive } from "@/lib/subscription";
import {
  addService,
  getVendorServices,
} from "@/app/all-api/service";
import { uploadServiceImage } from "@/app/all-api/imgbb";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const FREE_SERVICE_LIMIT = 3;
const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const AddServicePage = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | {
        role?: string | null;
        accountType?: string | null;
        subscriptionPlan?: string | null;
        subscriptionExpiresAt?: Date | string | null;
      }
    | undefined;

  const isVendorUser = isVendor(user);
  const dashboardPath = getDashboardPath(user);
  const isPremium = isPremiumActive(user);

  // Subscription states
  const [serviceCount, setServiceCount] = useState(0);
  const [checkingLimit, setCheckingLimit] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });

  // Multiple image states
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Keep track of object URLs for cleanup
  const previewsRef = useRef<string[]>([]);

  const [loading, setLoading] = useState(false);

  // Authentication check
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    if (!isVendorUser) {
      toast.error("Only vendors can add services.");
      router.replace(dashboardPath);
    }
  }, [session, isPending, isVendorUser, dashboardPath, router]);

  // Check Free Plan service limit
  useEffect(() => {
    if (isPending) return;

    if (!session?.user || !isVendorUser) {
      setCheckingLimit(false);
      return;
    }

    let cancelled = false;

    const checkServiceLimit = async () => {
      try {
        if (isPremium) {
          setServiceCount(0);
          return;
        }

        const token = await getJwtToken();

        if (token.split(".").length !== 3) {
          throw new Error("Invalid JWT format.");
        }

        const services = await getVendorServices(token);

        if (cancelled) return;

        setServiceCount(services.length);

        if (services.length >= FREE_SERVICE_LIMIT) {
          toast.error(
            "Free plan allows only 3 services. Upgrade to Premium!"
          );

          router.replace("/vendor/subscription");
        }
      } catch (error) {
        console.error("Service limit error:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to check your service limit."
        );
      } finally {
        if (!cancelled) {
          setCheckingLimit(false);
        }
      }
    };

    checkServiceLimit();

    return () => {
      cancelled = true;
    };
  }, [isPending, session, isVendorUser, isPremium, router]);

  // Cleanup remaining preview URLs on unmount
  useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  // Handle text inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle multiple image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (images.length + files.length > MAX_IMAGES) {
      toast.error("You can upload maximum 4 images.");
      e.target.value = "";
      return;
    }

    const validFiles: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image.`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name} must be less than 5MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map((file) =>
        URL.createObjectURL(file)
      );

      const updatedPreviews = [...previewsRef.current, ...newPreviews];

      previewsRef.current = updatedPreviews;

      setImages((prev) => [...prev, ...validFiles]);
      setPreviews(updatedPreviews);
    }

    // Allow selecting the same file again
    e.target.value = "";
  };

  // Remove individual image
  const handleRemoveImage = (index: number) => {
    const previewToRemove = previewsRef.current[index];

    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove);
    }

    const updatedPreviews = previewsRef.current.filter(
      (_, i) => i !== index
    );

    previewsRef.current = updatedPreviews;

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews(updatedPreviews);
  };

  // Remove all images
  const handleRemoveAllImages = () => {
    previewsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    previewsRef.current = [];

    setImages([]);
    setPreviews([]);
  };

  // Submit service
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (checkingLimit || loading) return;

    // Free plan limit check
    if (!isPremium && serviceCount >= FREE_SERVICE_LIMIT) {
      toast.error(
        "Free plan allows only 3 services. Upgrade to Premium!"
      );

      router.push("/vendor/subscription");
      return;
    }

    // Validate form
    if (
      !formData.serviceName.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.location.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const price = Number(formData.price);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid service price.");
      return;
    }

    if (!session?.user) {
      toast.error("Please sign in first.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Generate JWT
      const token = await getJwtToken();

      if (token.split(".").length !== 3) {
        throw new Error("Invalid authentication token.");
      }

      // Step 2: Upload all selected images to ImgBB
      let imageUrls: string[] = [];

      if (images.length > 0) {
        try {
          imageUrls = await Promise.all(
            images.map((file) => uploadServiceImage(file))
          );
        } catch (uploadError) {
          console.error("ImgBB upload error:", uploadError);

          throw new Error(
            "Image upload failed. Please try JPG, PNG or WEBP images under 5MB."
          );
        }

        // Validate uploaded image URLs
        if (
          imageUrls.length !== images.length ||
          imageUrls.some(
            (url) => !url || !url.startsWith("https://")
          )
        ) {
          throw new Error("One or more images failed to upload.");
        }
      }

      // Step 3: Prepare service data
      const serviceData = {
        vendorId: session.user.id,
        vendorName: session.user.name || "",
        vendorEmail: session.user.email || "",
        serviceName: formData.serviceName.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price,
        location: formData.location.trim(),

        // First image = Main image
        image: imageUrls[0] || "",

        // Remaining images = Additional images
        images: imageUrls.slice(1),
      };

      // Step 4: Save service using JWT
      await addService(serviceData, token);

      toast.success(
        "Service submitted successfully! Awaiting approval."
      );

      // Update service count
      if (!isPremium) {
        setServiceCount((prev) => prev + 1);
      }

      // Reset form
      setFormData({
        serviceName: "",
        category: "",
        description: "",
        price: "",
        location: "",
      });

      handleRemoveAllImages();

      router.push("/vendor/my-services");
    } catch (error) {
      console.error("Submit Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading / authorization
  if (
    isPending ||
    checkingLimit ||
    !session ||
    !isVendorUser
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#722F3E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vendor/my-services"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8B7478] transition hover:text-[#722F3E]"
          >
            <ArrowLeft size={17} />
            Back to My Services
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C6A15B]">
                <Sparkles size={15} />
                Vendor Dashboard
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#4A1F2A] sm:text-4xl">
                Add New Service
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#8B7478]">
                Showcase your wedding expertise and help couples find the
                perfect service for their special day.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-[#E7D5CC] bg-white px-4 py-2 text-xs font-semibold text-[#722F3E] sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-[#C6A15B]" />
              New Listing
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_320px]">

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-[#E7D5CC] bg-white shadow-sm"
          >
            <div className="border-b border-[#F0E7E1] px-6 py-5 sm:px-8">
              <h2 className="text-xl font-semibold text-[#4A1F2A]">
                Service Information
              </h2>

              <p className="mt-1 text-sm text-[#9B8588]">
                Fill in the details about your wedding service.
              </p>
            </div>

            <div className="space-y-6 p-6 sm:p-8">

              {/* Service Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4A1F2A]">
                  Service Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  placeholder="e.g. Premium Wedding Photography"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-[#E7D5CC] bg-[#FFFCFA] px-4 py-3 text-sm text-[#4A1F2A] outline-none transition placeholder:text-[#B9A7A6] focus:border-[#722F3E] focus:ring-2 focus:ring-[#722F3E]/10"
                />
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4A1F2A]">
                    Service Category <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[#E7D5CC] bg-[#FFFCFA] px-4 py-3 text-sm text-[#4A1F2A] outline-none focus:border-[#722F3E] focus:ring-2 focus:ring-[#722F3E]/10"
                  >
                    <option value="">Select a category</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4A1F2A]">
                    Price ($) <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#9B8588]">
                      $
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 15000"
                      min="1"
                      step="1"
                      required
                      className="w-full rounded-xl border border-[#E7D5CC] bg-[#FFFCFA] py-3 pl-9 pr-4 text-sm text-[#4A1F2A] outline-none focus:border-[#722F3E] focus:ring-2 focus:ring-[#722F3E]/10"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4A1F2A]">
                  Service Location <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B9A7A6]"
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Chattogram, Bangladesh"
                    required
                    className="w-full rounded-xl border border-[#E7D5CC] bg-[#FFFCFA] py-3 pl-11 pr-4 text-sm text-[#4A1F2A] outline-none focus:border-[#722F3E] focus:ring-2 focus:ring-[#722F3E]/10"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#4A1F2A]">
                    Description <span className="text-red-500">*</span>
                  </label>

                  <span className="text-xs text-[#B9A7A6]">
                    {formData.description.length}/1000
                  </span>
                </div>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your service, what makes it special, and what couples can expect..."
                  rows={5}
                  maxLength={1000}
                  required
                  className="w-full resize-none rounded-xl border border-[#E7D5CC] bg-[#FFFCFA] px-4 py-3 text-sm leading-6 text-[#4A1F2A] outline-none transition placeholder:text-[#B9A7A6] focus:border-[#722F3E] focus:ring-2 focus:ring-[#722F3E]/10"
                />
              </div>

              {/* Multiple Image Upload */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-[#4A1F2A]">
                      Service Images
                      <span className="ml-1 text-xs font-normal text-[#9B8588]">
                        (Optional)
                      </span>
                    </label>

                    <p className="mt-1 text-xs text-[#9B8588]">
                      Upload up to 4 images to showcase your service.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F3E7E2] px-3 py-1.5 text-xs font-semibold text-[#722F3E]">
                    {images.length}/4 Images
                  </span>
                </div>

                {/* Image Preview Grid */}
                {previews.length > 0 && (
                  <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {previews.map((preview, index) => (
                      <div
                        key={preview}
                        className="group relative overflow-hidden rounded-xl border border-[#E7D5CC] bg-[#FFFCFA]"
                      >
                        <div className="relative aspect-square">
                          <Image
                            src={preview}
                            alt={`Service image ${index + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            aria-label={`Remove image ${index + 1}`}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#722F3E] shadow-md transition hover:bg-[#722F3E] hover:text-white"
                          >
                            <X size={16} />
                          </button>

                          <span className="absolute bottom-2 left-2 rounded-md bg-[#4A1F2A]/85 px-2 py-1 text-[10px] font-semibold text-white">
                            {index === 0 ? "Main Image" : `Image ${index + 1}`}
                          </span>
                        </div>

                        <div className="truncate px-2 py-2 text-xs text-[#8B7478]">
                          {images[index]?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Input */}
                {images.length < MAX_IMAGES && (
                  <label
                    htmlFor="service-images"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DCC5BB] bg-[#FFFCFA] px-5 py-9 text-center transition hover:border-[#722F3E] hover:bg-[#FAF5F0]"
                  >
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E7E2] text-[#722F3E]">
                      <ImagePlus size={26} />
                    </div>

                    <p className="text-sm font-semibold text-[#4A1F2A]">
                      Click to upload service images
                    </p>

                    <p className="mt-2 text-xs text-[#9B8588]">
                      PNG, JPG or WEBP · Maximum 5MB per image
                    </p>

                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#722F3E] px-4 py-2.5 text-xs font-semibold text-white">
                      <UploadCloud size={15} />
                      Choose Images ({MAX_IMAGES - images.length} remaining)
                    </div>
                  </label>
                )}

                <input
                  id="service-images"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

                {images.length > 0 && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-[#4F7A46]">
                      {images.length} image(s) selected successfully.
                    </p>

                    <button
                      type="button"
                      onClick={handleRemoveAllImages}
                      className="text-xs font-semibold text-[#A65B6D] transition hover:text-[#722F3E]"
                    >
                      Remove all
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="border-t border-[#F0E7E1] pt-6">
                <button
                  type="submit"
                  disabled={loading || checkingLimit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#722F3E] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4A1F2A] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {images.length > 0
                        ? "Uploading Images & Submitting..."
                        : "Submitting..."}
                    </>
                  ) : (
                    <>
                      Submit Service
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <p className="mt-3 text-xs leading-5 text-[#9B8588]">
                  Your service will be submitted for admin approval before
                  becoming publicly visible.
                </p>
              </div>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="space-y-5">

            {/* Guidelines */}
            <div className="rounded-2xl border border-[#E7D5CC] bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3E7E2] text-[#722F3E]">
                <Sparkles size={22} />
              </div>

              <h3 className="text-lg font-semibold text-[#4A1F2A]">
                Listing Guidelines
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#9B8588]">
                Make your service stand out to couples planning their perfect
                wedding.
              </p>

              <div className="mt-5 space-y-4">
                {[
                  "Choose a clear and attractive service name.",
                  "Select the most relevant category.",
                  "Provide accurate pricing and location.",
                  "Upload high-quality service images.",
                  "Write a detailed and honest description.",
                ].map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#C6A15B]"
                    />
                    <p className="text-sm leading-5 text-[#6F565B]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Info */}
            <div className="rounded-2xl border border-[#E7D5CC] bg-[#722F3E] p-6 text-white">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={19} className="text-[#E7C98C]" />
                <h3 className="font-semibold">Approval Process</h3>
              </div>

              <p className="text-sm leading-6 text-white/75">
                Every new service is reviewed by our admin team. Your listing
                will remain pending until it is approved.
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E7C98C]" />
                <span className="text-xs font-medium text-white">
                  Default Status: Pending
                </span>
              </div>
            </div>

            {/* Plan Info */}
            <div className="rounded-2xl border border-[#E7D5CC] bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-[#4A1F2A]">
                Your Publishing Plan
              </h3>

              <div className="mt-4 rounded-xl bg-[#FAF5F0] p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[#9B8588]">
                  Current Plan
                </p>

                <p className="mt-2 text-xl font-bold text-[#722F3E]">
                  {isPremium ? "Premium Plan" : "Free Plan"}
                </p>

                <p className="mt-2 text-sm text-[#8B7478]">
                  {isPremium
                    ? "Publish unlimited active services."
                    : `${serviceCount}/3 services used. You can publish up to 3 services.`}
                </p>
              </div>

              {!isPremium && (
                <div className="mt-4">
                  <p className="text-xs leading-5 text-[#9B8588]">
                    Upgrade to Premium to publish unlimited services.
                  </p>

                  <Link
                    href="/vendor/subscription"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#C6A15B] px-4 py-3 text-sm font-semibold text-[#722F3E] transition hover:bg-[#FAF5F0]"
                  >
                    <Sparkles size={16} />
                    Explore Premium
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AddServicePage;
