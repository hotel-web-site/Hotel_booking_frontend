import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function useMyBookingDetailView() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const storedBookings = localStorage.getItem("bookings");
    if (!storedBookings) return;
    const bookingList = JSON.parse(storedBookings);
    const found = bookingList.find(
      (item) => String(item.id) === String(bookingId)
    );
    if (!found) {
      alert("예약 정보를 찾을 수 없습니다.");
      navigate("/mypage/bookings");
      return;
    }
    setBooking(found);
  }, [bookingId, navigate]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });

  const formatPrice = (n) =>
    new Intl.NumberFormat("ko-KR").format(Number(n || 0));

  const handleCancel = () => {
    if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;
    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const updated = storedBookings.map((b) =>
      b.id === booking.id ? { ...b, status: "취소됨" } : b
    );
    localStorage.setItem("bookings", JSON.stringify(updated));
    alert("예약이 취소되었습니다.");
    navigate("/mypage/bookings");
  };

  return {
    booking,
    formatDate,
    formatPrice,
    handleCancel,
    navigate,
  };
}
