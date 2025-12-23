import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axiosInstance from '../../../api/axiosConfig';

export default function useBookingComplete() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isGuest = location.pathname.startsWith("/booking-guest") || searchParams.get("guest") === "1";
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        alert("예약 번호를 찾을 수 없습니다.");
        navigate("/");
        return;
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        const data = response.data.data || response.data;
        setBooking(data);
      } catch (err) {
        const errMsg = err.response?.data?.message || "예약 정보를 불러오는 데 실패했습니다.";
        alert(errMsg);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingData();
  }, [bookingId, navigate]);

  const formatPrice = (price) => new Intl.NumberFormat("ko-KR").format(Number(price || 0));
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "short",
    });
  };

  // 게스트 무통장 입금 안내 표시 조건
  const paymentStatus = booking?.status || "";
  const payment = { total: booking?.totalPrice || booking?.price || 0 };

  return {
    hotelId,
    isGuest,
    booking,
    loading,
    bookingId,
    formatPrice,
    formatDate,
    paymentStatus,
    payment,
    navigate,
  };
}
