// src/pages/mypage/MyBookingDetailView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/mypage/MyBookingDetailView.scss";

const MyBookingDetailView = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);

    /* ------------------------------------------------
        예약 데이터 불러오기
    ------------------------------------------------ */
    useEffect(() => {
        const storedBookings = localStorage.getItem("bookings");
        if (!storedBookings) return;

        const bookingList = JSON.parse(storedBookings);

        const found = bookingList.find(
            (item) => String(item.id) === String(bookingId)
        );

        if (!found) {
            alert("예약 정보를 찾을 수 없습니다.");
            navigate("/mypage/bookings");
            return;
        }

        setBooking(found);
    }, [bookingId, navigate]);

    if (!booking) {
        return <div className="booking-detail-view">불러오는 중...</div>;
    }

    const {
        hotel,
        room,
        checkIn,
        checkOut,
        guests,
        payment,
        status,
    } = booking;

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
        });

    const formatPrice = (n) =>
        new Intl.NumberFormat("ko-KR").format(Number(n || 0));

    /* ------------------------------------------------
        예약 취소 기능
    ------------------------------------------------ */
    const handleCancel = () => {
        if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;

        const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

        const updated = storedBookings.map((b) =>
            b.id === booking.id ? { ...b, status: "취소됨" } : b
        );

        localStorage.setItem("bookings", JSON.stringify(updated));

        alert("예약이 취소되었습니다.");
        navigate("/mypage/bookings");
    };

    return (
        <div className="booking-detail-view">
            <h1 className="title">예약 상세 내역</h1>

            {/* 예약 상태 */}
            <div className={`status-box ${status === "취소됨" ? "cancelled" : ""}`}>
                현재 상태: <strong>{status}</strong>
            </div>

            {/* 호텔 정보 */}
            <div className="section hotel-section">
                <h2>🏨 숙소 정보</h2>
                <div className="hotel-info">
                    <img
                        src={hotel.image || hotel.images?.[0]}
                        alt={hotel.name}
                        className="hotel-img"
                    />

                    <div className="text">
                        <div className="hotel-name">{hotel.name}</div>
                        <div className="hotel-address">{hotel.address}</div>
                    </div>
                </div>
            </div>

            {/* 날짜 정보 */}
            <div className="section">
                <h2>📅 예약 날짜</h2>
                <div className="info-grid">
                    <div className="item">
                        <span className="label">체크인</span>
                        <span className="value">{formatDate(checkIn)}</span>
                    </div>

                    <div className="item">
                        <span className="label">체크아웃</span>
                        <span className="value">{formatDate(checkOut)}</span>
                    </div>

                    <div className="item">
                        <span className="label">숙박</span>
                        <span className="value">{payment.nights}박</span>
                    </div>

                    <div className="item">
                        <span className="label">투숙객</span>
                        <span className="value">
                            성인 {guests.adults}명
                            {guests.children > 0 && ` / 어린이 ${guests.children}명`}
                        </span>
                    </div>
                </div>
            </div>

            {/* 객실 정보 */}
            <div className="section">
                <h2>🛏 객실 정보</h2>

                <div className="info-grid">
                    <div className="item">
                        <span className="label">객실명</span>
                        <span className="value">{room.name}</span>
                    </div>

                    <div className="item">
                        <span className="label">크기</span>
                        <span className="value">{room.size}</span>
                    </div>

                    <div className="item">
                        <span className="label">침대</span>
                        <span className="value">{room.bedType}</span>
                    </div>
                </div>
            </div>

            {/* 결제 정보 */}
            <div className="section">
                <h2>💳 결제 정보</h2>

                <div className="price-list">
                    <div className="row">
                        <span>객실 금액</span>
                        <span>₩{formatPrice(payment.roomPrice * payment.nights)}</span>
                    </div>

                    <div className="row">
                        <span>서비스 수수료</span>
                        <span>₩{formatPrice(payment.serviceFee)}</span>
                    </div>

                    <div className="row">
                        <span>세금</span>
                        <span>₩{formatPrice(payment.tax)}</span>
                    </div>

                    <div className="row total">
                        <span>총 결제 금액</span>
                        <span>₩{formatPrice(payment.total)}</span>
                    </div>
                </div>
            </div>

            {/* 버튼 영역 */}
            <div className="action-buttons">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/mypage/bookings")}
                >
                    목록으로 돌아가기
                </button>

                {status !== "취소됨" && (
                    <button className="btn btn-danger" onClick={handleCancel}>
                        예약 취소하기
                    </button>
                )}
            </div>
        </div>
    );
};

export default MyBookingDetailView;
