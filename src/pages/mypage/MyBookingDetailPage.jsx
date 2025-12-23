
import "../../styles/mypage/MyBookingDetailPage.scss";
import React from "react";
import ProfilePage from "./ProfilePage";
import useMyBookingDetailPage from "./hooks/useMyBookingDetailPage";

const MyBookingDetailPage = () => {
  const {
    coverImage,
    profileImage,
    form,
    filterStatus,
    setFilterStatus,
    filteredBookings,
    handleCoverUpload,
    handleProfileUpload,
    handleCancel,
    handleRebook,
    navigate,
  } = useMyBookingDetailPage();

  return (
    <div className="booking-detail-page">
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
                    handleCancel(item.id);
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
                    handleRebook(item.hotel && item.hotel.id);
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


