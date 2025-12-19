import React, { useState, useEffect } from "react";
import "../../styles/mypage/MyPaymentPage.scss";
import ProfilePage from "./ProfilePage";
import PaymentContent from "../../components/payment/PaymentContent";

const MyPaymentPage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // 1. 유저 정보 로드
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser({ name: u.name, email: u.email });
        // 키값이 다를 수 있으므로 체크 (profileImg vs profileImage)
        setProfileImage(u.profileImg || u.profileImage);
        setCoverImage(u.coverImg || u.coverImage);
      } catch (e) { console.error("User 파싱 에러", e); }
    }

    // 2. 저장된 카드 정보 로드
    const storedCards = localStorage.getItem("user_cards");
    if (storedCards) {
      try {
        setCards(JSON.parse(storedCards));
      } catch (e) { console.error("Cards 파싱 에러", e); }
    }
  }, []);

  const handleAddCard = (newCard) => {
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem("user_cards", JSON.stringify(updatedCards));
  };

  const handleDeleteCard = (id) => {
    if (window.confirm("이 결제 수단을 삭제하시겠습니까?")) {
      const updatedCards = cards.filter((card) => card.id !== id);
      setCards(updatedCards);
      localStorage.setItem("user_cards", JSON.stringify(updatedCards));
    }
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

      <PaymentContent
        cards={cards}
        onAddCard={handleAddCard}
        onDeleteCard={handleDeleteCard}
      />
    </div>
  );
};

export default MyPaymentPage;