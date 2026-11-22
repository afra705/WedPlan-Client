
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllTransactions = async (token: string) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Failed to fetch transactions: ${response.status}`
    );
  }

  return data.transactions;
};
