
import { getCurrentUser, getServerToken } from "@/app/all-api/get-current-user";
import { getServices } from "@/app/all-api/service";
import { getDashboardPath, isAdmin } from "@/lib/roles";
import { redirect } from "next/navigation";
import ManageServicesTable from "./ManageServicesTable";


const ManageServicesPage = async () => {
 const user = await getCurrentUser();

if (!user) {
  redirect("/sign-in");
}

if (!isAdmin(user)) {
  redirect(getDashboardPath(user));
}

let services = [];

try {
  const token = await getServerToken();

  services = await getServices(token);
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
