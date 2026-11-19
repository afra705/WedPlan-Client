import { getServices } from "@/app/all-api/service";
import type { Service } from "@/type/types";
import BrowseServicesClient from "./BrowseServicesClient";


const BrowseServicesPage = async () => {
  const allServices: Service[] = await getServices();

  const approvedServices = allServices.filter(
    (service) => service.status === "approved"
  );

  return <BrowseServicesClient services={approvedServices} />;
};

export default BrowseServicesPage;