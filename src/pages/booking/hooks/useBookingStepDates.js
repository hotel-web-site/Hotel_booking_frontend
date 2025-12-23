import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { format, isBefore, startOfToday } from "date-fns";
import { getHotelDetail } from '../../../api/hotelClient';

export default function useBookingStepDates() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  // 비회원 모드 감지
  const isGuest = searchParams.get("guest") === "1";
  const basePath = isGuest ? "/booking-guest" : "/booking";

  useEffect(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    setAdults(Number(searchParams.get("adults")) || 2);
    setChildren(Number(searchParams.get("children")) || 0);
    if (checkIn) {
      const fromDate = new Date(checkIn);
      const toDate = checkOut ? new Date(checkOut) : undefined;
      const today = startOfToday();
      setRange({
        from: isBefore(fromDate, today) ? today : fromDate,
        to: toDate && isBefore(toDate, fromDate) ? undefined : toDate,
      });
    }
    setLoading(true);
    getHotelDetail(hotelId)
      .then((res) => {
        const hotelData = res?.hotel || res;
        if (hotelData) setHotel(hotelData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hotelId, searchParams]);

  const calculateNights = () => {
    if (!range?.from || !range?.to) return 0;
    const diffTime = Math.abs(range.to - range.from);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleContinue = () => {
    if (!range?.from || !range?.to) {
      alert("체크인과 체크아웃 날짜를 모두 선택해주세요.");
      return;
    }
    const params = new URLSearchParams(searchParams);
    const formatDate = (d) => format(d, "yyyy-MM-dd");
    params.set("checkIn", formatDate(range.from));
    params.set("checkOut", formatDate(range.to));
    params.set("adults", adults);
    params.set("children", children);
    params.set("guests", adults + children);
    if (isGuest) params.set("guest", "1");
    navigate(`${basePath}/${hotelId}/room?${params.toString()}`);
  };

  return {
    range,
    setRange,
    adults,
    setAdults,
    children,
    setChildren,
    hotel,
    loading,
    isGuest,
    basePath,
    calculateNights,
    handleContinue,
  };
}
