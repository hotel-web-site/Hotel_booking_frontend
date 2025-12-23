import React, { useEffect, useState, useMemo } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
// import HotelTypesTabs from "../../components/search/HotelTypesTabs";
// import HotelResultsHeader from "../../components/search/HotelResultsHeader";
// import HotelListCards from "../../components/search/HotelListCards";
import "../../styles/pages/search/SearchPage.scss";
import { getHotels, getHotelRooms } from "../../api/hotelClient";

const normalize = (s) => (s || "").toLowerCase().replace(/\s|-/g, "");


// import React from "react";
import HotelTypesTabs from "../../components/search/HotelTypesTabs";
import HotelResultsHeader from "../../components/search/HotelResultsHeader";
import HotelListCards from "../../components/search/HotelListCards";
import "../../styles/pages/search/SearchPage.scss";
import useSearchPage from "./hooks/useSearchPage";

const SearchPage = () => {
  const {
    isGuest,
    filters,
    hotels,
    filteredHotels,
    loading,
    sortType,
    setSortType,
    activeTab,
    setActiveTab,
  } = useSearchPage();

  return (
    <div className="search-page">
      <HotelTypesTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <HotelResultsHeader
        count={filteredHotels.length}
        sortType={sortType}
        setSortType={setSortType}
        isGuest={isGuest}
      />
      <HotelListCards hotels={filteredHotels} loading={loading} />
    </div>
  );
};

export default SearchPage;