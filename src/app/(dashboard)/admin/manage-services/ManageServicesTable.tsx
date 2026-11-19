"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Filter,

  User,

  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  BriefcaseBusiness,
} from "lucide-react";

import type { Service } from "@/type/types";
import { updateServiceStatus } from "@/app/all-api/service";
import { toast } from "sonner";
import DeleteServices from "./DeleteServices";

type Props = {
  services: Service[];
};

const ManageServicesTable = ({ services: initialServices }: Props) => {
  const [services, setServices] = useState(initialServices);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

 const handleStatusChange = async (
  id: string,
  status: "pending" | "approved" | "rejected",
) => {
  // Check current service status
  const currentService = services.find(
    (service) => service._id === id,
  );

  if (!currentService) {
    toast.error("Service not found or already deleted!");
    return;
  }

  // Prevent double click while updating
  if (updatingId === id) {
    return;
  }

  // Check if status is already the same
  if (currentService.status === status) {
    toast.info(`This service is already ${status}!`);
    return;
  }

  try {
    setUpdatingId(id);

    await updateServiceStatus(id, status);

    setServices((previousServices) =>
      previousServices.map((service) =>
        service._id === id ? { ...service, status } : service,
      ),
    );

    toast.success(`Service ${status} successfully!`);
  } catch (error) {
    console.error("Status update error:", error);
    toast.error("Failed to update service status!");
  } finally {
    setUpdatingId(null);
  }
};

  // Search and filter services
  const filteredServices = services.filter((service) => {
    const searchMatch =
      service.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      service.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      service.vendorEmail.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "all" || service.status === statusFilter;

    const categoryMatch =
      categoryFilter === "all" || service.category === categoryFilter;

    return searchMatch && statusMatch && categoryMatch;
  });

  const categories = Array.from(
    new Set(services.map((service) => service.category)),
  );

  const pendingCount = services.filter(
    (service) => service.status === "pending",
  ).length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#F0E5E7] bg-white p-5">
          <p className="text-sm text-[#8B7478]">Total Services</p>
          <h3 className="mt-2 text-2xl font-bold text-[#4A1F2A]">
            {services.length}
          </h3>
        </div>

        <div className="rounded-xl border border-[#F0E5E7] bg-white p-5">
          <p className="text-sm text-[#8B7478]">Pending Review</p>
          <h3 className="mt-2 text-2xl font-bold text-orange-500">
            {pendingCount}
          </h3>
        </div>

        <div className="rounded-xl border border-[#F0E5E7] bg-white p-5">
          <p className="text-sm text-[#8B7478]">Approved Services</p>
          <h3 className="mt-2 text-2xl font-bold text-green-600">
            {services.filter((service) => service.status === "approved").length}
          </h3>
        </div>
      </div>

      {/* View All Submitted Services */}
      <div className="rounded-2xl border border-[#F0E5E7] bg-white shadow-sm">
        <div className="border-b border-[#F0E5E7] p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold text-[#4A1F2A]">
                View All Submitted Services
              </h3>

              <p className="mt-1 text-sm text-[#8B7478]">
                Manage and review services submitted by vendors.
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#F8EDF0] px-4 py-2 text-sm font-semibold text-[#8B354B]">
              {filteredServices.length} Services
            </span>
          </div>

          {/* Search and Filter - UI */}
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* Search */}
            <div className="relative md:col-span-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89599]"
              />

              <input
                type="text"
                placeholder="Search service or vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#EDE1E4] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#A65B6D]"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89599]"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#EDE1E4] bg-white py-3 pl-10 pr-4 text-sm text-[#6B5157] outline-none focus:border-[#A65B6D]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-[#EDE1E4] bg-white px-4 py-3 text-sm text-[#6B5157] outline-none focus:border-[#A65B6D]"
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredServices.length === 0 ? (
          <div className="py-16 text-center">
            <BriefcaseBusiness className="mx-auto h-12 w-12 text-[#C9B5BA]" />

            <h3 className="mt-3 font-semibold text-[#4A1F2A]">
              No Services Found
            </h3>

            <p className="mt-1 text-sm text-[#8B7478]">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-[#F0E5E7] bg-[#FCF9F9] text-xs uppercase tracking-wider text-[#8B7478]">
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Vendor</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  {/* <th className="px-5 py-4">Date</th> */}
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredServices.map((service) => {
                  const image = service.image || service.images?.[0];

                  return (
                    <tr
                      key={service._id}
                      className="border-b border-[#F5ECEE] transition hover:bg-[#FDF9FA]"
                    >
                      {/* Service */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F8EDF0]">
                            {image ? (
                              <Image
                                src={image}
                                alt={service.serviceName}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <BriefcaseBusiness className="m-auto mt-4 h-6 w-6 text-[#C9B5BA]" />
                            )}
                          </div>

                          <div className="max-w-[180px]">
                            <p className="font-semibold text-[#4A1F2A]">
                              {service.serviceName}
                            </p>

                            <p className="mt-1 line-clamp-1 text-xs text-[#8B7478]">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Vendor */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-[#A65B6D]" />

                          <div>
                            <p className="text-sm font-medium text-[#4A1F2A]">
                              {service.vendorName || "Unknown"}
                            </p>

                            <p className="text-xs text-[#8B7478]">
                              {service.vendorEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-[#F8EDF0] px-3 py-1.5 text-xs font-medium text-[#8B354B]">
                          {service.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#4A1F2A]">
                          ${service.price.toLocaleString()}
                        </p>
                      </td>

                      {/* Date */}
                      {/* <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#8B7478]">
                          <CalendarDays size={15} />

                          {new Date(service.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </div>
                      </td> */}

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                            service.status === "approved"
                              ? "bg-green-50 text-green-700"
                              : service.status === "rejected"
                                ? "bg-red-50 text-red-600"
                                : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {service.status === "approved" ? (
                            <CheckCircle2 size={14} />
                          ) : service.status === "rejected" ? (
                            <XCircle size={14} />
                          ) : (
                            <Clock size={14} />
                          )}

                          {service.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            title="View Service"
                            className="rounded-lg border border-[#EDE1E4] p-2 text-[#8B354B] opacity-1000"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Approve Service"
                            onClick={() =>
                              handleStatusChange(service._id, "approved")
                            }
                            disabled={service.status === "approved"}
                            className="rounded-lg border border-green-100 p-2 text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-1000"
                          >
                            <CheckCircle2 size={16} />
                          </button>

                          <button
                            type="button"
                            title="Reject Service"
                            onClick={() =>
                              handleStatusChange(service._id, "rejected")
                            }
                            disabled={service.status === "rejected"}
                            className="rounded-lg border border-red-100 p-2 text-red-500 opacity-1000"
                          >
                            <XCircle size={16} />
                          </button>

                          <DeleteServices
                                serviceId={service._id}
                                serviceName={service.serviceName}
                                onDeleted={(id) => {
                                    setServices((previousServices) =>
                                    previousServices.filter(
                                        (item) => item._id !== id
                                    )
                                    );
                                }}
                                />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[#F0E5E7] px-5 py-4">
          <p className="text-xs text-[#8B7478]">
            Showing {filteredServices.length} of {services.length} services
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageServicesTable;
