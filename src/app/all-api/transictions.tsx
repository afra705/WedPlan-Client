const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllTransactions = async () => {
  console.log("API URL:", API_URL);

  const response = await fetch(`${API_URL}/transactions`, {
    cache: "no-store",
  });

  console.log("Response Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.log("Backend Error:", errorText);

    throw new Error(
      `Failed to fetch transactions: ${response.status}`
    );
  }

  const data = await response.json();

  return data.transactions;
};