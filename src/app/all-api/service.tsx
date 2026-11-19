import { Service } from "@/type/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Add Service API
export const addService = async (serviceData: {
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
}) => {
  const response = await fetch(`${API_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(serviceData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add service");
  }

  return result;
};

// read


// Get All Services API
export const getServices = async () => {
  const response = await fetch(`${API_URL}/services`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get services");
  }

  return result;
};


// Get Single Service By ID
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

// Update service
export const updateService = async (
  id: string,
  updatedData: Partial<Service>
) => {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updatedData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update service");
  }

  return result;
};

// Delete service
export const deleteService = async (id: string) => {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete service");
  }

  return result;
};

export const updateServiceStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected"
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update service status");
  }

  return response.json();
};


// Get Vendor Services
export const getVendorServices = async (vendorId: string) => {
  const services = await getServices();

  return services.filter(
    (service: Service) => service.vendorId === vendorId
  );
};