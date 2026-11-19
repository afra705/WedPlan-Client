import { getServices } from "@/app/all-api/service";
import type { Service } from "@/type/types";
import BrowseServicesClient from "./BrowseServicesClient";

type Props = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

const BrowseServicesPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  // The categories page links here with ?category=Wedding+Venues.
  const initialCategory =
    typeof params.category === "string" ? params.category : "all";

  const allServices: Service[] = await getServices();

  const approvedServices = allServices.filter(
    (service) => service.status === "approved"
  );

  return (
    <BrowseServicesClient
      key={initialCategory}
      services={approvedServices}
      initialCategory={initialCategory}
    />
  );
};

export default BrowseServicesPage;
