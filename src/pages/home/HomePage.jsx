import React from "react";
import HeroSection from "../../components/home/HeroSection";
import PopularDestinations from "../../components/home/PopularDestinations";
import TravelMore from "../../components/home/TravelMore";
import HeroSearchWrap from "../../components/home/HeroSearchWrap";
import "../../styles/pages/home/HomePage.scss";

const HomePage = () => {
  return (
    <div className="home-page top-container">
      <HeroSection />
      <div className="homepage-container">
        <HeroSearchWrap />
        <PopularDestinations />
        <TravelMore />
      </div>
    </div>
  );
};

export default HomePage;