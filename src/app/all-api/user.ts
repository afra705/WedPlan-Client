

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserStats = async (token: string) => {
  const response = await fetch(`${API_URL}/users/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user stats");
  }

  return response.json();
};
