import "../../styles/mypage/MyBookingDetailPage.scss";
import React from "react";
import ProfilePage from "./ProfilePage";
import useMyBookingsPage from "./hooks/useMyBookingsPage";

const MyBookingsPage = () => {
  const {
    user,
    loading,
    filterStatus,
    setFilterStatus,
    filteredBookings,
    navigate,
  } = useMyBookingsPage();

  return (
    <div className="booking-detail-page">
      <ProfilePage
        coverImage={user?.coverImg}
        profileImage={user?.profileImg}
        name={user?.name || "사용자"}
        email={user?.email}
        activeTab="booking"
      />
      <h2 className="title">예약 내역</h2>
      <div className="filter-box">
        <div className="filter-label">상태</div>
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">전체 내역</option>
          <option value="pendingPayment">결제 대기</option>
          <option value="confirmed">예약 확정</option>
          <option value="completed">이용 완료</option>
          <option value="cancelled">취소된 예약</option>
        </select>
      </div>
      <div className="booking-list">
        {loading ? (
          <p className="empty">데이터를 불러오는 중입니다...</p>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-box" style={{ textAlign: 'center', padding: '50px 0' }}>
            <p className="empty">해당 상태의 예약이 없습니다.</p>
          </div>
        ) : (
          filteredBookings.map((item) => (
            <div
              className="booking-card"
              key={item._id}
              onClick={() => navigate(`/mypage/bookings/${item._id}`)}
            >
              <div className="left">
                <div className="left-wrap">
                  <p className="hotel-name">{item.hotel?.name}</p>
                  <img
                    src={item.hotel?.images?.[0] || "/default-hotel.jpg"}
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
                  <p>체크인 <span>15:00 이후</span></p>
                  <p>체크아웃 <span>11:00 이전</span></p>
                </div>
                <div className={`status ${item.status}`}>
                  {item.status === "pendingPayment" ? "결제 대기" :
                    item.status === "confirmed" ? "예약 확정" :
                      item.status === "cancelled" ? "취소됨" : "이용 완료"}
                </div>
                <div className="price-info" style={{ marginTop: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                  결제 금액: ₩{item.totalPrice?.toLocaleString()}
                </div>
                <div className="btn-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <button className="download-btn" onClick={(e) => { e.stopPropagation(); alert("티켓 다운로드 준비중"); }}>
                    티켓 다운로드
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;