import "../../styles/mypage/MyBookingDetailPage.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";

const MyBookingDetailPage = () => {
  const navigate = useNavigate();

  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // ⭐ 전체 예약 목록
  const [bookings, setBookings] = useState([]);

  // ⭐ 상태 필터
  const [filterStatus, setFilterStatus] = useState("예정됨");

  /* ----------------------------------------------------
     유저 정보 + 예약 목록 불러오기
  ---------------------------------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedBookings = localStorage.getItem("bookings");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setForm({ name: user.name || "", email: user.email || "" });

      if (user.profileImage) setProfileImage(user.profileImage);
      if (user.coverImage) setCoverImage(user.coverImage);
    }

    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  /* ----------------------------------------------------
     이미지 업로드
  ---------------------------------------------------- */
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(URL.createObjectURL(file));
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  /* ----------------------------------------------------
     필터링된 예약 목록
  ---------------------------------------------------- */
  const filteredBookings = bookings.filter(
    (item) => item.status === filterStatus
  );

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

      <h2 className="title">예약 내역</h2>

      {/* ⭐ 상태 필터 */}
      <div className="filter-box">
        <div className="filter-label">상태</div>

        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="예정됨">예정된 예약</option>
          <option value="취소됨">취소된 예약</option>
          <option value="완료됨">이용 완료</option>
        </select>
      </div>

      {/* ⭐ 예약 목록 */}
      <div className="booking-list">
        {filteredBookings.length === 0 && (
          <p className="empty">해당 상태의 예약이 없습니다.</p>
        )}

        {filteredBookings.map((item) => (
          <div
            className="booking-card"
            key={item.id}
            onClick={() => navigate(`/mypage/bookings/${item.id}`)}
          >
            {/* LEFT */}
            <div className="left">
              <div className="left-wrap">
                <p className="hotel-name">{item.hotel.name}</p>
                <img
                  src={item.hotel.images?.[0] || item.hotel.image}
                  alt="hotel"
                  className="booking-img"
                />
              </div>
              <div className="date-info">
                <p className="check-title">체크인</p>
                <p className="check-date">
                  {new Date(item.checkIn).toLocaleDateString("ko-KR")}
                </p>
          
                <p className="check-title">체크아웃</p>
                <p className="check-date">
                  {new Date(item.checkOut).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="right">
              <div className="time-info">
                <p>
                  체크인 <span>15:00 이후</span>
                </p>
                <p>
                  체크아웃 <span>11:00 이전</span>
                </p>
              </div>

              <div className={`status ${item.status}`}>
                {item.status}
              </div>

              {item.status !== "취소됨" && (
                <button
                  className="download-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("티켓 다운로드 기능 준비중입니다.");
                  }}
                >
                  티켓 다운로드
                </button>
              )}
              {item.status === "예정됨" && (
                <button
                  className="cancel-btn"
                  style={{ marginTop: "10px" }}
                  onClick={e => {
                    e.stopPropagation();
                    if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;
                    const updated = bookings.map(b =>
                      b.id === item.id ? { ...b, status: "취소됨" } : b
                    );
                    localStorage.setItem("bookings", JSON.stringify(updated));
                    setBookings(updated);
                  }}
                >
                  예약 취소
                </button>
              )}
              {item.status === "취소됨" && (
                <button
                  className="rebook-btn"
                  style={{ marginTop: "10px" }}
                  onClick={e => {
                    e.stopPropagation();
                    // 호텔 상세 페이지로 이동 (호텔 id 필요)
                    if (item.hotel && item.hotel.id) {
                      navigate(`/hotels/${item.hotel.id}`);
                    } else {
                      alert("호텔 정보를 찾을 수 없습니다.");
                    }
                  }}
                >
                  다시 예약하기
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingDetailPage;
