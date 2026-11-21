
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const updateUserBlockStatus = async (
  userId: string,
  isBlocked: boolean
) => {
  const response = await fetch(`${API_URL}/users/${userId}/block`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    // Let the backend identify and authorize the admin performing the action.
    credentials: "include",
    body: JSON.stringify({
      isBlocked,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user status");
  }

  return result;
};
