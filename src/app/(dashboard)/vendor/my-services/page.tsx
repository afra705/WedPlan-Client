
"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import {
  Plus,
  MapPin,
  Loader2,
  BriefcaseBusiness,
  Pencil,
  Trash2,
  X,
  Save,
  AlertTriangle,
  ImagePlus,
} from "lucide-react";
import { toast } from "sonner";

import {
  getServices,
  updateService,
  deleteService,

} from "@/app/all-api/service";

import type { Service } from "@/type/types";
import { uploadServiceImage } from "@/app/all-api/imgbb";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
];

const MyServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Update modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [updating, setUpdating] = useState(false);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Image file
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
    image: "",
  });

  // Load services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load services"
        );
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Select image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  // Open edit modal
  const handleEdit = (service: Service) => {
    setSelectedService(service);

    setFormData({
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: String(service.price),
      location: service.location,
      image: service.image || "",
    });

    setImageFile(null);
    setIsEditModalOpen(true);
  };

  // Update service
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedService) return;

    if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    try {
      setUpdating(true);

    
      let imageUrl = formData.image;

      // Upload new image to ImgBB
      if (imageFile) {
        toast.info("Uploading image...");

        imageUrl = await uploadServiceImage(imageFile);
      }

      const updatedData = {
        serviceName: formData.serviceName.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: Number(formData.price),
        location: formData.location.trim(),
        image: imageUrl,
      };

      // Update MongoDB
      await updateService(selectedService._id, updatedData);

      // Update UI
      setServices((previous) =>
        previous.map((service) =>
          service._id === selectedService._id
            ? { ...service, ...updatedData }
            : service
        )
      );

      toast.success("Service updated successfully!");

      setIsEditModalOpen(false);
      setSelectedService(null);
      setImageFile(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update service"
      );
    } finally {
      setUpdating(false);
    }
  };

  // Open delete modal
  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  // Delete service
  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      setDeletingId(selectedService._id);

      await deleteService(selectedService._id);

      setServices((previous) =>
        previous.filter((service) => service._id !== selectedService._id)
      );

      toast.success("Service deleted successfully!");

      setIsDeleteModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F0] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#4A1F2A] sm:text-3xl">
              My Services
            </h1>
            <p className="mt-2 text-sm text-[#8B7478]">
              Manage and update your wedding services
            </p>
          </div>

          <Link
            href="/vendor/add-service"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#722F3E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4A1F2A]"
          >
            <Plus size={18} />
            Add New Service
          </Link>
        </div>

        {/* Service Count */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#E7D5CC] bg-white p-5">
          <div className="rounded-lg bg-[#F5E4D8] p-3 text-[#722F3E]">
            <BriefcaseBusiness size={24} />
          </div>

          <div>
            <p className="text-sm text-[#8B7478]">Total Services</p>
            <h2 className="text-2xl font-bold text-[#4A1F2A]">
              {services.length}
            </h2>
          </div>
        </div>

        {/* Services Table */}
        <div className="overflow-hidden rounded-xl border border-[#E7D5CC] bg-white">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2 className="animate-spin text-[#722F3E]" size={32} />
            </div>
          ) : services.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-4 text-center">
              <BriefcaseBusiness size={45} className="mb-4 text-[#C6A15B]" />

              <h3 className="text-xl font-semibold text-[#4A1F2A]">
                No Services Found
              </h3>

              <p className="mt-2 text-sm text-[#8B7478]">
                You haven&apos;t added any services yet.
              </p>

              <Link
                href="/vendor/add-service"
                className="mt-5 rounded-lg bg-[#722F3E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4A1F2A]"
              >
                Add Your First Service
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-[#F5E4D8] text-sm text-[#4A1F2A]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Service</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Location</th>
                    <th className="px-5 py-4 font-semibold">Price</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E7D5CC]">
                  {services.map((service) => (
                    <tr key={service._id} className="hover:bg-[#FAF5F0]">

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.serviceName}
                              className="h-14 w-14 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#F5E4D8] text-[#722F3E]">
                              <BriefcaseBusiness size={22} />
                            </div>
                          )}

                          <div className="max-w-48">
                            <h3 className="font-semibold text-[#4A1F2A]">
                              {service.serviceName}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-xs text-[#8B7478]">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#8B7478]">
                        {service.category}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-sm text-[#8B7478]">
                          <MapPin size={15} />
                          {service.location}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-[#4A1F2A]">
                        ৳{Number(service.price).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            service.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : service.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {service.status || "Pending"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5E4D8] px-3 py-2 text-xs font-semibold text-[#722F3E] transition hover:bg-[#E7D5CC]"
                          >
                            <Pencil size={14} />
                            Update
                          </button>

                          <button
                            onClick={() => handleDeleteClick(service)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#E7D5CC] p-5">
              <div>
                <h2 className="text-xl font-bold text-[#4A1F2A]">
                  Update Service
                </h2>
                <p className="mt-1 text-sm text-[#8B7478]">
                  Edit your service information
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setImageFile(null);
                }}
                className="rounded-lg p-2 text-[#8B7478] transition hover:bg-[#FAF5F0]"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 p-5">

              {/* Service Name */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#4A1F2A]">
                  Service Name
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#E7D5CC] px-4 py-3 text-sm outline-none focus:border-[#722F3E]"
                  placeholder="Enter service name"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#4A1F2A]">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#E7D5CC] px-4 py-3 text-sm outline-none focus:border-[#722F3E]"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#4A1F2A]">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-[#E7D5CC] px-4 py-3 text-sm outline-none focus:border-[#722F3E]"
                  placeholder="Describe your service"
                />
              </div>

              {/* Price and Location */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#4A1F2A]">
                    Price (৳)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full rounded-lg border border-[#E7D5CC] px-4 py-3 text-sm outline-none focus:border-[#722F3E]"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#4A1F2A]">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-[#E7D5CC] px-4 py-3 text-sm outline-none focus:border-[#722F3E]"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              {/* ImgBB Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4A1F2A]">
                  Service Image
                </label>

                {/* Current / New Image Preview */}
                {(imageFile || formData.image) && (
                  <div className="mb-3">
                    <img
                      src={
                        imageFile
                          ? URL.createObjectURL(imageFile)
                          : formData.image
                      }
                      alt="Service preview"
                      className="h-44 w-full rounded-xl border border-[#E7D5CC] object-cover"
                    />
                  </div>
                )}

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E7D5CC] bg-[#FAF5F0] p-6 text-center transition hover:border-[#722F3E]">
                  <ImagePlus size={30} className="mb-2 text-[#722F3E]" />

                  <span className="text-sm font-semibold text-[#4A1F2A]">
                    {imageFile ? imageFile.name : "Choose a new image"}
                  </span>

                  <span className="mt-1 text-xs text-[#8B7478]">
                    JPG, PNG or WEBP (Maximum 5MB)
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 text-xs text-[#8B7478]">
                  Leave empty to keep the existing image.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#E7D5CC] pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setImageFile(null);
                  }}
                  disabled={updating}
                  className="rounded-lg border border-[#E7D5CC] px-5 py-3 text-sm font-semibold text-[#4A1F2A] hover:bg-[#FAF5F0]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#722F3E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4A1F2A] disabled:opacity-60"
                >
                  {updating ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  {updating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={32} />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-[#4A1F2A]">
                Delete Service?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8B7478]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#722F3E]">
                  {selectedService?.serviceName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedService(null);
                }}
                disabled={deletingId !== null}
                className="flex-1 rounded-lg border border-[#E7D5CC] px-4 py-3 text-sm font-semibold text-[#4A1F2A] transition hover:bg-[#FAF5F0]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId !== null ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Trash2 size={17} />
                )}
                {deletingId !== null ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyServicesPage;
