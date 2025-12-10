// src/pages/mypage/ProfilePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/mypage/ProfilePage.scss";

const ProfilePage = ({
  coverImage,
  profileImage,
  name,
  email,
  activeTab,
  onCoverUpload,
  onProfileUpload,
}) => {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      {/* Cover Image */}
      <div className="cover-section">
        <img
          className="cover-img"
          src={
            coverImage ||
            "https://images.unsplash.com/photo-1604076913837-52ab5629f2b4?auto=format&fit=crop&w=1200&q=80"
          }
          alt="cover"
        />
      </div>

      {/* 배경 박스 바깥으로 옮긴 COVER 업로드 버튼 */}
      <label className="upload-cover-btn-outside">
        새 커버 이미지 업로드
        <input type="file" accept="image/*" onChange={onCoverUpload} />
      </label>

      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-img-wrap">
          <img
            className="profile-img"
            src={
              profileImage ||
              "https://i.pinimg.com/736x/1d/90/1f/1d901f946d8ac45f1ab0e9021e9200de.jpg"
            }
            alt="profile"
          />

          <label className="profile-upload-btn">
            <input type="file" accept="image/*" onChange={onProfileUpload} />
            <span>✏️</span>
          </label>
        </div>

        <h1 className="profile-name">{name}</h1>
        <p className="profile-email">{email}</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-menu">
        <button
          type="button"
          className={`tab ${activeTab === "account" ? "active" : ""}`}
          onClick={() => navigate("/mypage/account")}
        >
          계정
        </button>

        <button
          type="button"
          className={`tab ${activeTab === "booking" ? "active" : ""}`}
          onClick={() => navigate("/mypage/bookings/:bookingId")}
        >
          내역
        </button>

        <button
          type="button"
          className={`tab ${activeTab === "payment" ? "active" : ""}`}
          onClick={() => navigate("/mypage/payment")}
        >
          결제수단
        </button>

        <button
          type="button"
          className={`tab ${activeTab === "coupons" ? "active" : ""}`}
          onClick={() => navigate("/mypage/coupons")}
        >
          쿠폰
        </button>

        {/* 🔹 새로 추가되는 "내 리뷰" 탭 */}
        <button
          type="button"
          className={`tab ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => navigate("/mypage/reviews")}
        >
          내 리뷰
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
