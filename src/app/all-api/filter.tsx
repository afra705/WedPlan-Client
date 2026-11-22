
import { getAuthHeaders } from "@/lib/auth-client";
import { Service } from "@/type/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET - Public Service Filtering
export const getFilteredServices = async (
  search: string,
  category: string,
  location: string,
  sort: string
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

  if (sort) {
    params.append("sort", sort);
  }

  const response = await fetch(
    `${API_URL}/services?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch filtered services");
  }

  return data;
};

// GET - Admin Manage Services
// GET - Admin Manage Services

// GET - Admin Manage Services

// GET - Admin Manage Services
export const getFilteredManageServices = async (
  search: string,
  category: string,
  status: string
) => {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (category !== "all") {
    params.append("category", category);
  }

  if (status !== "all") {
    params.append("status", status);
  }

  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/admin/services?${params.toString()}`,
    {
      headers: authHeaders,
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch manage services"
    );
  }

  return data;
};
