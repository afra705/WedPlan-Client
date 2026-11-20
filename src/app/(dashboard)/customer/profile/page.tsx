/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useState } from "react";
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

const CustomerProfilePage = () => {
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load current user information
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  // Generate image preview
  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB!");
      return;
    }

    setSelectedFile(file);
  };

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

      // Upload new image to ImgBB
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

      toast.success("Profile updated successfully!");
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
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4A1F2A]" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="py-10 text-center text-[#8B7478]">
        Please login to view your profile.
      </div>
    );
  }

  const displayImage = preview || image;

  return (
    <div className="min-h-screen ">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#4A1F2A]">
          Profile Settings
        </h2>

        <p className="mt-2 text-sm text-[#8B7478]">
          Update your personal information and account settings.
        </p>
      </div>

      <div className="max-w-3xl rounded-2xl border border-[#EADDE0] bg-white p-6 shadow-sm sm:p-8">

        <form onSubmit={handleUpdateProfile}>

          {/* Profile Image */}
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">

            <div className="relative">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="Profile"
                  className="h-28 w-28 rounded-full border-4 border-[#F5E8EA] object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#F5E8EA] text-[#4A1F2A]">
                  <UserRound size={48} />
                </div>
              )}

              <label
                htmlFor="profileImage"
                className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#4A1F2A] text-white shadow-md hover:bg-[#6A3443]"
              >
                <Camera size={17} />

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#4A1F2A]">
                Profile Picture
              </h3>

              <p className="mt-1 text-sm text-[#8B7478]">
                Upload a new profile image.
              </p>

              <p className="mt-1 text-xs text-[#A58D92]">
                JPG, PNG or WebP. Maximum 5MB.
              </p>
            </div>
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
              className="w-full rounded-lg border border-[#EADDE0] px-4 py-3 text-sm outline-none transition focus:border-[#4A1F2A] focus:ring-2 focus:ring-[#4A1F2A]/10"
              required
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
          <div className="flex justify-end border-t border-[#F0E5E7] pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-[#4A1F2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6A3443] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
