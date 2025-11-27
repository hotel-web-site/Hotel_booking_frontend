import React, { useState, useEffect } from "react";
import "../../styles/mypage/MyPaymentPage.scss";
import ProfilePage from "./ProfilePage";

const MyPaymentPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [cards, setCards] = useState([]);

  const [form, setForm] = useState({
    cardNumber: "",
    exp: "",
    cvc: "",
    name: "",
    country: "",
    saveInfo: false,
  });

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

  const handleInput = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateCardNumber = (number) => {
    const digits = number.replace(/\s+/g, "");
    let sum = 0;
    let dbl = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i]);
      if (dbl) {
        n = n * 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      dbl = !dbl;
    }
    return sum % 10 === 0;
  };

  const handleAddCard = () => {
    if (!validateCardNumber(form.cardNumber)) {
      alert("유효하지 않은 카드번호입니다.");
      return;
    }

    setCards((prev) => [
      ...prev,
      {
        last4: form.cardNumber.slice(-4),
        exp: form.exp,
        brand: "VISA",
      },
    ]);

    setShowModal(false);
  };

  return (
    <div className="payment-page">
      <ProfilePage
        activeTab="payment"
        coverImage={coverImage}
        profileImage={profileImage}
        name={user.name}
        email={user.email}
      />

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
          Add a new card
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
              <label className="floating-label">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={form.cardNumber}
                onChange={(e) => handleInput("cardNumber", e.target.value)}
              />
            </div>

            <div className="row">
              <div className="input-wrap">
                <label className="floating-label">Exp. Date</label>
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
              <label className="floating-label">Name on Card</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => handleInput("name", e.target.value)}
              />
            </div>

            <div className="input-wrap">
              <label className="floating-label">Country or Region</label>
              <select
                value={form.country}
                onChange={(e) => handleInput("country", e.target.value)}
              >
                <option value="">Select country</option>
                <option value="KR">South Korea</option>
                <option value="US">United States</option>
                <option value="JP">Japan</option>
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
              Add Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPaymentPage;
