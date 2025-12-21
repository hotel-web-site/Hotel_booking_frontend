import React, { useState } from "react";
import "../../styles/components/payment/PaymentContent.scss";

const PaymentContent = ({ cards = [], onAddCard, onDeleteCard }) => {
  const [form, setForm] = useState({
    cardNumber: "", exp: "", cvc: "", name: "", country: "", saveInfo: false,
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
    let formattedValue = value;
    if (key === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);
    } else if (key === "exp") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(?=\d)/g, "$1/").slice(0, 5);
    } else if (key === "cvc") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }
    setForm((prev) => ({ ...prev, [key]: formattedValue }));
  };

  const validateCardNumber = (number) => {
    const digits = number.replace(/\s+/g, "");
    return digits.length >= 13 && digits.length <= 16 && /^\d+$/.test(digits);
  };

  const handleSubmitCard = () => {
    if (!validateCardNumber(form.cardNumber)) {
      return alert("올바른 카드 번호를 입력해주세요.");
    }
    if (!form.name || form.exp.length < 5) {
      return alert("정보를 모두 입력해주세요.");
    }

    const firstDigit = form.cardNumber[0];
    let brand = "CARD";

    // ⭐ 더 밝고 선명한 컬러 팔레트 적용
    let themeColor = "linear-gradient(135deg, #a1a1a1 0%, #7b7b7b 100%)"; // 기본 그레이

    if (firstDigit === "4") {
      brand = "VISA";
      themeColor = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"; // 밝은 블루 에메랄드
    } else if (firstDigit === "5") {
      brand = "MASTER";
      themeColor = "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"; // 산뜻한 핑크 코랄
    } else {
      // 그 외 카드는 랜덤한 파스텔 톤이나 보라색 계열로 설정 가능
      themeColor = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }

    onAddCard({
      id: Date.now(),
      last4: form.cardNumber.replace(/\s/g, "").slice(-4),
      exp: form.exp,
      brand: brand,
      color: themeColor,
      name: form.name.toUpperCase()
    });

    setForm({ cardNumber: "", exp: "", cvc: "", name: "", country: "", saveInfo: false });
    setShowModal(false);
  };

  return (
    <div className="payment-content">
      <div className="payment-header">
        <h2 className="payment-title">결제수단</h2>
      </div>

      <div className="cards-container">
        {cards.map((card) => (
          <div key={card.id} className="card-item">
            <div
              className={`card-visual ${card.brand.toLowerCase()}`}
              style={{
                background: card.color, // 그라데이션 적용
                borderRadius: "15px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)", // 부드러운 그림자
                position: "relative",
                overflow: "hidden",
                color: "#fff"
              }}
            >
              {/* 카드 칩 디자인 추가 (실제 서비스 느낌) */}
              <div style={{
                position: "absolute",
                top: "25%",
                left: "10%",
                width: "35px",
                height: "25px",
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "4px"
              }}></div>

              <div className="card-number" style={{ letterSpacing: "2px", marginTop: "40px" }}>**** **** ****</div>
              <div className="card-last4" style={{ fontWeight: "bold" }}>{card.last4}</div>

              <div className="card-footer">
                <div className="card-expiry">
                  <div className="expiry-label" style={{ fontSize: "10px", opacity: 0.8 }}>Valid Thru</div>
                  <div className="expiry-date">{card.exp}</div>
                </div>
                <div className="card-logo" style={{ fontWeight: "bold", fontStyle: "italic" }}>{card.brand}</div>
              </div>
            </div>
            <button className="delete-button" onClick={() => onDeleteCard(card.id)}>🗑️</button>
          </div>
        ))}

        <div className="add-card-item" onClick={() => setShowModal(true)}>
          <div className="add-card-circle"><span className="add-icon">+</span></div>
          <div className="add-card-text">Add a new card</div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>카드 추가</h2>
              <button className="close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="input-wrap">
              <label className="floating-label">카드 번호</label>
              <input
                type="text"
                placeholder="4xxx xxxx xxxx xxxx"
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
                <input type="text" placeholder="MM/YY" value={form.exp} onChange={(e) => handleInput("exp", e.target.value)} />
              </div>
              <div className="input-wrap">
                <label className="floating-label">CVC</label>
                <input type="text" placeholder="123" value={form.cvc} onChange={(e) => handleInput("cvc", e.target.value)} />
              </div>
            </div>

            <div className="input-wrap">
              <label className="floating-label">카드 명의자 이름</label>
              <input type="text" placeholder="HONG GILDONG" value={form.name} onChange={(e) => handleInput("name", e.target.value)} />
            </div>

            <div className="input-wrap">
              <label className="floating-label">국가 또는 지역</label>
              <select value={form.country} onChange={(e) => handleInput("country", e.target.value)}>
                <option value="">국가 선택</option>
                <option value="KR">대한민국</option>
                <option value="US">미국</option>
              </select>
            </div>

            <button className="submit-btn" onClick={handleSubmitCard} style={{ marginTop: "20px" }}>카드 추가</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentContent;