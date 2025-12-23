import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/booking/BookingStepPayment.scss";
import PaymentContent from "../../components/payment/PaymentContent";
import useBookingStepPayment from "./hooks/useBookingStepPayment";

const BookingStepPayment = () => {
  const navigate = useNavigate();

  const {
    hotel,
    room,
    loading,

    /* 🔥 비회원 관련 */
    isGuestMode,
    guestModalOpen,
    setGuestModalOpen,
    guestInfo,
    setGuestInfo,

    /* 🔥 회원 결제 관련 */
    cards,
    setCards,
    points,
    usedPoints,
    handleUsePoints,

    /* 🔥 공통 */
    formData,
    setFormData,
    checkIn,
    checkOut,
    adults,
    children,
    nights,
    totalPrice,
    serviceFee,
    tax,
    payableAmount,
    formatPrice,
    handlePayClick,
    handleGuestSubmit,
  } = useBookingStepPayment();

  if (loading) {
    return (
      <div className="booking-payment loading">
        정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="booking-payment">
      <div className="booking-content">

        {/* =====================================================
            🔥 결제 수단 (회원 전용)
        ===================================================== */}
        {!isGuestMode && (
          <PaymentContent
            cards={cards}
            onAddCard={(newCard) => setCards([...cards, newCard])}
            onDeleteCard={(id) =>
              setCards(cards.filter((c) => c.id !== id))
            }
          />
        )}

        {/* =====================================================
            🔹 약관 영역
        ===================================================== */}
        <div className="payment-section">
          <div className="section-card terms-section">
            <h3>약관 동의</h3>
            <div className="term-item">
              <input
                type="checkbox"
                id="agree"
                checked={formData.agree}
                onChange={(e) =>
                  setFormData({ agree: e.target.checked })
                }
              />
              <label htmlFor="agree">
                이용약관 및 개인정보처리방침에 동의합니다. (필수)
              </label>
            </div>
          </div>

          <button className="btn-back" onClick={() => navigate(-1)}>
            ← 이전 단계로
          </button>
        </div>

        {/* =====================================================
            🔹 결제 요약
        ===================================================== */}
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
                {new Date(checkIn).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">체크아웃</span>
              <span className="value">
                {new Date(checkOut).toLocaleDateString()}
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

          <div className="price-breakdown">
            <div className="price-row">
              <span className="label">객실 합계</span>
              <span className="value">
                ₩{formatPrice(totalPrice)}
              </span>
            </div>
            <div className="price-row">
              <span className="label">수수료 및 세금</span>
              <span className="value">
                ₩{formatPrice(serviceFee + tax)}
              </span>
            </div>

            {/* 🔥 포인트는 회원만 */}
            {!isGuestMode && usedPoints > 0 && (
              <div className="price-row points">
                <span className="label">포인트 사용</span>
                <span className="value">
                  - ₩{formatPrice(usedPoints)}
                </span>
              </div>
            )}

            <div className="price-row total">
              <span className="label">총 결제 금액</span>
              <span className="value">
                ₩{formatPrice(payableAmount)}
              </span>
            </div>
          </div>

          {/* 🔥 포인트 영역 (회원 전용) */}
          {!isGuestMode && (
            <div className="points-section">
              <p>보유 포인트: {formatPrice(points)}P</p>
              <button
                className="btn--outline"
                onClick={handleUsePoints}
              >
                {usedPoints > 0 ? "사용 취소" : "포인트 사용"}
              </button>
            </div>
          )}

          {/* =====================================================
              🔥 결제 버튼
          ===================================================== */}
          <button
            disabled={!formData.agree}
            onClick={handlePayClick}
            className={`btn--primary btn--lg ${
              !formData.agree ? "disabled" : ""
            }`}
            style={{
              opacity: formData.agree ? 1 : 0.6,
              cursor: formData.agree ? "pointer" : "not-allowed",
            }}
          >
            ₩{formatPrice(payableAmount)} 결제하기
          </button>
        </div>
      </div>

      {/* =====================================================
          🔥 비회원 정보 입력 모달
      ===================================================== */}
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
                value={guestInfo.name}
                onChange={(e) =>
                  setGuestInfo({
                    ...guestInfo,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-row">
              <label>이메일</label>
              <input
                value={guestInfo.email}
                onChange={(e) =>
                  setGuestInfo({
                    ...guestInfo,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-row">
              <label>연락처</label>
              <input
                value={guestInfo.phone}
                onChange={(e) =>
                  setGuestInfo({
                    ...guestInfo,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn--primary"
                onClick={handleGuestSubmit}
              >
                확인 및 결제
              </button>
              <button onClick={() => setGuestModalOpen(false)}>
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
