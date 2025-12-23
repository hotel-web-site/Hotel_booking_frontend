import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import axiosInstance from "../../../api/axiosConfig";

export default function useBookingComplete() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  /* =====================================================
     🔥 회원 / 비회원 판단
  ===================================================== */
  const isGuest =
    location.pathname.startsWith("/booking-guest") ||
    searchParams.get("guest") === "1";

  /* =====================================================
     🔹 상태
  ===================================================== */
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const bookingId = searchParams.get("bookingId");

  /* =====================================================
     🔥 예약 정보 조회
     - 회원: /bookings/:id (인증 필요)
     - 비회원: /bookings/guest/:id (인증 없이)
  ===================================================== */
  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        alert("예약 번호를 찾을 수 없습니다.");
        navigate("/");
        return;
      }

      try {
        setLoading(true);

        const url = isGuest
          ? `/bookings/guest/${bookingId}`
          : `/bookings/${bookingId}`;

        const response = await axiosInstance.get(url);
        const data = response.data?.data || response.data;

        if (!data) {
          throw new Error("예약 데이터가 비어 있습니다.");
        }

        setBooking(data);
      } catch (err) {
        console.error("예약 조회 실패:", err);
        const errMsg =
          err.response?.data?.message ||
          "예약 정보를 불러오는 데 실패했습니다.";
        alert(errMsg);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId, isGuest, navigate]);

  /* =====================================================
     🔹 포맷 유틸
  ===================================================== */
  const formatPrice = (price) =>
    new Intl.NumberFormat("ko-KR").format(Number(price || 0));

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  /* =====================================================
     🔹 결제 / 상태 정보
  ===================================================== */
  const paymentStatus = booking?.status || "";
  const payment = {
    total: booking?.totalPrice || booking?.price || 0,
  };

  return {
    hotelId,
    isGuest,

    booking,
    bookingId,
    loading,

    formatPrice,
    formatDate,

    paymentStatus,
    payment,

    navigate,
  };
}
