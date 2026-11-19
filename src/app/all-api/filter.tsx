
import { Service } from "@/type/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get services with search and filters
export const getFilteredServices = async (
  search: string,
  category: string,
  location: string
): Promise<Service[]> => {

  const params = new URLSearchParams();

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (category !== "all") {
    params.append("category", category);
  }

  if (location !== "all") {
    params.append("location", location);
  }

  const response = await fetch(
    `${API_URL}/services?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch filtered services");
  }

  const data: Service[] = await response.json();

  return data;
};
