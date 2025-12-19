import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SearchFilterWrap from "../search/SearchFilterWrap";
import FilterSidebar from "../search/FilterSidebar";
import { getHotels, getHotelRooms } from "../../api/hotelClient";
import "./styles/SearchLayout.scss";

const MIN_PRICE = 50000;
const MAX_PRICE = 1200000;

const SearchLayout = () => {
  const [hotels, setHotels] = useState([]);

  // 초기 상태를 상수로 분리 (초기화 시 재사용)
  const initialFilterState = {
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: { adults: 2, children: 0, total: 2 }, // 데이터 구조 통일
    priceRange: [MIN_PRICE, MAX_PRICE],
    rating: 0,
    freebies: [],
    amenities: [],
    searchTrigger: 0,
  };

  const [filters, setFilters] = useState(initialFilterState);

  // 호텔 데이터 로드 로직 (기존 유지)
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await getHotels();
        const baseHotels = response?.list || [];

        const hotelsWithRooms = await Promise.all(
          baseHotels.map(async (hotel) => {
            const targetId = hotel.id || hotel._id;
            const rooms = await getHotelRooms(targetId);
            return { ...hotel, id: targetId, rooms };
          })
        );
        setHotels(hotelsWithRooms);
      } catch (err) {
        console.error("SearchLayout 데이터 로드 실패:", err);
      }
    };
    loadHotels();
  }, []);

  // 🔄 통합 필터 변경 핸들러
  const handleFilterChange = (filterName, value) => {
    if (filterName === "all") {
      // FilterSidebar의 초기화 버튼 대응
      setFilters({ ...initialFilterState, searchTrigger: filters.searchTrigger + 1 });
    } else {
      setFilters((prev) => ({ ...prev, [filterName]: value }));
    }
  };

  // 🔍 검색 버튼 클릭 시 (SearchFilterWrap에서 호출)
  const handleSearch = (searchData) => {
    setFilters((prev) => ({
      ...prev,
      ...searchData, // destination, checkIn, checkOut, guests 포함
      searchTrigger: prev.searchTrigger + 1,
    }));
  };

  return (
    <div className="search-layout">
      <div className="search-container">
        {/* 상단 검색바 구역 */}
        <div className="search-top-bar">
          <SearchFilterWrap
            filters={filters}
            hotels={hotels}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>

        {/* 하단 콘텐츠 구역 (사이드바 + 결과 리스트) */}
        <div className="search-content">
          <aside className="search-sidebar">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>
          <main className="search-main">
            {/* 💡 context를 통해 검색 조건과 호텔 원본 데이터를 하위 페이지(SearchPage 등)에 전달 */}
            <Outlet context={{ filters, hotels }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchLayout;