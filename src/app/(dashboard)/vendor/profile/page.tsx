/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  updateProfile,
  uploadProfileImage,
} from "@/app/all-api/profile";
import { toast } from "sonner";
import {
  Camera,
  Loader2,
  Save,
  UserRound,
} from "lucide-react";

const VendorProfilePage = () => {
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const previewUrlRef = useRef<string | null>(null);

  // Load current vendor information
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // Handle image selection
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image!");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB!");
      e.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);

    previewUrlRef.current = objectUrl;

    setSelectedFile(file);
    setPreview(objectUrl);
  };

  // Update vendor profile
  const handleUpdateProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required!");
      return;
    }

    try {
      setIsSaving(true);

      let updatedImage = image;

      // Upload image to ImgBB
      if (selectedFile) {
        updatedImage = await uploadProfileImage(selectedFile);
      }

      // Update Better Auth user
      await updateProfile({
        name: name.trim(),
        image: updatedImage,
      });

      setImage(updatedImage);
      setSelectedFile(null);
      setPreview("");

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }

      toast.success("Vendor profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile!"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A1F2A]" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-[#8B7478]">
        Please login to view your profile.
      </div>
    );
  }

  const displayImage = preview || image;

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#4A1F2A] sm:text-3xl">
            Profile Settings
          </h2>

          <p className="mt-2 text-sm text-[#8B7478]">
            Update your vendor profile information and account settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-[#EADDE0] bg-white p-6 shadow-sm sm:p-8">

          <form onSubmit={handleUpdateProfile}>

            {/* Profile Image */}
            <div className="mb-8 flex flex-col items-center text-center">

              <div className="relative">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Vendor Profile"
                    className="h-32 w-32 rounded-full border-4 border-[#F5E8EA] object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#F5E8EA] text-[#4A1F2A]">
                    <UserRound size={55} />
                  </div>
                )}

                <label
                  htmlFor="vendorProfileImage"
                  className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#4A1F2A] text-white shadow-md transition hover:bg-[#6A3443]"
                >
                  <Camera size={18} />

                  <input
                    id="vendorProfileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-[#4A1F2A]">
                Profile Picture
              </h3>

              <p className="mt-1 text-sm text-[#8B7478]">
                Upload your vendor profile image.
              </p>

              <p className="mt-1 text-xs text-[#A58D92]">
                JPG, PNG or WebP. Maximum 5MB.
              </p>
            </div>

            {/* Name */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-[#4A1F2A]">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-[#EADDE0] px-4 py-3 text-sm outline-none transition focus:border-[#4A1F2A] focus:ring-2 focus:ring-[#4A1F2A]/10"
              />
            </div>

            {/* Email */}
            <div className="mb-8">
              <label className="mb-2 block text-sm font-semibold text-[#4A1F2A]">
                Email Address
              </label>

              <input
                type="email"
                value={session.user.email || ""}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-[#EADDE0] bg-[#F9F5F5] px-4 py-3 text-sm text-[#8B7478] outline-none"
              />

              <p className="mt-2 text-xs text-[#A58D92]">
                Email address cannot be changed.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-center border-t border-[#F0E5E7] pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4A1F2A] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#6A3443] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;
