import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function useMyBookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookings") || "[]");
    const found = stored.find((b) => b.id === bookingId);
    setBooking(found || null);
  }, [bookingId]);

  const formatPrice = (p) => new Intl.NumberFormat("ko-KR").format(Number(p));

  const handleCancel = () => {
    if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;
    const list = JSON.parse(localStorage.getItem("bookings") || "[]");
    const updated = list.map((b) => b.id === bookingId ? { ...b, status: "취소됨" } : b);
    localStorage.setItem("bookings", JSON.stringify(updated));
    alert("예약이 취소되었습니다.");
    navigate("/mypage/bookings");
  };

  return {
    booking,
    bookingId,
    formatPrice,
    handleCancel,
  };
}
