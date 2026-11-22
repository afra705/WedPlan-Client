
import { getAuthHeaders, getJwtToken } from "@/lib/auth-client";
import { Service, ServiceData } from "@/type/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// POST - Add Service (Vendor)
export const addService = async (
  serviceData: ServiceData,
  token: string
) => {
  const response = await fetch(`${API_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add service");
  }

  return data;
};

// GET - All Approved Services (Public)
export const getServices = async (token?: string) => {
  const response = await fetch(`${API_URL}/services`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  return response.json();
};

// GET - Single Service (Public)
export const getServiceById = async (
  id: string
): Promise<Service> => {
  const response = await fetch(`${API_URL}/services/${id}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get service");
  }

  return result;
};

// PATCH - Update Service (Vendor)
export const updateService = async (
  id: string,
  updatedData: Partial<Service>
) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/services/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(updatedData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update service");
  }

  return result;
};

// DELETE - Delete Service (Vendor)
export const deleteService = async (id: string) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete service");
  }

  return result;
};

// PATCH - Approve / Reject Service (Admin)
export const updateServiceStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected"
) => {
 

  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/services/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ status }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update service status");
  }

  return result;
};

// PATCH - Update Service Availability (Admin)
export const updateServiceAvailability = async (
  id: string,
  isActive: boolean
) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/services/${id}/availability`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ isActive }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update service availability"
    );
  }

  return result;
};


// GET - My Services (Vendor)
// GET - My Services (Vendor)
export const getVendorServices = async (token: string) => {
  console.log("Token exists:", !!token);
  console.log("Token parts:", token.split(".").length);

  const response = await fetch(`${API_URL}/my-services`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch vendor services");
  }

  return data;
};