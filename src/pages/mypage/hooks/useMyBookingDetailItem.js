import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function useMyBookingDetailItem() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("bookings");
    if (!stored) return;
    const list = JSON.parse(stored);
    const found = list.find((b) => String(b.id) === String(bookingId));
    setBooking(found || null);
  }, [bookingId]);

  const nights = booking
    ? Math.ceil(
        (new Date(booking.checkOut) - new Date(booking.checkIn)) /
        (1000 * 60 * 60 * 24)
      )
    : 0;

  const format = (d) =>
    new Date(d).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });

  const handleCancel = () => {
    if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;
    const stored = localStorage.getItem("bookings");
    if (!stored) return;
    const list = JSON.parse(stored);
    const updated = list.map((b) =>
      b.id === booking.id ? { ...b, status: "취소됨" } : b
    );
    localStorage.setItem("bookings", JSON.stringify(updated));
    alert("예약이 취소되었습니다.");
    navigate("/mypage/bookings");
  };

  return {
    booking,
    nights,
    format,
    handleCancel,
    navigate,
  };
}
