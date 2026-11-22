
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  User,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  BriefcaseBusiness,
  X,
} from "lucide-react";

import type { Service } from "@/type/types";
import {
  updateServiceStatus,
  updateServiceAvailability,
} from "@/app/all-api/service";
import { toast } from "sonner";
import DeleteServices from "./DeleteServices";
import { getFilteredManageServices } from "@/app/all-api/filter";

type Props = {
  services: Service[];
};

const ManageServicesTable = ({ services: initialServices }: Props) => {
  const [services, setServices] = useState<Service[]>(initialServices);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [loading, setLoading] = useState(false);

  const [selectedService, setSelectedService] =
    useState<Service | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [availabilityUpdatingId, setAvailabilityUpdatingId] =
    useState<string | null>(null);

  const categories = Array.from(
    new Set(initialServices.map((service) => service.category).filter(Boolean))
  );

  // Fetch services from backend
  useEffect(() => {
    const fetchFilteredServices = async () => {
      try {
        setLoading(true);

        const data = await getFilteredManageServices(
          search,
          categoryFilter,
          statusFilter
        );

        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        toast.error("Failed to load services!");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFilteredServices();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, categoryFilter, statusFilter]);

  // Update Service Status (Admin)
  const handleStatusChange = async (
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => {
    const currentService = services.find(
      (service) => service._id === id
    );

    if (!currentService) {
      toast.error("Service not found or already deleted!");
      return;
    }

    if (updatingId === id) return;

    if (currentService.status === status) {
      toast.info(`This service is already ${status}!`);
      return;
    }

    try {
      setUpdatingId(id);

      await updateServiceStatus(id, status);

      toast.success(`Service ${status} successfully!`);

      const data = await getFilteredManageServices(
        search,
        categoryFilter,
        statusFilter
      );

      setServices(data);

      setSelectedService((previous) =>
        previous?._id === id
          ? { ...previous, status }
          : previous
      );
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update service status!");
    } finally {
      setUpdatingId(null);
    }
  };

  // Update Service Availability (Admin)
  const handleAvailabilityChange = async (
    service: Service
  ) => {
    const id = service._id;
    const newIsActive = service.isActive === false;

    if (service.status !== "approved") {
      toast.info("Only approved services can change availability!");
      return;
    }

    if (availabilityUpdatingId === id) return;

    try {
      setAvailabilityUpdatingId(id);

      await updateServiceAvailability(id, newIsActive);

      setServices((previousServices) =>
        previousServices.map((item) =>
          item._id === id
            ? { ...item, isActive: newIsActive }
            : item
        )
      );

      setSelectedService((previous) =>
        previous?._id === id
          ? { ...previous, isActive: newIsActive }
          : previous
      );

      toast.success(
        `Service ${newIsActive ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      console.error("Availability update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update service availability!"
      );
    } finally {
      setAvailabilityUpdatingId(null);
    }
  };

  // Statistics
  const pendingCount = services.filter(
    (service) => service.status === "pending"
  ).length;

  const approvedCount = services.filter(
    (service) => service.status === "approved"
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
            {approvedCount}
          </h3>
        </div>

      </div>

      {/* Manage Services Table */}
      <div className="rounded-2xl border border-[#F0E5E7] bg-white shadow-sm">

        {/* Header */}
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
              {services.length} Services
            </span>

          </div>

          {/* Search and Filters */}
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89599]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search service or vendor..."
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
        {loading ? (

          <div className="py-16 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#F0E5E7] border-t-[#8B354B]" />

            <p className="mt-3 text-sm text-[#8B7478]">
              Loading services...
            </p>
          </div>

        ) : services.length === 0 ? (

          <div className="py-16 text-center">
            <BriefcaseBusiness className="mx-auto h-12 w-12 text-[#C9B5BA]" />

            <h3 className="mt-3 font-semibold text-[#4A1F2A]">
              No Services Found
            </h3>

            <p className="mt-1 text-sm text-[#8B7478]">
              No services match your search or filters.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left">

              <thead>
                <tr className="border-b border-[#F0E5E7] bg-[#FCF9F9] text-xs uppercase tracking-wider text-[#8B7478]">
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Vendor</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Availability</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => {
                  const image = service.image || service.images?.[0];
                  const isActive = service.isActive !== false;
                  const isUpdatingAvailability =
                    availabilityUpdatingId === service._id;

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
                          ${Number(service.price || 0).toLocaleString()}
                        </p>
                      </td>

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

                      {/* Availability Toggle */}
                      <td className="px-5 py-4">
                        {service.status === "approved" ? (
                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              role="switch"
                              aria-checked={isActive}
                              aria-label={`Turn ${service.serviceName} ${
                                isActive ? "inactive" : "active"
                              }`}
                              title={isActive ? "Deactivate service" : "Activate service"}
                              disabled={isUpdatingAvailability}
                              onClick={() =>
                                handleAvailabilityChange(service)
                              }
                              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                                isActive
                                  ? "bg-green-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                  isActive
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>

                            <span
                              className={`text-xs font-semibold ${
                                isActive
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {isUpdatingAvailability
                                ? "Updating..."
                                : isActive
                                  ? "Active"
                                  : "Inactive"}
                            </span>

                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Approve first
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">

                          {/* View */}
                          <button
                            type="button"
                            title="View Service"
                            onClick={() => setSelectedService(service)}
                            className="rounded-lg border border-[#EDE1E4] p-2 text-[#8B354B] transition hover:bg-[#F8EDF0]"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Approve */}
                          <button
                            type="button"
                            title="Approve Service"
                            onClick={() =>
                              handleStatusChange(service._id, "approved")
                            }
                            disabled={
                              service.status === "approved" ||
                              updatingId === service._id
                            }
                            className="rounded-lg border border-green-100 p-2 text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <CheckCircle2 size={16} />
                          </button>

                          {/* Reject */}
                          <button
                            type="button"
                            title="Reject Service"
                            onClick={() =>
                              handleStatusChange(service._id, "rejected")
                            }
                            disabled={
                              service.status === "rejected" ||
                              updatingId === service._id
                            }
                            className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <XCircle size={16} />
                          </button>

                          {/* Delete */}
                          <DeleteServices
                            serviceId={service._id}
                            serviceName={service.serviceName}
                            onDeleted={(id) => {
                              setServices((previousServices) =>
                                previousServices.filter(
                                  (item) => item._id !== id
                                )
                              );

                              setSelectedService((previous) =>
                                previous?._id === id ? null : previous
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
            Showing {services.length} services
          </p>
        </div>

      </div>

      {/* View Service Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F0E5E7] px-6 py-4">
              <h2 className="text-xl font-bold text-[#4A1F2A]">
                Service Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="rounded-lg p-2 text-[#8B7478] transition hover:bg-[#F8EDF0]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[75vh] space-y-4 overflow-y-auto p-6">

              {/* Service Image */}
              <div className="relative h-52 w-full overflow-hidden rounded-xl bg-[#F8EDF0]">
                {(selectedService.image || selectedService.images?.[0]) ? (
                  <Image
                    src={
                      selectedService.image ||
                      selectedService.images?.[0] ||
                      ""
                    }
                    alt={selectedService.serviceName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#C9B5BA]">
                    <BriefcaseBusiness size={40} />
                  </div>
                )}
              </div>

              {/* Service Name & Description */}
              <div>
                <h3 className="text-xl font-bold text-[#4A1F2A]">
                  {selectedService.serviceName}
                </h3>

                <p className="mt-1 text-sm text-[#8B7478]">
                  {selectedService.description}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-[#FCF9F9] p-4">
                  <p className="text-xs text-[#8B7478]">Category</p>
                  <p className="mt-1 font-semibold text-[#4A1F2A]">
                    {selectedService.category}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FCF9F9] p-4">
                  <p className="text-xs text-[#8B7478]">Price</p>
                  <p className="mt-1 font-semibold text-[#4A1F2A]">
                    ${Number(selectedService.price || 0).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FCF9F9] p-4">
                  <p className="text-xs text-[#8B7478]">Vendor Name</p>
                  <p className="mt-1 font-semibold text-[#4A1F2A]">
                    {selectedService.vendorName || "Unknown"}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FCF9F9] p-4">
                  <p className="text-xs text-[#8B7478]">Vendor Email</p>
                  <p className="mt-1 break-all text-sm font-semibold text-[#4A1F2A]">
                    {selectedService.vendorEmail}
                  </p>
                </div>

              </div>

              {/* Status */}
              <div className="rounded-xl bg-[#FCF9F9] p-4">
                <p className="text-xs text-[#8B7478]">
                  Service Status
                </p>

                <p className="mt-1 font-semibold capitalize text-[#8B354B]">
                  {selectedService.status}
                </p>
              </div>

              {/* Availability */}
              <div className="rounded-xl bg-[#FCF9F9] p-4">
                <p className="text-xs text-[#8B7478]">
                  Service Availability
                </p>

                <p
                  className={`mt-1 font-semibold ${
                    selectedService.isActive === false
                      ? "text-gray-500"
                      : "text-green-600"
                  }`}
                >
                  {selectedService.isActive === false
                    ? "Inactive"
                    : "Active"}
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="border-t border-[#F0E5E7] p-5">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="w-full rounded-xl bg-[#4A1F2A] py-3 font-semibold text-white transition hover:bg-[#612A3A]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageServicesTable;
