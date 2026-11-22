import React from 'react';
import Navbar from './shared/Navbar';
import Banner from './shared/Banner';
import CategoriesSection from './categories/CategoriesSection';
import FeaturedServices from './featured-service/FeaturedServices';
import ChooseUsSection from './choose-us.tsx/ChooseUsSection';
import Footer from './shared/Footer';


export const dynamic = "force-dynamic";

const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <Banner/>

      <FeaturedServices/>
      <CategoriesSection/>
      <ChooseUsSection/>
      <Footer/>
    </div>
  );
};

export default HomePage;