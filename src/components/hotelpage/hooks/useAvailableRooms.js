import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export default function useAvailableRooms() {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();

  const isGuest = searchParams.get("guest") === "1";
  const basePath = isGuest ? "/booking-guest" : "/booking";

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = Number(searchParams.get("adults") || 2);
  const children = Number(searchParams.get("children") || 0);
  const totalGuests = adults + children;

  const neededDates = useMemo(() => {
    if (!checkIn || !checkOut) return [];
    const range = [];
    let cur = new Date(checkIn);
    const end = new Date(checkOut);
    while (cur <= end) {
      range.push(cur.toISOString().split("T")[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return range;
  }, [checkIn, checkOut]);

  const isRoomAvailable = (room) => {
    if (!checkIn || !checkOut) return true;
    const max = Number(room.maxGuests) || 10;
    const fitsGuests = max >= totalGuests;
    if (!fitsGuests) return false;
    if (!room.availableDates || !Array.isArray(room.availableDates) || room.availableDates.length === 0) {
      return true;
    }
    return neededDates.every((d) => room.availableDates.includes(d));
  };

  const handleBook = (room) => {
    const roomId = room._id || room.id;
    const params = new URLSearchParams(searchParams);
    params.set("roomId", String(roomId));
    if (isGuest) params.set("guest", "1");
    navigate(`${basePath}/${hotelId}?${params.toString()}`);
  };

  return {
    isGuest,
    totalGuests,
    isRoomAvailable,
    handleBook,
  };
}
