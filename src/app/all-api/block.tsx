
import { authClient } from "@/lib/auth-client";

export const updateUserBlockStatus = async (
  userId: string,
  isBlocked: boolean
) => {
  if (isBlocked) {
    const { data, error } = await authClient.admin.banUser({
      userId,
      banReason: "Blocked by administrator",
    });

    if (error) {
      throw new Error(error.message || "Failed to block user");
    }

    return data;
  }

  const { data, error } = await authClient.admin.unbanUser({
    userId,
  });

  if (error) {
    throw new Error(error.message || "Failed to unblock user");
  }

  return data;
};
