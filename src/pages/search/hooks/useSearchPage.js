import { useEffect, useState, useMemo } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { getHotels, getHotelRooms } from "../../../api/hotelClient";

const normalize = (s) => (s || "").toLowerCase().replace(/\s|-/g, "");

export default function useSearchPage() {
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get("guest") === "1";
  const context = useOutletContext();
  const filters = context?.filters || {};

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("추천순");
  const [activeTab, setActiveTab] = useState("hotels");

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

  useEffect(() => {
    let result = [...hotels];
    result = result.filter((h) => {
      const type = h.type || h.category || "";
      if (activeTab === "hotels") return type === "호텔" || type === "hotel";
      if (activeTab === "motels") return type === "모텔" || type === "motel";
      if (activeTab === "resorts") return type === "리조트" || type === "resort";
      return true;
    });
    if (filters) {
      if (filters.destination) {
        const term = normalize(filters.destination);
        result = result.filter((h) => normalize(h.name).includes(term));
      }
      // ...추가 필터링 로직...
    }
    setFilteredHotels(result);
  }, [hotels, filters, activeTab]);

  return {
    isGuest,
    filters,
    hotels,
    filteredHotels,
    loading,
    sortType,
    setSortType,
    activeTab,
    setActiveTab,
  };
}
