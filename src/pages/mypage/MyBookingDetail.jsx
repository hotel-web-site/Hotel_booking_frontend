import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/mypage/MyBookingDetail.scss";

const MyBookingDetail = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("bookings") || "[]");
        const found = stored.find((b) => b.id === bookingId);
        setBooking(found || null);
    }, [bookingId]);

    if (!booking) {
        return <div className="booking-detail">예약 정보를 찾을 수 없습니다.</div>;
    }

    const {
        hotel,
        room,
        checkIn,
        checkOut,
        payment,
        guests,
        status,
        createdAt,
    } = booking;

    const nights = payment?.nights || 1;

    const formatPrice = (p) =>
        new Intl.NumberFormat("ko-KR").format(Number(p));

    const handleCancel = () => {
        if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;

        const list = JSON.parse(localStorage.getItem("bookings") || "[]");
        const updated = list.map((b) =>
            b.id === bookingId ? { ...b, status: "취소됨" } : b
        );

        localStorage.setItem("bookings", JSON.stringify(updated));

        alert("예약이 취소되었습니다.");
        navigate("/mypage/bookings"); // 예약 목록으로 이동
    };

    return (
        <div className="booking-detail-page">

            <h1>예약 상세 정보</h1>

            <div className="detail-card">

                {/* 호텔 정보 */}
                <div className="section">
                    <h2>호텔 정보</h2>
                    <div className="hotel-info">
                        <img src={hotel.images?.[0] || hotel.image} alt={hotel.name} />
                        <div>
                            <div className="name">{hotel.name}</div>
                            <div className="address">{hotel.address}</div>
                        </div>
                    </div>
                </div>

                {/* 예약 정보 */}
                <div className="section">
                    <h2>예약 정보</h2>
                    <div className="info-grid">
                        <div>
                            <label>예약 번호</label>
                            <div>{bookingId}</div>
                        </div>

                        <div>
                            <label>체크인</label>
                            <div>{new Date(checkIn).toLocaleDateString("ko-KR")}</div>
                        </div>

                        <div>
                            <label>체크아웃</label>
                            <div>{new Date(checkOut).toLocaleDateString("ko-KR")}</div>
                        </div>

                        <div>
                            <label>숙박일</label>
                            <div>{nights}박</div>
                        </div>

                        <div>
                            <label>투숙객</label>
                            <div>
                                성인 {guests.adults}명
                                {guests.children > 0 && ` / 어린이 ${guests.children}명`}
                            </div>
                        </div>

                        <div>
                            <label>상태</label>
                            <div className={`status ${status}`}>{status}</div>
                        </div>
                    </div>
                </div>

                {/* 객실 정보 */}
                <div className="section">
                    <h2>객실 정보</h2>
                    <div className="info-grid">
                        <div>
                            <label>객실명</label>
                            <div>{room.name}</div>
                        </div>

                        <div>
                            <label>크기</label>
                            <div>{room.size}</div>
                        </div>

                        <div>
                            <label>침대</label>
                            <div>{room.bedType}</div>
                        </div>
                    </div>
                </div>

                {/* 가격 정보 */}
                <div className="section">
                    <h2>결제 내역</h2>
                    <div className="price-list">
                        <div className="price-row">
                            <span>₩{formatPrice(room.price)} × {nights}박</span>
                            <span>₩{formatPrice(room.price * nights)}</span>
                        </div>
                        <div className="price-row">
                            <span>서비스 수수료</span>
                            <span>₩{formatPrice(payment.serviceFee)}</span>
                        </div>
                        <div className="price-row">
                            <span>세금</span>
                            <span>₩{formatPrice(payment.tax)}</span>
                        </div>
                        <div className="price-row total">
                            <span>총 결제 금액</span>
                            <span>₩{formatPrice(payment.roomPrice * nights + payment.serviceFee + payment.tax)}</span>
                        </div>
                    </div>
                </div>

                {/* 취소 버튼 */}
                {status !== "취소됨" ? (
                    <button className="btn-cancel" onClick={handleCancel}>
                        예약 취소하기
                    </button>
                ) : (
                    <div className="cancelled-msg">이미 취소된 예약입니다.</div>
                )}
            </div>

        </div>
    );
};

export default MyBookingDetail;
