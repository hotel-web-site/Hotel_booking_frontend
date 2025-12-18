import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import "../../styles/components/booking/BookingComplete.scss";

import { getHotelDetail, getHotelRooms } from "../../api/hotelClient";

const BookingComplete = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  /* --------------------------------------
      ⭐ 회원 / 비회원 구분
  -------------------------------------- */
  const isGuest = location.pathname.startsWith("/booking-guest");

  /* --------------------------------------
      결제 상태 (비회원용)
  -------------------------------------- */
  const paymentStatus = searchParams.get("paymentStatus"); // PAYMENT_PENDING
  const paymentMethod = searchParams.get("paymentMethod"); // BANK_TRANSFER

  const [bookingData, setBookingData] = useState(null);
  const [confirmationNumber, setConfirmationNumber] = useState("");

  /* --------------------------------------
      비회원 정보
  -------------------------------------- */
  const guestName = searchParams.get("guestName");
  const guestEmail = searchParams.get("guestEmail");
  const guestPhone = searchParams.get("guestPhone");

  /* --------------------------------------
      유틸
  -------------------------------------- */
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diff / 86400000);
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

  /* --------------------------------------
      예약 데이터 로딩
  -------------------------------------- */
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

        const total = totalRoom + serviceFee + tax;

        const bookingObj = {
          id: confNum,
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
            total,
            method: isGuest ? "BANK_TRANSFER" : "CARD",
            status: isGuest ? "PAYMENT_PENDING" : "PAID",
          },
          status: isGuest ? "결제대기" : "예약완료",
        };

        // ⭐ 회원 예약만 마이페이지 저장
        if (!isGuest) {
          const stored = localStorage.getItem("bookings");
          const bookingList = stored ? JSON.parse(stored) : [];
          bookingList.push(bookingObj);
          localStorage.setItem("bookings", JSON.stringify(bookingList));
        }

        setBookingData({
          hotel,
          room,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          guests: { adults, children },
          payment: bookingObj.payment,
        });
      }
    );
  }, [hotelId, searchParams, navigate, isGuest]);

  if (!bookingData) {
    return <div className="booking-complete">로딩 중...</div>;
  }

  const { hotel, room, checkIn, checkOut, guests, payment } = bookingData;

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
          <div className="number">{confirmationNumber}</div>
        </div>

        {/* 비회원 예약자 정보 */}
        {isGuest && (
          <div className="info-section">
            <h3>👤 예약자 정보 (비회원)</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="label">이름</div>
                <div className="value">{guestName}</div>
              </div>
              <div className="info-item">
                <div className="label">이메일</div>
                <div className="value">{guestEmail}</div>
              </div>
              <div className="info-item">
                <div className="label">전화번호</div>
                <div className="value">{guestPhone}</div>
              </div>
            </div>
          </div>
        )}

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
            <img src={hotel.image || hotel.images?.[0]} alt={hotel.name} />
            <div className="hotel-details">
              <div className="hotel-name">{hotel.name}</div>
              <div className="hotel-address">{hotel.address}</div>
            </div>
          </div>
        </div>

        {/* 예약 상세 */}
        <div className="info-section">
          <h3>📅 예약 상세</h3>
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

        {/* 객실 정보 */}
        <div className="info-section">
          <h3>🛏️ 객실 정보</h3>
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

        {/* 요금 정보 */}
        <div className="price-summary">
          <div className="price-row">
            <span>
              ₩{formatPrice(payment.roomPrice)} × {payment.nights}박
            </span>
            <span>
              ₩{formatPrice(payment.roomPrice * payment.nights)}
            </span>
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
            <span>총 금액</span>
            <span>₩{formatPrice(payment.total)}</span>
          </div>
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="email-notice">
        ✉️{" "}
        {isGuest
          ? "입력하신 이메일로 예약 접수 안내가 전송되었습니다."
          : "예약 확인서가 이메일로 전송되었습니다."}
      </div>

      {/* 버튼 */}
      <div className="action-buttons">
        {!isGuest && (
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/mypage/bookings/${confirmationNumber}`)
            }
          >
            예약 내역 보기
          </button>
        )}

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
};

export default BookingComplete;
