import "../../styles/mypage/MyBookingDetailPage.scss";
import React, { useState, useEffect } from "react";
import ProfilePage from "./ProfilePage";

const MyBookingDetailPage = ({ bookings = [] }) => {
  // ⭐ 프로필/커버 이미지
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // ⭐ form (이름 / 이메일 표시용)
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // ⭐ 마운트 시 user 정보 불러오기 (MyAccountPage와 동일한 로직)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      setForm({
        name: user.name || "",
        email: user.email || "",
      });

      if (user.profileImage) setProfileImage(user.profileImage);
      if (user.coverImage) setCoverImage(user.coverImage);
    }
  }, []);

  // ⭐ 이미지 업로드 핸들러
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(URL.createObjectURL(file));
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  return (
    <div className="booking-detail-page">

      {/* ⭐ 공통 프로필 헤더 */}
      <ProfilePage
        coverImage={coverImage}
        profileImage={profileImage}
        name={form.name}
        email={form.email}
        activeTab="booking"
        onCoverUpload={handleCoverUpload}
        onProfileUpload={handleProfileUpload}
      />

      <h2 className="title">예약내역</h2>

      <div className="filter-box">
        <div className="filter-label">객실</div>
        <div className="filter-select">Upcoming ▼</div>
      </div>

      <div className="booking-list">
        {bookings.length === 0 && (
          <p className="empty">예약 내역이 없습니다.</p>
        )}

        {bookings.map((item, index) => (
          <div className="booking-card" key={index}>
            <div className="left">
              <img
                src={item.image}
                alt="room"
                className="booking-img"
              />

              <div className="date-info">
                <p className="check-title">Check-In</p>
                <p className="check-date">{item.checkIn}</p>

                <p className="check-title">Check Out</p>
                <p className="check-date">{item.checkOut}</p>
              </div>
            </div>

            <div className="right">
              <div className="time-info">
                <p>체크인 <span>{item.checkInTime}</span></p>
                <p>체크아웃 <span>{item.checkOutTime}</span></p>
              </div>

              <div className="status">{item.status}</div>

              <button className="download-btn">Download Ticket</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingDetailPage;
