import React from 'react';
import Navbar from './shared/Navbar';
import Banner from './shared/Banner';
import CategoriesSection from './categories/CategoriesSection';
import FeaturedServices from './featured-service/FeaturedServices';


// Keep the featured section fresh whenever services are approved or updated.
export const dynamic = "force-dynamic";

const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <Banner/>
     
      <FeaturedServices/>
 <CategoriesSection/>
    </div>
  );
};

export default HomePage;