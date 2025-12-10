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

      {/* 결제수단 공통 컴포넌트 */}
      <PaymentContent />
    </div>
  );
};

export default MyPaymentPage;
