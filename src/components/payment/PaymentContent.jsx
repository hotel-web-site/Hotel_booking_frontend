// src/components/payment/PaymentContent.jsx
import React, { useState } from "react";
import "../../styles/components/payment/PaymentContent.scss";

const PaymentContent = () => {
  const [cards, setCards] = useState([]);

  const [form, setForm] = useState({
    cardNumber: "",
    exp: "",
    cvc: "",
    name: "",
    country: "",
    saveInfo: false,
  });

  const [showModal, setShowModal] = useState(false);


  // 카드번호 4자리마다 자동 공백
  const handleInputCardNumber = (value) => {
    let onlyNum = value.replace(/\D/g, "").slice(0, 16);
    let formatted = onlyNum.replace(/(\d{4})(?=\d)/g, "$1 ");
    setForm((prev) => ({ ...prev, cardNumber: formatted }));
  };


  // 만료일 MM/YY 자동 포맷팅
  const handleInputExp = (value) => {
    let onlyNum = value.replace(/[^0-9]/g, "").slice(0, 4);
    let formatted = onlyNum;
    if (onlyNum.length > 2) {
      formatted = onlyNum.slice(0, 2) + "/" + onlyNum.slice(2);
    }
    else if (onlyNum.length > 0 && onlyNum.length <= 2) {
      formatted = onlyNum;
    }
    setForm((prev) => ({ ...prev, exp: formatted }));
  };

  const handleInput = (key, value) => {
    if (key === "cardNumber") {
      handleInputCardNumber(value);
    } else if (key === "exp") {
      handleInputExp(value);
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Luhn 알고리즘으로 카드 번호 유효성 검사
  const validateCardNumber = (number) => {
    const digits = number.replace(/\s+/g, "");
    let sum = 0;
    let dbl = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10);
      if (Number.isNaN(n)) return false;

      if (dbl) {
        n = n * 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      dbl = !dbl;
    }
    return sum % 10 === 0;
  };

  const handleSubmitCard = () => {
    if (!validateCardNumber(form.cardNumber)) {
      alert("유효하지 않은 카드번호입니다.");
      return;
    }

    setCards((prev) => [
      ...prev,
      {
        id: Date.now(), // 간단한 고유 id
        last4: form.cardNumber.slice(-4),
        exp: form.exp,
        brand: "VISA",
      },
    ]);

    // 폼 리셋
    setForm({
      cardNumber: "",
      exp: "",
      cvc: "",
      name: "",
      country: "",
      saveInfo: false,
    });

    setShowModal(false);
  };

  const handleDeleteCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="payment-content">
      {/* 상단 헤더 */}
      <div className="payment-header">
        <h2 className="payment-title">결제수단</h2>
        <div className="filter-dropdown">
          <select>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className="cards-container">
        {cards.map((card) => (
          <div key={card.id} className="card-item">
            <div className="card-visual">
              <div className="card-number">**** **** ****</div>
              <div className="card-last4">{card.last4}</div>
              <div className="card-footer">
                <div className="card-expiry">
                  <div className="expiry-label">Valid Thru</div>
                  <div className="expiry-date">{card.exp}</div>
                </div>
                <div className="card-logo">
                  {(card.brand || "").toUpperCase()}
                </div>
              </div>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteCard(card.id)}
              type="button"
            >
              🗑️
            </button>
          </div>
        ))}

        {/* 새 카드 추가 카드 */}
        <div className="add-card-item" onClick={openModal}>
          <div className="add-card-circle">
            <span className="add-icon">+</span>
          </div>
          <div className="add-card-text">Add a new card</div>
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()} // 모달 안 클릭 시 닫힘 방지
          >
            <div className="modal-header">
              <h2>카드추가</h2>
              <button className="close" onClick={closeModal} type="button">
                ✕
              </button>
            </div>

            <div className="input-wrap">
              <label className="floating-label">카드 번호</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={form.cardNumber}
                onChange={(e) => handleInput("cardNumber", e.target.value)}
                maxLength={19} // 16자리+공백 3개
                autoComplete="cc-number"
                inputMode="numeric"
              />
            </div>

            <div className="row">
              <div className="input-wrap">
                <label className="floating-label">만료일</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={form.exp}
                  onChange={(e) => handleInput("exp", e.target.value)}
                  maxLength={5}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                />
              </div>

              <div className="input-wrap">
                <label className="floating-label">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  value={form.cvc}
                  onChange={e => {
                    // 숫자만, 3자리 제한
                    let v = e.target.value.replace(/\D/g, "").slice(0, 3);
                    handleInput("cvc", v);
                  }}
                  maxLength={3}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                />
              </div>
            </div>

            <div className="input-wrap">
              <label className="floating-label">카드 명의자 이름</label>
              <input
                type="text"
                placeholder="홍길동"
                value={form.name}
                onChange={(e) => handleInput("name", e.target.value)}
              />
            </div>

            <div className="input-wrap">
              <label className="floating-label">국가 또는 지역</label>
              <select
                value={form.country}
                onChange={(e) => handleInput("country", e.target.value)}
              >
                <option value="">국가 선택</option>
                <option value="KR">대한민국</option>
                <option value="US">미국</option>
                <option value="JP">일본</option>
              </select>
            </div>

            

            <button
              className="submit-btn"
              onClick={handleSubmitCard}
              type="button"
            >
              카드 추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentContent;
