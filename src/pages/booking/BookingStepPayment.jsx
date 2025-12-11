// src/pages/booking/BookingStepPayment.jsx
import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import "../../styles/components/booking/BookingStepPayment.scss";

import { getHotelDetail, getHotelRooms } from "../../api/hotelClient";
import PaymentContent from "../../components/payment/PaymentContent";

const BookingStepPayment = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  /* ---------------------------------------
      ⭐ 회원 / 비회원 구분
  --------------------------------------- */
  const isGuest = location.pathname.startsWith("/booking-guest");
  const basePath = isGuest ? "/booking-guest" : "/booking";

  /* ---------------------------------------
      ⭐ 비회원 결제 모달 상태
  --------------------------------------- */
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleGuestChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  };

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
    if (!roomId) {
      navigate(`${basePath}/${hotelId}/room?${searchParams.toString()}`);
      return;
    }

    getHotelDetail(hotelId).then((res) => {
      if (res?.hotel) setHotel(res.hotel);
    });

    getHotelRooms(hotelId).then((list) => {
      const found = list.find((r) => String(r.id) === String(roomId));
      if (found) setRoom(found);
      else {
        alert("선택한 객실 정보를 찾을 수 없습니다.");
        navigate(`${basePath}/${hotelId}/room?${searchParams.toString()}`);
      }
    });
  }, [hotelId, roomId, navigate, searchParams, basePath]);

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
    return Math.ceil(diff / 86400000);
  };
  const nights = calcNights();

  /* ---------------------------------------
      가격 계산
  --------------------------------------- */
  const priceRoom = room?.price ?? 0;
  const totalPrice = priceRoom * nights;
  const serviceFee = Math.floor(totalPrice * 0.1);
  const tax = Math.floor(totalPrice * 0.1);
  const finalTotal = totalPrice + serviceFee + tax;

  const formatPrice = (p) => new Intl.NumberFormat("ko-KR").format(Number(p));

  /* ---------------------------------------
      포인트 (회원만 적용)
  --------------------------------------- */
  const [points, setPoints] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);

  useEffect(() => {
    if (!isGuest) {
      const stored = localStorage.getItem("userPoints");
      if (stored) setPoints(Number(stored));
    }
  }, [isGuest]);

  const handleUsePoints = () => {
    if (isGuest) return;

    if (usedPoints > 0) {
      setUsedPoints(0);
      return;
    }
    const use = Math.min(points, finalTotal);
    setUsedPoints(use);
  };

  const payableAmount = Math.max(finalTotal - usedPoints, 0);

  /* ---------------------------------------
      약관 상태
  --------------------------------------- */
  const [formData, setFormData] = useState({
    agree: false,
  });

  const handleInputChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  /* ---------------------------------------
      ⭐ 결제 버튼 클릭
  --------------------------------------- */
  const handlePayClick = () => {
    if (!formData.agree) {
      alert("약관에 동의해야 결제 가능합니다.");
      return;
    }

    if (cards.length === 0) {
      alert("결제 수단을 등록해주세요.");
      return;
    }

    if (isGuest) {
      setGuestModalOpen(true);
      return;
    }

    finishPayment();
  };

  /* ---------------------------------------
      ⭐ 비회원 결제 완료 처리
  --------------------------------------- */
  const handleGuestSubmit = () => {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("guestName", guestInfo.name);
    params.set("guestEmail", guestInfo.email);
    params.set("guestPhone", guestInfo.phone);

    navigate(`${basePath}/${hotelId}/complete?${params.toString()}`);
  };

  /* ---------------------------------------
      ⭐ 회원 결제 완료 처리
  --------------------------------------- */
  const finishPayment = () => {
    const remaining = points - usedPoints;
    const earned = Math.floor(payableAmount * 0.001);
    const updated = remaining + earned;

    setPoints(updated);
    localStorage.setItem("userPoints", updated);

    navigate(`${basePath}/${hotelId}/complete?${searchParams.toString()}`);
  };

  /* ---------------------------------------
      렌더링
  --------------------------------------- */
  return (
    <div className="booking-payment">
      <div className="booking-content">
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
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleInputChange}
              />
              <label htmlFor="agree">이용약관 및 개인정보처리방침에 동의합니다.</label>
            </div>
          </div>

          <button
            className="btn-back"
            onClick={() =>
              navigate(`${basePath}/${hotelId}/room?${searchParams.toString()}`)
            }
          >
            이전 단계로
          </button>
        </div>

        {/* 오른쪽 예약 요약 */}
        <div className="payment-summary">
          <h3>예약 요약</h3>

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
                성인 {adults}명 {children > 0 && ` / 어린이 ${children}명`}
              </span>
            </div>
          </div>

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

          {/* 가격 정보 */}
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

            {!isGuest && usedPoints > 0 && (
              <div className="price-row">
                <span className="label">포인트 사용</span>
                <span className="value">- ₩{formatPrice(usedPoints)}P</span>
              </div>
            )}

            <div className="price-row total payable">
              <span className="label">결제 예정 금액</span>
              <span className="value">₩{formatPrice(payableAmount)}</span>
            </div>
          </div>

          {!isGuest && (
            <div className="points-section">
              <div className="points-info">
                보유 포인트: <strong>{formatPrice(points)}</strong>P
              </div>
              <button
                className="btn btn--outline"
                onClick={handleUsePoints}
              >
                {usedPoints > 0 ? "포인트 사용 취소" : "포인트 사용"}
              </button>
            </div>
          )}

          <button
            disabled={!formData.agree}
            onClick={handlePayClick}
            className="btn btn--primary btn--lg"
          >
            ₩{formatPrice(payableAmount)} 결제하기
          </button>

          <div className="payment-secure">안전한 결제 환경 제공</div>
        </div>
      </div>

      {/* ⭐ 비회원 정보 모달 — 화면 정중앙 */}
      {guestModalOpen && (
        <div
          className="guest-modal-backdrop"
          onClick={() => setGuestModalOpen(false)}
        >
          <div
            className="guest-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>비회원 정보 입력</h3>

            <div className="input-row">
              <label>이름</label>
              <input
                name="name"
                value={guestInfo.name}
                onChange={handleGuestChange}
                placeholder="이름"
              />
            </div>

            <div className="input-row">
              <label>이메일</label>
              <input
                name="email"
                value={guestInfo.email}
                onChange={handleGuestChange}
                placeholder="이메일"
              />
            </div>

            <div className="input-row">
              <label>전화번호</label>
              <input
                name="phone"
                value={guestInfo.phone}
                onChange={handleGuestChange}
                placeholder="전화번호"
              />
            </div>

            <div className="modal-actions">
              <button className="btn--primary" onClick={handleGuestSubmit}>
                결제 완료
              </button>
              <button
                className="btn--outline"
                onClick={() => setGuestModalOpen(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStepPayment;
