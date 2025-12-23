
import React from "react";
import "../../styles/mypage/MyBookingDetailItem.scss";
import useMyBookingDetailItem from "./hooks/useMyBookingDetailItem";

const MyBookingDetailItem = () => {
    const {
        booking,
        nights,
        format,
        handleCancel,
        navigate,
    } = useMyBookingDetailItem();

    if (!booking) {
        return <div className="booking-detail-item">예약 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="booking-detail-item">
            {/* 상단 타이틀 */}
            <h1 className="page-title">예약 상세 정보</h1>

            <div className="booking-wrapper">

                {/* LEFT - 호텔 정보 */}
                <div className="left">
                    <img
                        src={booking.hotel.images?.[0] || booking.hotel.image}
                        alt="hotel"
                        className="hotel-image"
                    />

                    <div className="hotel-box">
                        <h2>{booking.hotel.name}</h2>
                        <p className="address">{booking.hotel.address}</p>
                        <p className="phone">📞 {booking.hotel.phone || "문의처 정보 없음"}</p>
                    </div>

                    <div className="room-box">
                        <h3>객실 정보</h3>
                        <p>{booking.room.name}</p>
                        <p>{booking.room.size}</p>
                        <p>{booking.room.bedType}</p>
                    </div>
                </div>

                {/* RIGHT - 상세 정보 */}
                <div className="right">
                    <div className="info-section">
                        <h3>예약 기간</h3>
                        <p>{format(booking.checkIn)} → {format(booking.checkOut)}</p>
                        <p>{nights}박</p>
                    </div>

                    <div className="info-section">
                        <h3>투숙객</h3>
                        <p>성인 {booking.guests.adults}명</p>
                        {booking.guests.children > 0 && (
                            <p>어린이 {booking.guests.children}명</p>
                        )}
                    </div>

                    <div className="info-section">
                        <h3>결제 금액</h3>
                        <p className="price">₩{booking.totalPrice.toLocaleString()}</p>
                    </div>

                    <div className="info-section">
                        <h3>예약 상태</h3>
                        <p className={`status ${booking.status}`}>{booking.status}</p>
                    </div>

                    {/* 취소 버튼 */}
                    {booking.status !== "취소됨" ? (
                        <button className="btn-cancel" onClick={handleCancel}>
                            예약 취소하기
                        </button>
                    ) : (
                        <button className="btn-disabled" disabled>
                            이미 취소된 예약입니다
                        </button>
                    )}

                    <button className="btn-back" onClick={() => navigate("/mypage/bookings")}> 
                        ← 예약 목록으로
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyBookingDetailItem;
