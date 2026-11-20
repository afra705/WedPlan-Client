import Navbar from "../shared/Navbar";
import ChooseUsSection from "./ChooseUsSection";

const ChooseUsPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF5F0]">
      <Navbar />

      <main>
        <ChooseUsSection />
      </main>
    </div>
  );
};

export default ChooseUsPage;
