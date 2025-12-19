import "../../styles/mypage/MyBookingDetailPage.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import { getMyBookings } from "../../api/hotelClient";
import axiosInstance from "../../api/axiosConfig";

const MyBookingsPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 초기 상태를 '전체'로 설정하여 모든 예약이 바로 보이게 합니다.
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, bookingData] = await Promise.all([
          axiosInstance.get("/users/me"),
          getMyBookings()
        ]);

        setUser(userRes.data.data);
        setBookings(bookingData || []);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBookings = bookings.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

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
            {/* 💡 숙소 둘러보기 버튼 제거됨 */}
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