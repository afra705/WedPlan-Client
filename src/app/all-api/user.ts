const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserStats = async () => {
  const response = await fetch(`${API_URL}/users/stats`, {
    credentials: "include",
    cache: "no-store",
  });

  const result = await response.json();

  console.log("User Stats API Response:", result);

  if (!response.ok) {
    throw new Error(result.message || "Failed to get user stats");
  }

  return result as {
    totalVendors: number;
    totalCustomers: number;
  };
};