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
      포인트 상태 (localStorage 기반)
      - 추후 백엔드 연결 시 API로 교체
  --------------------------------------- */
  const [points, setPoints] = useState(0); // 보유 포인트
  const [usedPoints, setUsedPoints] = useState(0); // 이번 결제에 사용할 포인트

  // 최초 로딩 시 localStorage에서 포인트 불러오기
  useEffect(() => {
    const stored = localStorage.getItem("userPoints");
    if (stored) {
      const num = Number(stored);
      if (!Number.isNaN(num)) setPoints(num);
    }
  }, []);

  // 포인트 사용/취소 버튼
  const handleUsePoints = () => {
    if (usedPoints > 0) {
      // 이미 사용 중이면 취소
      setUsedPoints(0);
      return;
    }

    if (points <= 0) {
      alert("사용 가능한 포인트가 없습니다.");
      return;
    }

    if (finalTotal <= 0) {
      alert("결제 금액이 없습니다.");
      return;
    }

    // 결제 금액을 넘지 않도록 제한
    const use = Math.min(points, finalTotal);
    setUsedPoints(use);
  };

  // 실제 결제 예정 금액 (포인트 차감 후)
  const payableAmount = Math.max(finalTotal - usedPoints, 0);

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

    // ✅ 포인트 정산 로직 (백엔드 연결 전: localStorage 사용)
    const remainingPoints = points - usedPoints; // 이번 결제에서 사용한 포인트 차감
    // 실제 결제 금액 기준 0.1% 적립
    const earnedPoints = Math.floor(payableAmount * 0.001);
    const updatedPoints = remainingPoints + earnedPoints;

    setPoints(updatedPoints);
    localStorage.setItem("userPoints", String(updatedPoints));

    // TODO: 백엔드 연결 후 아래처럼 교체
    // await api.post("/points/use", { usedPoints });
    // await api.post("/points/earn", { amount: payableAmount });

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

            {/* 기본 총합 (포인트 적용 전) */}
            <div className="price-row total">
              <span className="label">총 합계</span>
              <span className="value">₩{formatPrice(finalTotal)}</span>
            </div>

            {/* 포인트 사용 시 차감 표시 */}
            {usedPoints > 0 && (
              <div className="price-row">
                <span className="label">포인트 사용</span>
                <span className="value">- ₩{formatPrice(usedPoints)}P</span>
              </div>
            )}

            {/* 실제 결제 예정 금액 */}
            <div className="price-row total payable">
              <span className="label">결제 예정 금액</span>
              <span className="value">₩{formatPrice(payableAmount)}</span>
            </div>
          </div>

          {/* 포인트 영역 */}
          <div className="points-section">
            <div className="points-info">
              보유 포인트: <strong>{formatPrice(points)}</strong>P
            </div>
            <button
              type="button"
              className="btn btn--outline"
              onClick={handleUsePoints}
              disabled={points === 0 && usedPoints === 0}
            >
              {usedPoints > 0 ? "포인트 사용 취소" : "포인트 사용"}
            </button>
            {usedPoints > 0 && (
              <div className="points-used">
                사용 포인트: {formatPrice(usedPoints)}P (결제 금액에서 차감)
              </div>
            )}
          </div>

          {/* 결제 버튼 */}
          <button
            disabled={!formData.agree || cards.length === 0}
            onClick={handleSubmit}
            className="btn btn--primary btn--lg"
          >
            ₩{formatPrice(payableAmount)} 결제하기
          </button>

          <div className="payment-secure">안전한 결제 환경 제공</div>
        </div>
      </div>
    </div>
  );
};

export default BookingStepPayment;
