import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import "../../styles/components/booking/BookingComplete.scss";

// API 연동을 위한 인스턴스
import axiosInstance from "../../api/axiosConfig";

const BookingComplete = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isGuest = location.pathname.startsWith("/booking-guest") || searchParams.get("guest") === "1";

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL에서 전달받은 예약 ID
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
        // ⭐ 중요: 비회원 예약 조회 시 토큰 없이도 접근 가능한 엔드포인트인지 백엔드 확인 필요
        const response = await axiosInstance.get(`/bookings/${bookingId}`);

        // 백엔드 응답 구조에 맞춰 데이터 추출 (res.data.data 또는 res.data)
        const data = response.data.data || response.data;

        setBooking(data);
      } catch (err) {
        console.error("예약 정보 로드 실패:", err);
        const errMsg = err.response?.data?.message || "예약 정보를 불러오는 데 실패했습니다.";
        alert(errMsg);
        navigate("/"); // 에러 시 홈으로 리다이렉트
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
    // 날짜가 유효하지 않을 경우 대비
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "short",
    });
  };

  if (loading) return <div className="booking-complete loading">예약 정보를 확인 중입니다...</div>;
  if (!booking) return <div className="booking-complete error">정보를 불러올 수 없습니다.</div>;

  return (
    <div className="booking-complete">
      <div className="success-icon">✓</div>

      <h1>예약이 완료되었습니다!</h1>
      <p className="success-message">
        {isGuest
          ? "비회원 예약이 성공적으로 처리되었습니다."
          : "예약 내역이 마이페이지에 등록되었습니다."}
      </p>

      <div className="confirmation-card">
        {/* 예약 번호 */}
        <div className="confirmation-number">
          <div className="label">예약 번호</div>
          <div className="number">{booking._id || bookingId}</div>
        </div>

        {/* 예약자 정보 */}
        <div className="info-section">
          <h3><span className="icon">👤</span> 예약자 정보</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="label">이름</div>
              <div className="value">{booking.guestName || booking.user?.name || "정보 없음"}</div>
            </div>
            <div className="info-item">
              <div className="label">연락처</div>
              <div className="value">{booking.guestPhone || booking.user?.phoneNumber || booking.user?.phone || "-"}</div>
            </div>
          </div>
        </div>

        {/* 숙소 정보 */}
        <div className="info-section">
          <h3><span className="icon">🏨</span> 숙소 정보</h3>
          <div className="hotel-summary">
            {/* 데이터가 없을 경우를 대비한 Optional Chaining(?.) 사용 */}
            <img
              src={booking.hotel?.images?.[0] || booking.hotel?.image || "/default-hotel.jpg"}
              alt={booking.hotel?.name || "호텔 이미지"}
              onError={(e) => { e.target.src = "/default-hotel.jpg"; }} // 이미지 로드 실패 대비
            />
            <div className="hotel-details">
              <div className="hotel-name">{booking.hotel?.name || "호텔 정보 없음"}</div>
              <div className="hotel-address">{booking.hotel?.address || "주소 정보 없음"}</div>
            </div>
          </div>
        </div>

        {/* 예약 상세 */}
        <div className="info-section">
          <h3><span className="icon">📅</span> 예약 상세</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="label">체크인</div>
              <div className="value">{formatDate(booking.checkIn)}</div>
            </div>
            <div className="info-item">
              <div className="label">체크아웃</div>
              <div className="value">{formatDate(booking.checkOut)}</div>
            </div>
            <div className="info-item">
              <div className="label">객실</div>
              <div className="value">{booking.room?.name || "객실 정보 없음"}</div>
            </div>
            <div className="info-item">
              <div className="label">투숙객</div>
              <div className="value">성인 {booking.guests?.adults || 0} / 어린이 {booking.guests?.children || 0}</div>
            </div>
          </div>
        </div>

        {/* 최종 요금 정보 */}
        <div className="price-summary">
          <div className="price-row total">
            <span>총 결제 금액</span>
            <span>₩{formatPrice(booking.totalPrice || booking.price)}</span>
          </div>
          <div className="payment-method-tag">
            {booking.status === "pendingPayment" ? "결제 대기" : "결제 완료"}
          </div>
        </div>
      </div>

      <div className="email-notice">
        <span className="icon">✉️</span>
        {(booking.guestEmail || booking.user?.email) ? (
          <>{booking.guestEmail || booking.user?.email}로 예약 확인서가 발송되었습니다.</>
        ) : (
          <>예약 확인서가 발송되었습니다.</>
        )}
      </div>

      <div className="action-buttons">
        {!isGuest ? (
          <button className="btn btn-primary" onClick={() => navigate("/mypage/bookings")}>
            예약 내역 보기
          </button>
        ) : (
          <div className="guest-action-box">
            <p className="guest-notice">비회원은 예약 번호를 반드시 보관해 주세요.</p>
            {/* 비회원용 예약 확인 페이지가 있다면 연결 */}
          </div>
        )}
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default BookingComplete;