import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>
    <Navbar/>
    { children }
    <Footer/>
  </div>;
}
