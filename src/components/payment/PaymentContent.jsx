
import React from "react";
import "../../styles/components/payment/PaymentContent.scss";
import usePaymentForm from "./hooks/usePaymentForm";


const PaymentContent = ({ cards = [], onAddCard, onDeleteCard }) => {
  const {
    form,
    setForm,
    showModal,
    setShowModal,
    handleInputCardNumber,
    handleInputExp,
    handleInput,
    handleSubmitCard
  } = usePaymentForm(onAddCard);

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
                maxLength={19}
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