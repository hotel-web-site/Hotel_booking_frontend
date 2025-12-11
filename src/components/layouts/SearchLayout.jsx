// src/components/layouts/SearchLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import SearchFilterWrap from "../search/SearchFilterWrap";
import FilterSidebar from "../search/FilterSidebar";
import { getHotels, getHotelRooms } from "../../api/hotelClient";
import "./styles/SearchLayout.scss";

const MIN_PRICE = 50000;
const MAX_PRICE = 1200000;

const SearchLayout = () => {
  const [hotels, setHotels] = useState([]); // ⭐ rooms를 포함한 완전한 호텔 목록

  const [filters, setFilters] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: { rooms: 1, guests: 2 },
    priceRange: [MIN_PRICE, MAX_PRICE],
    rating: 0,
    freebies: [],
    amenities: [],
    searchTrigger: 0, // 검색 버튼 누를 때 강제 업데이트
  });

  /* -------------------------------------------------------
     🏨 1. SearchLayout에서도 rooms까지 포함된 호텔 정보 로드
     (SearchFilterWrap 날짜 필터, 자동완성에서 동일한 데이터를 사용하기 위함)
  ------------------------------------------------------- */
  useEffect(() => {
    const loadHotels = async () => {
      const baseHotels = await getHotels();

      const hotelsWithRooms = await Promise.all(
        baseHotels.map(async (hotel) => {
          const rooms = await getHotelRooms(hotel.id);
          return { ...hotel, rooms };
        })
      );

      setHotels(hotelsWithRooms);
    };

    loadHotels();
  }, []);

  /* -------------------------------------------------------
     ✔ 필터 값 업데이트
  ------------------------------------------------------- */
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  /* -------------------------------------------------------
     ✔ 검색 버튼 눌렀을 때만 searchTrigger 증가 → SearchPage에 알림
  ------------------------------------------------------- */
  const handleSearch = (searchData) => {
    setFilters((prev) => ({
      ...prev,
      ...searchData,
      searchTrigger: prev.searchTrigger + 1,
    }));
  };

  /* -------------------------------------------------------
     렌더
  ------------------------------------------------------- */
  return (
    <div className="search-layout">
      <div className="search-container">
        {/* 🔍 상단 검색바 */}
        <div className="search-top-bar">
          <SearchFilterWrap
            filters={filters}
            hotels={hotels}            // ⭐ 이제 rooms 포함 호텔 전달 → 날짜 필터 정상 동작
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>
        {/* 좌측 필터 + 우측 호텔 리스트 */}
        <div className="search-content">
          <aside className="search-sidebar">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>
          <main className="search-main">
            <Outlet context={{ filters }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchLayout;
