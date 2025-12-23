import React from "react";
import "../../styles/pages/guest/GuestBookingResultPage.scss";
import useGuestBookingResultPage from "./hooks/useGuestBookingResultPage";

const GuestBookingResultPage = () => {
    const { showModal, loading, mockData, handleCancel, handleConfirm } = useGuestBookingResultPage();
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
