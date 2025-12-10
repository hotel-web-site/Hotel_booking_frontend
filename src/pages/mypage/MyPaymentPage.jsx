// src/pages/mypage/MyPaymentPage.jsx
import React, { useState, useEffect } from "react";
import "../../styles/mypage/MyPaymentPage.scss";
import ProfilePage from "./ProfilePage";
import PaymentContent from "../../components/payment/PaymentContent";

const MyPaymentPage = () => {
  // 유저 정보 불러오기
  const [user, setUser] = useState({ name: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser({ name: u.name, email: u.email });
      if (u.profileImage) setProfileImage(u.profileImage);
      if (u.coverImage) setCoverImage(u.coverImage);
    }
  }, []);

  return (
    <div className="payment-page">
      <ProfilePage
        activeTab="payment"
        coverImage={coverImage}
        profileImage={profileImage}
        name={user.name}
        email={user.email}
      />

<<<<<<< HEAD
      <h2 className="payment-title">결제수단</h2>

      <div className="card-list">
        {cards.map((c, idx) => (
          <div key={idx} className="card-box">
            <div className="card-number">**** **** **** {c.last4}</div>
            <div className="card-exp">Valid Thru {c.exp}</div>
            <div className="card-brand">{c.brand}</div>
          </div>
        ))}

        <div className="add-card-box" onClick={() => setShowModal(true)}>
          <span className="plus">+</span>
          새 카드 추가
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>카드추가</h2>
              <button className="close" onClick={() => setShowModal(false)}>
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
                />
              </div>

              <div className="input-wrap">
                <label className="floating-label">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  value={form.cvc}
                  onChange={(e) => handleInput("cvc", e.target.value)}
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

            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.saveInfo}
                onChange={(e) => handleInput("saveInfo", e.target.checked)}
              />
              정보 저장하기
            </label>

            <button className="submit-btn" onClick={handleAddCard}>
              카드 추가
            </button>
          </div>
        </div>
      )}
=======
      {/* 결제수단 공통 컴포넌트 */}
      <PaymentContent />
>>>>>>> upstream/main
    </div>
  );
};

export default MyPaymentPage;
