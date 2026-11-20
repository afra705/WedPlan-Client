
import { authClient } from "@/lib/auth-client";

interface ProfileData {
  name: string;
  image: string;
}

// Upload image to ImgBB
export const uploadProfileImage = async (
  file: File
): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key is missing");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error("Image upload failed");
  }

  return result.data.display_url;
};

// Update authenticated user's profile
export const updateProfile = async (
  data: ProfileData
) => {
  const { error } = await authClient.updateUser({
    name: data.name,
    image: data.image,
  });

  if (error) {
    throw new Error(error.message || "Profile update failed");
  }

  return true;
};
