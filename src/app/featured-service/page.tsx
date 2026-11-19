import Navbar from "../shared/Navbar";
import FeaturedServices from "./FeaturedServices";

// Always fetch the latest approved services from the API.
export const dynamic = "force-dynamic";

const FeaturedServicesPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF5F0]">
      <Navbar />

      <main className="flex-1">
        <FeaturedServices />
      </main>
    </div>
  );
};

export default FeaturedServicesPage;
