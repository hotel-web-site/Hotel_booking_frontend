import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/components/booking/BookingComplete.scss";

import { getHotelDetail, getHotelRooms } from "../../api/hotelClient";

const BookingComplete = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bookingData, setBookingData] = useState(null);
  const [confirmationNumber, setConfirmationNumber] = useState("");

  /* -----------------------------
     날짜 계산
  ----------------------------- */
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("ko-KR").format(Number(price || 0));

  const formatDate = (date) =>
    date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });

  /* -----------------------------
     예약 정보 세팅 + 저장
  ----------------------------- */
  useEffect(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adults = Number(searchParams.get("adults") || 2);
    const children = Number(searchParams.get("children") || 0);
    const roomId = searchParams.get("roomId");

    if (!checkIn || !checkOut || !roomId) {
      alert("예약 정보가 올바르지 않습니다.");
      navigate("/");
      return;
    }

    // 예약 번호 생성
    const confNum = `BK${Date.now().toString().slice(-8)}`;
    setConfirmationNumber(confNum);

    // 호텔 & 객실 정보 가져오기
    Promise.all([getHotelDetail(hotelId), getHotelRooms(hotelId)]).then(
      ([hotelRes, roomList]) => {
        const hotel = hotelRes.hotel;
        const room = roomList.find((r) => String(r.id) === String(roomId));

        if (!room) {
          alert("객실 정보를 불러올 수 없습니다.");
          navigate("/");
          return;
        }

        const nights = calculateNights(checkIn, checkOut);
        const roomPrice = room.price;
        const totalRoom = roomPrice * nights;
        const serviceFee = Math.floor(totalRoom * 0.1);
        const tax = Math.floor(totalRoom * 0.1);

        const bookingObj = {
          id: confNum, // 예약 상세 페이지에서 사용
          hotel,
          room,
          checkIn,
          checkOut,
          guests: { adults, children },
          payment: {
            nights,
            roomPrice,
            serviceFee,
            tax,
            total: totalRoom + serviceFee + tax,
          },
          status: "예정됨",
        };

        // 🔥 localStorage에 저장
        const stored = localStorage.getItem("bookings");
        const bookingList = stored ? JSON.parse(stored) : [];
        bookingList.push(bookingObj);
        localStorage.setItem("bookings", JSON.stringify(bookingList));

        // state 적용(화면 표시용)
        setBookingData({
          hotel,
          room,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          guests: { adults, children },
          payment: {
            nights,
            roomPrice,
            serviceFee,
            tax,
            total: totalRoom + serviceFee + tax,
          },
        });
      }
    );
  }, [hotelId, searchParams, navigate]);

  if (!bookingData) return <div className="booking-complete">로딩 중...</div>;

  const { hotel, room, checkIn, checkOut, guests, payment } = bookingData;

  return (
    <div className="booking-complete">
      <div className="success-icon">✓</div>

      <h1>예약이 완료되었습니다!</h1>
      <p className="success-message">예약 확인 이메일이 전송되었습니다.</p>

      <div className="confirmation-card">

        <div className="confirmation-number">
          <div className="label">예약 번호</div>
          <div className="number">{confirmationNumber}</div>
        </div>

        {/* 호텔 */}
        <div className="info-section">
          <h3>
            <span className="icon">🏨</span> 숙소 정보
          </h3>

          <div className="hotel-summary">
            <img src={hotel.image || hotel.images?.[0]} alt={hotel.name} />
            <div className="hotel-details">
              <div className="hotel-name">{hotel.name}</div>
              <div className="hotel-address">{hotel.address}</div>
              <div className="hotel-phone">📞 고객센터 전화번호 없음</div>
            </div>
          </div>
        </div>

        {/* 날짜 */}
        <div className="info-section">
          <h3>
            <span className="icon">📅</span> 예약 상세
          </h3>

          <div className="info-grid">
            <div className="info-item">
              <div className="label">체크인</div>
              <div className="value">{formatDate(checkIn)}</div>
            </div>

            <div className="info-item">
              <div className="label">체크아웃</div>
              <div className="value">{formatDate(checkOut)}</div>
            </div>

            <div className="info-item">
              <div className="label">숙박 기간</div>
              <div className="value">{payment.nights}박</div>
            </div>

            <div className="info-item">
              <div className="label">투숙객</div>
              <div className="value">
                성인 {guests.adults}명
                {guests.children > 0 && ` / 어린이 ${guests.children}명`}
              </div>
            </div>
          </div>
        </div>

        {/* 객실 */}
        <div className="info-section">
          <h3>
            <span className="icon">🛏️</span> 객실 정보
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="label">객실 타입</div>
              <div className="value">{room.name}</div>
            </div>

            <div className="info-item">
              <div className="label">객실 크기</div>
              <div className="value">{room.size}</div>
            </div>

            <div className="info-item">
              <div className="label">침대 타입</div>
              <div className="value">{room.bedType}</div>
            </div>
          </div>
        </div>

        {/* 요금 */}
        <div className="price-summary">
          <div className="price-row">
            <span>₩{formatPrice(payment.roomPrice)} × {payment.nights}박</span>
            <span>₩{formatPrice(payment.roomPrice * payment.nights)}</span>
          </div>

          <div className="price-row">
            <span>서비스 수수료</span>
            <span>₩{formatPrice(payment.serviceFee)}</span>
          </div>

          <div className="price-row">
            <span>세금</span>
            <span>₩{formatPrice(payment.tax)}</span>
          </div>

          <div className="price-row total">
            <span>총 결제 금액</span>
            <span>₩{formatPrice(payment.total)}</span>
          </div>
        </div>
      </div>

      {/* 안내 */}
      <div className="email-notice">
        <span className="icon">✉️</span>
        예약 확인서가 이메일로 전송되었습니다.
      </div>

      {/* 버튼 */}
      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(`/mypage/bookings/${confirmationNumber}`)
          }
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
