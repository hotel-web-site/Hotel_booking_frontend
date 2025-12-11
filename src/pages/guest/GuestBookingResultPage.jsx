import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../styles/pages/guest/GuestBookingResultPage.scss";

// ===============================
// ⭐ 실제 API 연동 대비 Mock 함수
// ===============================
async function cancelGuestBooking(bookingNumber) {
    // 실제 API 호출 형태 예시
    // return await axios.post("/api/guest/cancel", { bookingNumber });

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 600);
    });
}

const GuestBookingResultPage = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const name = params.get("name") || "비회원";
    const phone = params.get("phone") || "-";
    const bookingNumber = params.get("bookingNumber") || "HTL-20251212-9999";

    // Mock 데이터 (API 사용 시 교체 가능)
    const mockData = {
        hotelName: "Seoul Grand Hotel",
        roomName: "Deluxe Double Room",
        bookingNumber,
        name,
        phone,
        email: "guest@example.com",
        checkIn: "2025-12-12",
        checkOut: "2025-12-15",
        nights: 3,
        guests: { adults: 2, children: 1 },
        paymentMethod: "신용카드 (국민카드)",
        paymentDate: "2025-12-01 14:22",
        vat: 20000,
        price: 340000,
        totalPrice: 360000,
        status: "예약완료",
        extras: ["조식 포함", "수영장 이용권", "무료 주차"],
        requestNote: "높은 층으로 부탁드립니다.",
    };

    // ===============================
    // 🔥 예약 취소 버튼 눌렀을 때
    // ===============================
    const handleCancel = async () => {
        setLoading(true);
        const res = await cancelGuestBooking(mockData.bookingNumber);
        setLoading(false);

        if (res.success) {
            setShowModal(true);
        } else {
            alert("예약 취소 중 오류가 발생했습니다.");
        }
    };

    // ===============================
    // 🔥 팝업 확인 → 메인 이동
    // ===============================
    const handleConfirm = () => {
        setShowModal(false);
        navigate("/");
    };

    return (
        <div className="guest-booking-result">
            <h1>비회원 예약 조회 결과</h1>

            {/* ============================  
                상단 정보 박스
            ============================= */}
            <div className="info-section">
                <div className="info-block">
                    <div className="label">예약번호</div>
                    <div className="value">{mockData.bookingNumber}</div>
                </div>

                <div className="info-block">
                    <div className="label">이름</div>
                    <div className="value">{mockData.name}</div>
                </div>

                <div className="info-block">
                    <div className="label">전화번호</div>
                    <div className="value">{mockData.phone}</div>
                </div>

                <div className="info-block">
                    <div className="label">이메일</div>
                    <div className="value">{mockData.email}</div>
                </div>
            </div>

            <div className="section-title">예약 정보</div>

            {/* ============================  
                상세 정보 박스
            ============================= */}
            <div className="detail-section">
                <div className="row"><span>호텔명</span><strong>{mockData.hotelName}</strong></div>
                <div className="row"><span>객실명</span><strong>{mockData.roomName}</strong></div>
                <div className="row"><span>숙박일</span><strong>{mockData.checkIn} ~ {mockData.checkOut} ({mockData.nights}박)</strong></div>
                <div className="row"><span>인원</span><strong>성인 {mockData.guests.adults}명 · 어린이 {mockData.guests.children}명</strong></div>
                <div className="row"><span>부가 서비스</span><strong>{mockData.extras.join(" · ")}</strong></div>
                <div className="row"><span>요청사항</span><strong>{mockData.requestNote}</strong></div>
                <div className="row"><span>결제수단</span><strong>{mockData.paymentMethod}</strong></div>
                <div className="row"><span>결제일시</span><strong>{mockData.paymentDate}</strong></div>
                <div className="row"><span>예약상태</span><strong>{mockData.status}</strong></div>
            </div>

            {/* ============================  
                금액 요약 박스
            ============================= */}
            <div className="price-box">
                <div className="price-row">
                    <span>객실 금액</span>
                    <strong>₩{mockData.price.toLocaleString()}</strong>
                </div>
                <div className="price-row">
                    <span>VAT</span>
                    <strong>₩{mockData.vat.toLocaleString()}</strong>
                </div>

                <div className="divider-line"></div>

                <div className="price-row total">
                    <span>총 결제 금액</span>
                    <strong>₩{mockData.totalPrice.toLocaleString()}</strong>
                </div>
            </div>

            {/* ============================  
                취소 버튼
            ============================= */}
            <div className="action-buttons">
                <button className="btn cancel" onClick={handleCancel} disabled={loading}>
                    {loading ? "처리 중..." : "예약 취소하기"}
                </button>
            </div>

            {/* ============================  
                🔥 모달 팝업
            ============================= */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>예약이 취소되었습니다.</h3>
                        <button className="btn confirm" onClick={handleConfirm}>
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestBookingResultPage;
