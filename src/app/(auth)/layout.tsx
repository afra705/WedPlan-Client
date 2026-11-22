import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";


export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <>
  <Navbar/>
  {children}
  <Footer/>
  </>;
}
