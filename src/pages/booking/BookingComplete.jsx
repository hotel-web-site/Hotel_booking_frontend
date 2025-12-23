import React from "react";
import "../../styles/components/booking/BookingComplete.scss";
import useBookingComplete from "./hooks/useBookingComplete";

const BookingComplete = () => {
  const {
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
  } = useBookingComplete();

  if (loading) return <div className="booking-complete loading">예약 정보를 확인 중입니다...</div>;
  if (!booking) return <div className="booking-complete error">정보를 불러올 수 없습니다.</div>;

  return (
    <div className="booking-complete">
      <div className="success-icon">✓</div>

      <h1>
        {isGuest ? "예약 접수가 완료되었습니다" : "예약이 완료되었습니다!"}
      </h1>

      <p className="success-message">
        {isGuest
          ? "무통장 입금이 확인되면 예약이 확정됩니다."
          : "예약 확인 이메일이 전송되었습니다."}
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

        {/* ⭐ 무통장 입금 안내 */}
        {isGuest && paymentStatus === "PAYMENT_PENDING" && (
          <div className="info-section bank-transfer">
            <h3>🏦 무통장 입금 안내</h3>

            <p className="bank-desc">
              아래 계좌로 <strong>입금이 확인되면</strong> 예약이 확정됩니다.
            </p>

            <div className="bank-box">
              <div>은행명: 국민은행</div>
              <div>계좌번호: 123-456-789012</div>
              <div>예금주: Hotel Booking</div>
              <div className="amount">
                입금 금액: ₩{formatPrice(payment.total)}
              </div>
            </div>

            <p className="bank-notice">
              ※ 입금 확인까지 최대 1영업일이 소요될 수 있습니다.
            </p>
          </div>
        )}

        {/* 숙소 정보 */}
        <div className="info-section">
          <h3>🏨 숙소 정보</h3>
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