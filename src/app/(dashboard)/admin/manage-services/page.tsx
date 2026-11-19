
import { getServices } from "@/app/all-api/service";
import ManageServicesTable from "./ManageServicesTable";


const ManageServicesPage = async () => {
  let services = [];

  try {
    services = await getServices();
  } catch (error) {
    console.error("Failed to get services:", error);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#4A1F2A]">
          Manage Services
        </h2>

        <p className="mt-2 text-sm text-[#8B7478]">
          Review and moderate all service listings on the platform.
        </p>
      </div>

      {/* Services Table */}
      <ManageServicesTable services={services} />
    </div>
  );
};

export default ManageServicesPage;
