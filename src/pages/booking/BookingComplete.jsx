import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/components/booking/BookingComplete.scss";

const BookingComplete = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bookingData, setBookingData] = useState(null);
  const [confirmationNumber, setConfirmationNumber] = useState("");

  useEffect(() => {
    // TODO: API에서 예약 완료 정보 가져오기
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adults = searchParams.get("adults") || 2;
    const children = searchParams.get("children") || 0;
    const roomId = searchParams.get("roomId");

    // 확인 번호 생성 (실제로는 서버에서 받아옴)
    const confirmNum = `BK${Date.now().toString().slice(-8)}`;
    setConfirmationNumber(confirmNum);

    // 임시 예약 데이터
    setBookingData({
      hotel: {
        name: "그랜드 호텔 서울",
        address: "서울시 중구 소공로 100",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        phone: "02-1234-5678",
      },
      room: {
        name: "Deluxe Room",
        size: "35㎡",
        bedType: "King Bed",
      },
      checkIn: checkIn ? new Date(checkIn) : new Date(),
      checkOut: checkOut ? new Date(checkOut) : new Date(),
      guests: {
        adults: parseInt(adults),
        children: parseInt(children),
      },
      payment: {
        roomPrice: 180000,
        nights: calculateNights(checkIn, checkOut),
        serviceFee: 18000,
        tax: 18000,
      },
    });
  }, [searchParams]);

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  const getTotalPrice = () => {
    if (!bookingData) return 0;
    const { roomPrice, nights, serviceFee, tax } = bookingData.payment;
    return roomPrice * nights + serviceFee + tax;
  };

  if (!bookingData) {
    return (
      <div className="booking-complete">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="booking-complete">
      <div className="success-icon">✓</div>

      <h1>예약이 완료되었습니다!</h1>
      <p className="success-message">
        예약 확인 메일이 발송되었습니다. 즐거운 여행 되세요!
      </p>

      <div className="confirmation-card">
        <div className="confirmation-number">
          <div className="label">예약 번호</div>
          <div className="number">{confirmationNumber}</div>
        </div>

        <div className="booking-info">
          {/* 호텔 정보 */}
          <div className="info-section">
            <h3>
              <span className="icon">🏨</span>
              숙소 정보
            </h3>
            <div className="hotel-summary">
              <img src={bookingData.hotel.image} alt={bookingData.hotel.name} />
              <div className="hotel-details">
                <div className="hotel-name">{bookingData.hotel.name}</div>
                <div className="hotel-address">{bookingData.hotel.address}</div>
                <div className="hotel-phone">📞 {bookingData.hotel.phone}</div>
              </div>
            </div>
          </div>

          {/* 예약 정보 */}
          <div className="info-section">
            <h3>
              <span className="icon">📅</span>
              예약 상세
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="label">체크인</div>
                <div className="value">{formatDate(bookingData.checkIn)}</div>
              </div>
              <div className="info-item">
                <div className="label">체크아웃</div>
                <div className="value">{formatDate(bookingData.checkOut)}</div>
              </div>
              <div className="info-item">
                <div className="label">숙박 기간</div>
                <div className="value">{bookingData.payment.nights}박</div>
              </div>
              <div className="info-item">
                <div className="label">투숙객</div>
                <div className="value">
                  성인 {bookingData.guests.adults}명
                  {bookingData.guests.children > 0 &&
                    `, 어린이 ${bookingData.guests.children}명`}
                </div>
              </div>
            </div>
          </div>

          {/* 객실 정보 */}
          <div className="info-section">
            <h3>
              <span className="icon">🛏️</span>
              객실 정보
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="label">객실 타입</div>
                <div className="value">{bookingData.room.name}</div>
              </div>
              <div className="info-item">
                <div className="label">객실 크기</div>
                <div className="value">{bookingData.room.size}</div>
              </div>
              <div className="info-item">
                <div className="label">침대 타입</div>
                <div className="value">{bookingData.room.bedType}</div>
              </div>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="price-summary">
            <div className="price-row">
              <span>
                ₩{formatPrice(bookingData.payment.roomPrice)} ×{" "}
                {bookingData.payment.nights}박
              </span>
              <span>
                ₩
                {formatPrice(
                  bookingData.payment.roomPrice * bookingData.payment.nights
                )}
              </span>
            </div>
            <div className="price-row">
              <span>서비스 수수료</span>
              <span>₩{formatPrice(bookingData.payment.serviceFee)}</span>
            </div>
            <div className="price-row">
              <span>세금</span>
              <span>₩{formatPrice(bookingData.payment.tax)}</span>
            </div>
            <div className="price-row total">
              <span>총 결제 금액</span>
              <span>₩{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="email-notice">
        <span className="icon">✉️</span>
        <span>예약 확인서가 이메일로 전송되었습니다.</span>
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/mypage/bookings/:bookingId")}
        >
          예약 내역 보기
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default BookingComplete;