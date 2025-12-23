
import React from "react";
import "../../styles/mypage/MyPaymentPage.scss";
import ProfilePage from "./ProfilePage";
import PaymentContent from "../../components/payment/PaymentContent";
import useMyPaymentPage from "./hooks/useMyPaymentPage";

const MyPaymentPage = () => {
  const {
    user,
    profileImage,
    coverImage,
    cards,
    handleAddCard,
    handleDeleteCard,
  } = useMyPaymentPage();

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