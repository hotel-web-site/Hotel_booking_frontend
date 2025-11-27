import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/mypage/ProfilePage.scss";

const ProfilePage = ({
  coverImage,
  profileImage,
  name,
  email,
  activeTab, // "account" | "booking" | "payment"
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

        <label className="upload-cover-btn">
          Upload new cover
          <input type="file" accept="image/*" onChange={onCoverUpload} />
        </label>
      </div>

      {/* Profile Image, Name, Email */}
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
          onClick={() => navigate("/myaccountpage")}
        >
          계정
        </button>

        <button
          type="button"
          className={`tab ${activeTab === "booking" ? "active" : ""}`}
          onClick={() => navigate("/mybookingdetailpage")}
        >
          내역
        </button>

        <button
          type="button"
          className={`tab ${activeTab === "payment" ? "active" : ""}`}
          onClick={() => navigate("/mypaymentpage")}
        >
          결제수단
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
