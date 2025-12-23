import { useEffect, useState, useCallback } from "react";
import { getHotels, getHotelRooms } from "../../../api/hotelClient";

const MIN_PRICE = 50000;
const MAX_PRICE = 1200000;

export function useSearchLayout() {
  const [hotels, setHotels] = useState([]);
  const initialFilterState = {
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: { adults: 2, children: 0, total: 2 },
    priceRange: [MIN_PRICE, MAX_PRICE],
    rating: 0,
    freebies: [],
    amenities: [],
    searchTrigger: 0,
  };
  const [filters, setFilters] = useState(initialFilterState);

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

  const handleFilterChange = useCallback((filterName, value) => {
    if (filterName === "all") {
      setFilters({ ...initialFilterState, searchTrigger: filters.searchTrigger + 1 });
    } else {
      setFilters((prev) => ({ ...prev, [filterName]: value }));
    }
  }, [filters.searchTrigger]);

  const handleSearch = useCallback((searchData) => {
    setFilters((prev) => ({
      ...prev,
      ...searchData,
      searchTrigger: prev.searchTrigger + 1,
    }));
  }, []);

  return {
    hotels,
    filters,
    handleFilterChange,
    handleSearch
  };
}
