export type Booking = {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;

  service?: {
    serviceName: string;
    image: string;
    vendorName: string;
    vendorEmail: string;
  };
};