import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// 실제 API 연동 대비 Mock 함수
async function cancelGuestBooking(bookingNumber) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 600);
    });
}

export default function useGuestBookingResultPage() {
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

    const handleConfirm = () => {
        setShowModal(false);
        navigate("/");
    };

    return {
        showModal,
        loading,
        mockData,
        handleCancel,
        handleConfirm,
    };
}
