// src/pages/search/SearchPage.jsx
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import HotelTypesTabs from "../../components/search/HotelTypesTabs";
import HotelResultsHeader from "../../components/search/HotelResultsHeader";
import HotelListCards from "../../components/search/HotelListCards";
import "../../styles/pages/search/SearchPage.scss";
import { getHotels, getHotelRooms } from "../../api/hotelClient";

// 문자열 정규화
const normalize = (s) => (s || "").toLowerCase().replace(/\s|-/g, "");

const SearchPage = () => {
  const { filters } = useOutletContext() || {
    destination: "",
    priceRange: null,
    rating: 0,
    freebies: [],
    amenities: [],
    guests: { rooms: 1, guests: 2 },
  };

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ 정렬 상태
  const [sortType, setSortType] = useState("추천순");

  /* ----------------------------------------------------
     1) 호텔 + 객실 정보 불러오기
  ---------------------------------------------------- */
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const baseHotels = await getHotels();

        const hotelsWithRooms = await Promise.all(
          baseHotels.map(async (hotel) => {
            const rooms = await getHotelRooms(hotel.id);
            return { ...hotel, rooms };
          })
        );

        setHotels(hotelsWithRooms);
        setFilteredHotels(hotelsWithRooms);
      } catch (err) {
        console.error("호텔 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  /* ----------------------------------------------------
     ⭐ 정렬 함수
  ---------------------------------------------------- */
  const applySorting = (list, sortType) => {
    const sorted = [...list];

    switch (sortType) {
      case "가격 낮은순":
        return sorted.sort(
          (a, b) =>
            (a.price || a.rooms?.[0]?.price || 0) -
            (b.price || b.rooms?.[0]?.price || 0)
        );

      case "가격 높은순":
        return sorted.sort(
          (a, b) =>
            (b.price || b.rooms?.[0]?.price || 0) -
            (a.price || a.rooms?.[0]?.price || 0)
        );

      case "평점순":
        return sorted.sort(
          (a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0)
        );

      default:
        return sorted; // 추천순 = 기본
    }
  };

  /* ----------------------------------------------------
     2) 필터 적용
  ---------------------------------------------------- */
  useEffect(() => {
    let result = [...hotels];

    if (!filters) {
      setFilteredHotels(applySorting(result, sortType));
      return;
    }

    /* ---- 목적지 ---- */
    if (filters.destination?.trim() !== "") {
      const dest = normalize(filters.destination.trim());

      result = result.filter((hotel) => {
        const name = normalize(hotel.name);
        const loc = normalize(hotel.location);
        return name.includes(dest) || loc.includes(dest);
      });
    }

    /* ---- 가격 ---- */
    if (Array.isArray(filters.priceRange)) {
      const [min, max] = filters.priceRange;

      result = result.filter((hotel) => {
        const price = hotel.price || hotel.rooms?.[0]?.price || 0;
        return price >= min && price <= max;
      });
    }

    /* ---- 평점 ---- */
    if (filters.rating > 0) {
      result = result.filter(
        (hotel) => (hotel.ratingAverage || hotel.rating || 0) >= filters.rating
      );
    }

    /* ---- freebies ---- */
    if (filters.freebies?.length > 0) {
      const keys = filters.freebies.map((f) => normalize(f));

      result = result.filter((hotel) =>
        keys.every((key) => {
          const inTags = hotel.tags?.some((t) => normalize(t).includes(key));
          const inAmenities = hotel.amenities?.some((a) => normalize(a).includes(key));
          const inRooms = hotel.rooms?.some((room) =>
            room.features?.some((f) => normalize(f).includes(key))
          );
          return inTags || inAmenities || inRooms;
        })
      );
    }

    /* ---- amenities ---- */
    if (filters.amenities?.length > 0) {
      const keys = filters.amenities.map((a) => normalize(a));

      result = result.filter((hotel) =>
        keys.every((key) => {
          const inHotel = hotel.amenities?.some((a) => normalize(a).includes(key));
          const inRooms = hotel.rooms?.some((room) =>
            room.amenities?.some((a) => normalize(a).includes(key))
          );
          const inTags = hotel.tags?.some((t) => normalize(t).includes(key));
          return inHotel || inRooms || inTags;
        })
      );
    }

    /* ---------------------------------------------
       📅 날짜 + 인원 기반 예약 가능 필터
    --------------------------------------------- */
    if (filters.checkIn && filters.checkOut) {
      const start = new Date(filters.checkIn);
      const end = new Date(filters.checkOut);

      const days = [];
      let cur = new Date(start);
      while (cur <= end) {
        days.push(cur.toISOString().split("T")[0]);
        cur.setDate(cur.getDate() + 1);
      }

      result = result.filter((hotel) =>
        hotel.rooms?.some((room) => {
          const fitsGuest = room.maxGuests >= (filters.guests?.guests || 1);

          if (!Array.isArray(room.availableDates)) return fitsGuest;

          const dateOK = days.every((d) => room.availableDates.includes(d));
          return fitsGuest && dateOK;
        })
      );
    }

    /* ---------------------------------------------
       ⭐ 날짜 없이 인원만 선택해도 인원 필터 적용됨
    --------------------------------------------- */
    if (filters.guests?.guests > 0) {
      result = result.filter((hotel) =>
        hotel.rooms?.some(
          (room) => room.maxGuests >= filters.guests.guests
        )
      );
    }

    // ⭐ 정렬 적용
    result = applySorting(result, sortType);

    setFilteredHotels(result);
  }, [hotels, filters, sortType]);

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
        total={hotels.length}
        showing={filteredHotels.length}
        onSort={(type) => setSortType(type)}
      />

      <HotelListCards hotels={filteredHotels} filters={filters} />
    </div>
  );
};

export default SearchPage;
