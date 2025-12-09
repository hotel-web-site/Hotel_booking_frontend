import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/components/booking/BookingStepPayment.scss";

import { getHotelDetail, getHotelRooms } from "../../api/hotelClient";
import PaymentContent from "../../components/payment/PaymentContent";

const BookingStepPayment = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ---------------------------------------
      결제 카드 상태
  --------------------------------------- */
  const [addCard, setAddCard] = useState(false);
  const [cards, setCards] = useState([
    { id: 1, last4: "4321", expiry: "02/27", type: "visa" },
  ]);

  const handleAddCard = () => setAddCard(true);
  const handleDeleteCard = (cardId) =>
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  const handleBackdropClick = (e) => {
    if (e.target.className === "add-card-modal") setAddCard(false);
  };

  /* ---------------------------------------
      호텔 + 객실 정보 로딩
  --------------------------------------- */
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);

  const roomId = searchParams.get("roomId");

  useEffect(() => {
    // roomId 없는 경우 → 객실 선택 페이지로 이동 (안전 처리)
    if (!roomId) {
      navigate(`/booking/${hotelId}/room?${searchParams.toString()}`);
      return;
    }

    // 호텔 정보
    getHotelDetail(hotelId).then((res) => {
      if (res?.hotel) setHotel(res.hotel);
    });

    // 객실 정보
    getHotelRooms(hotelId).then((list) => {
      const found = list.find((r) => String(r.id) === String(roomId));
      if (!found) {
        alert("선택한 객실 정보를 찾을 수 없습니다.");
        navigate(`/booking/${hotelId}/room?${searchParams.toString()}`);
        return;
      }
      setRoom(found);
    });
  }, [hotelId, roomId, navigate, searchParams]);

  /* ---------------------------------------
      예약 정보
  --------------------------------------- */
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children") || 0;

  const calcNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const nights = calcNights();

  /* ---------------------------------------
      금액 계산 (안전 처리)
  --------------------------------------- */
  const priceRoom = room?.price ?? 0;
  const totalPrice = priceRoom * nights;
  const serviceFee = Math.floor(totalPrice * 0.1);
  const tax = Math.floor(totalPrice * 0.1);
  const finalTotal = totalPrice + serviceFee + tax;

  const formatPrice = (p) =>
    new Intl.NumberFormat("ko-KR").format(Number(p || 0));

  /* ---------------------------------------
      약관 동의 상태
  --------------------------------------- */
  const [formData, setFormData] = useState({
    agree: false,
    saveCard: false,
  });

  const handleInputChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  /* ---------------------------------------
      결제 버튼 클릭
  --------------------------------------- */
  const handleSubmit = () => {
    if (!cards.length) {
      alert("결제 수단을 등록해주세요.");
      return;
    }
    if (!formData.agree) {
      alert("약관에 동의해야 결제가 가능합니다.");
      return;
    }

    navigate(`/booking/${hotelId}/complete?${searchParams.toString()}`);
  };

  /* ---------------------------------------
      렌더링
  --------------------------------------- */
  return (
    <div className="booking-payment">
      <div className="booking-content">
        {/* LEFT: 카드를 선택하는 영역 */}
        <PaymentContent
          cards={cards}
          handleAddCard={handleAddCard}
          handleDeleteCard={handleDeleteCard}
          addCard={addCard}
          handleBackdropClick={handleBackdropClick}
        />

        {/* 약관 */}
        <div className="payment-section">
          <div className="section-card terms-section">
            <h3>약관 동의</h3>

            <div className="term-item">
              <input
                type="checkbox"
                id="saveCard"
                name="saveCard"
                checked={formData.saveCard}
                onChange={handleInputChange}
              />
              <label htmlFor="saveCard">
                <div className="term-title">결제수단 안전하게 저장</div>
              </label>
            </div>

            <div className="term-item">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleInputChange}
              />
              <label htmlFor="agree">
                <div className="term-title">
                  이용약관 및 개인정보처리방침에 동의합니다.
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT: 결제 요약 */}
        <div className="payment-summary">
          <h3>예약 요약</h3>

          {/* 호텔 정보 */}
          {hotel && (
            <div className="booking-details">
              <div className="detail-item">
                <span className="label">호텔명</span>
                <span className="value">{hotel.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">주소</span>
                <span className="value">{hotel.address}</span>
              </div>
            </div>
          )}

          {/* 날짜 정보 */}
          <div className="booking-details">
            <div className="detail-item">
              <span className="label">체크인</span>
              <span className="value">
                {checkIn ? new Date(checkIn).toLocaleDateString("ko-KR") : "-"}
              </span>
            </div>

            <div className="detail-item">
              <span className="label">체크아웃</span>
              <span className="value">
                {checkOut ? new Date(checkOut).toLocaleDateString("ko-KR") : "-"}
              </span>
            </div>

            <div className="detail-item">
              <span className="label">숙박 기간</span>
              <span className="value">{nights}박</span>
            </div>

            <div className="detail-item">
              <span className="label">투숙객</span>
              <span className="value">
                성인 {adults}명
                {children > 0 && ` / 어린이 ${children}명`}
              </span>
            </div>
          </div>

          {/* 객실 정보 */}
          {room && (
            <div className="booking-details">
              <div className="detail-item">
                <span className="label">객실</span>
                <span className="value">
                  {room.name} ({room.size})
                </span>
              </div>
            </div>
          )}

          {/* 가격 상세 */}
          <div className="price-breakdown">
            <div className="price-row">
              <span className="label">
                ₩{formatPrice(priceRoom)} × {nights}박
              </span>
              <span className="value">₩{formatPrice(totalPrice)}</span>
            </div>

            <div className="price-row">
              <span className="label">서비스 수수료</span>
              <span className="value">₩{formatPrice(serviceFee)}</span>
            </div>

            <div className="price-row">
              <span className="label">세금</span>
              <span className="value">₩{formatPrice(tax)}</span>
            </div>

            <div className="price-row total">
              <span className="label">총 합계</span>
              <span className="value">₩{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* 결제 버튼 */}
          <button
            disabled={!formData.agree || cards.length === 0}
            onClick={handleSubmit}
            className="btn btn--primary btn--lg"
          >
            ₩{formatPrice(finalTotal)} 결제하기
          </button>

          <div className="payment-secure">안전한 결제 환경 제공</div>
        </div>
      </div>
    </div>
  );
};

export default BookingStepPayment;
