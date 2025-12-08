// src/pages/search/SearchPage.jsx
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import HotelTypesTabs from "../../components/search/HotelTypesTabs";
import HotelResultsHeader from "../../components/search/HotelResultsHeader";
import HotelListCards from "../../components/search/HotelListCards";
import "../../styles/pages/search/SearchPage.scss";
import { getHotels, getHotelRooms } from "../../api/hotelClient";

// 문자열 정규화: 소문자 + 공백/하이픈 제거
const normalize = (s) =>
  (s || "").toLowerCase().replace(/\s|-/g, "");

const SearchPage = () => {
  // 🔗 SearchLayout 에서 내려준 filters
  const outletContext = useOutletContext();
  const filters = outletContext?.filters || {
    destination: "",
    priceRange: null,
    rating: 0,
    freebies: [],
    amenities: [],
  };

  const [hotels, setHotels] = useState([]);          // 전체 호텔
  const [filteredHotels, setFilteredHotels] = useState([]); // 필터 적용 호텔
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------------------
     1) mock 호텔 + 객실 정보 불러오기
  ---------------------------------------------------- */
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const baseHotels = await getHotels(); // mockHotels

        const hotelsWithRooms = await Promise.all(
          baseHotels.map(async (hotel) => {
            const rooms = await getHotelRooms(hotel.id); // mockRooms[hotel.id]
            return { ...hotel, rooms };
          })
        );

        setHotels(hotelsWithRooms);
        setFilteredHotels(hotelsWithRooms); // 처음엔 전체 노출
      } catch (err) {
        console.error("호텔 목록 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  /* ----------------------------------------------------
     2) filters / hotels 변경될 때마다 리스트 필터링
  ---------------------------------------------------- */
  useEffect(() => {
    let result = [...hotels];

    if (!filters) {
      setFilteredHotels(result);
      return;
    }

    /* -------- 🧭 목적지 (이름/위치에 포함) -------- */
    if (filters.destination && filters.destination.trim() !== "") {
      const dest = filters.destination.trim();
      result = result.filter(
        (hotel) =>
          hotel.name?.includes(dest) || hotel.location?.includes(dest)
      );
    }

    /* -------- 💰 가격 범위 [min, max] -------- */
    if (Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      result = result.filter((hotel) => {
        // 호텔 price 우선, 없으면 첫 번째 객실 price 사용
        const price =
          hotel.price ??
          (hotel.rooms && hotel.rooms[0] && hotel.rooms[0].price) ??
          0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    /* -------- ⭐ 최소 평점 (ratingAverage 기준) -------- */
    let ratingMin = 0;
    if (typeof filters.rating === "number") ratingMin = filters.rating;

    if (ratingMin > 0) {
      result = result.filter(
        (hotel) =>
          (hotel.ratingAverage || hotel.rating || 0) >= ratingMin
      );
    }

    /* -------- 🎁 Freebies (조식/무료주차/WiFi/공항셔틀/무료취소) -------- */
    if (filters.freebies && filters.freebies.length > 0) {
      const freebieKeys = Array.isArray(filters.freebies)
        ? filters.freebies
        : [filters.freebies];

      result = result.filter((hotel) =>
        freebieKeys.every((freebieKey) => {
          const key = freebieKey.toLowerCase(); // "조식포함", "wifi", ...

          const inTags = hotel.tags?.some((tag) =>
            normalize(tag).includes(key)
          );

          const inAmenities = hotel.amenities?.some((a) =>
            normalize(a).includes(key)
          );

          const inRooms = hotel.rooms?.some((room) =>
            room.features?.some((f) => normalize(f).includes(key))
          );

          return inTags || inAmenities || inRooms;
        })
      );
    }

    /* -------- 🏊 Amenities (에어컨 / Gym / Pool 등) -------- */
    if (filters.amenities && filters.amenities.length > 0) {
      const amenityKeysRaw = filters.amenities;
      const amenityKeys = Array.isArray(amenityKeysRaw)
        ? amenityKeysRaw
        : [amenityKeysRaw];

      result = result.filter((hotel) =>
        amenityKeys.every((amenity) => {
          if (!amenity) return true;

          const key = normalize(amenity); // "Pool" -> "pool", "에어컨" 그대로

          // 호텔 레벨 amenities (예: "Pool", "Free Wi-Fi", "Gym"...)
          const inHotelAmenities = hotel.amenities?.some((a) =>
            normalize(a).includes(key)
          );

          // 객실 레벨 amenities (예: "에어컨", "WiFi"...)
          const inRoomAmenities = hotel.rooms?.some((room) =>
            room.amenities?.some((a) => normalize(a).includes(key))
          );

          // 혹시 태그에도 있을 수 있으니 한 번 더 체크
          const inTags = hotel.tags?.some((tag) =>
            normalize(tag).includes(key)
          );

          return inHotelAmenities || inRoomAmenities || inTags;
        })
      );
    }

    setFilteredHotels(result);
  }, [hotels, filters]);

  /* ----------------------------------------------------
     3) 렌더
  ---------------------------------------------------- */
  if (loading) {
    return <div className="search-page">호텔을 불러오는 중입니다...</div>;
  }

  return (
    <div className="search-page">
      <HotelTypesTabs />
      <HotelResultsHeader
        totalCount={hotels.length}          // 전체 개수
        showingCount={filteredHotels.length} // 필터 후 개수
      />
      <HotelListCards hotels={filteredHotels} />
    </div>
  );
};

export default SearchPage;
