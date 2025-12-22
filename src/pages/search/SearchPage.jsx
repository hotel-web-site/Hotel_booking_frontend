import React, { useEffect, useState, useMemo } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import HotelTypesTabs from "../../components/search/HotelTypesTabs";
import HotelResultsHeader from "../../components/search/HotelResultsHeader";
import HotelListCards from "../../components/search/HotelListCards";
import "../../styles/pages/search/SearchPage.scss";
import { getHotels, getHotelRooms } from "../../api/hotelClient";

const normalize = (s) => (s || "").toLowerCase().replace(/\s|-/g, "");

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get("guest") === "1";

  const context = useOutletContext();
  const filters = context?.filters || {};

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("추천순");

  // ⭐ 탭 상태 추가 (기본값: 호텔)
  const [activeTab, setActiveTab] = useState("hotels");

  /* 1. 데이터 로드 */
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await getHotels();
        const baseHotels = response?.list || [];

        const hotelsWithRooms = await Promise.all(
          baseHotels.map(async (hotel) => {
            const targetId = hotel.id || hotel._id;
            const rooms = await getHotelRooms(targetId);

            const minRoomPrice = rooms.length > 0
              ? Math.min(...rooms.map(r => r.price || 0))
              : hotel.price || 0;

            return {
              ...hotel,
              id: targetId,
              rooms,
              displayPrice: minRoomPrice
            };
          })
        );

        setHotels(hotelsWithRooms);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  /* 2. 통합 필터링 로직 */
  useEffect(() => {
    let result = [...hotels];

    // 🔥 [추가] 탭(호텔 유형) 필터링
    result = result.filter((h) => {
      const type = h.type || h.category || "";
      if (activeTab === "hotels") return type === "호텔" || type === "hotel";
      if (activeTab === "motels") return type === "모텔" || type === "motel";
      if (activeTab === "resorts") return type === "리조트" || type === "resort";
      return true;
    });

    if (filters) {
      // (1) 목적지/호텔명 검색
      if (filters.destination) {
        const term = normalize(filters.destination);
        result = result.filter((h) => normalize(h.name).includes(term));
      }

      // (2) 가격 범위 필터
      if (filters.priceRange && Array.isArray(filters.priceRange)) {
        const [min, max] = filters.priceRange;
        result = result.filter((h) => h.displayPrice >= min && h.displayPrice <= max);
      }

      // (3) 평점 필터
      if (filters.rating > 0) {
        result = result.filter((h) => (h.ratingAverage || 0) >= filters.rating);
      }

      // (4) 통합 어메니티 필터
      const selectedOptions = [
        ...(filters.freebies || []),
        ...(filters.amenities || [])
      ];

      if (selectedOptions.length > 0) {
        result = result.filter((h) => {
          const hotelAmenities = Array.isArray(h.amenities) ? h.amenities : [];
          return selectedOptions.every(opt => hotelAmenities.includes(opt));
        });
      }
    }

    setFilteredHotels(applySorting(result, sortType));
  }, [hotels, filters, sortType, activeTab]); // ⭐ activeTab이 바뀔 때도 실행되도록 의존성 추가

  const applySorting = (list, type) => {
    const sorted = [...list];
    switch (type) {
      case "가격 낮은순": return sorted.sort((a, b) => a.displayPrice - b.displayPrice);
      case "가격 높은순": return sorted.sort((a, b) => b.displayPrice - a.displayPrice);
      case "평점순": return sorted.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
      default: return sorted;
    }
  };

  if (loading) return <div className="search-page">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="search-page">
      {/* ⭐ 상태값과 변경 함수를 탭 컴포넌트에 전달 */}
      <HotelTypesTabs
        hotels={hotels}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <HotelResultsHeader
        total={hotels.length}
        showing={filteredHotels.length}
        onSort={(type) => setSortType(type)}
      />

      <HotelListCards
        hotels={filteredHotels}
        filters={filters}
        isGuest={isGuest}
      />
    </div>
  );
};

export default SearchPage;