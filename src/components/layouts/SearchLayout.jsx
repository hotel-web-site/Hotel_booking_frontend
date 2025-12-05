import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import SearchFilterWrap from "../search/SearchFilterWrap";
import FilterSidebar from "../search/FilterSidebar";
import "./styles/SearchLayout.scss";

const MIN_PRICE = 50000;
const MAX_PRICE = 1200000;

const SearchLayout = () => {
  const [filters, setFilters] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: { rooms: 1, guests: 2 },
    // 💰 가격: [최소, 최대]
    priceRange: [MIN_PRICE, MAX_PRICE],
    // ⭐ 최소 평점
    rating: 0,
    // 🎁 무료옵션 / 🏊 어메니티
    freebies: [],
    amenities: [],
  });

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  return (
    <div className="search-layout">
      <Header />
      <div className="search-container">
        {/* 🔍 상단 검색바 */}
        <div className="search-top-bar">
          <SearchFilterWrap
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="search-content">
          {/* 🧭 왼쪽 필터 */}
          <aside className="search-sidebar">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* 🏨 오른쪽 메인 (SearchPage가 Outlet으로 들어옴) */}
          <main className="search-main">
            {/* 👉 여기서 filters를 SearchPage 쪽으로 전달 */}
            <Outlet context={{ filters }} />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchLayout;
