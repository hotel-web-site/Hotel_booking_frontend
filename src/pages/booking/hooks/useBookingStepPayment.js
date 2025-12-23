import { useState, useEffect } from "react";
import {
    useParams,
    useNavigate,
    useSearchParams,
    useLocation,
} from "react-router-dom";
import {
    getHotelDetail,
    getHotelRooms,
    createBookingRequest,
} from "../../../api/hotelClient";

export default function useBookingStepPayment() {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    /* =====================================================
       🔥 비회원 판단
    ===================================================== */
    const isGuestMode =
        location.pathname.includes("-guest") ||
        searchParams.get("guest") === "1";

    const basePath = isGuestMode ? "/booking-guest" : "/booking";

    /* =====================================================
       🔹 상태
    ===================================================== */
    const [hotel, setHotel] = useState(null);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    const [guestModalOpen, setGuestModalOpen] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [cards, setCards] = useState([
        { id: 1, last4: "4321", exp: "02/27", brand: "visa" },
    ]);

    const [formData, setFormData] = useState({ agree: false });

    const [points, setPoints] = useState(0);
    const [usedPoints, setUsedPoints] = useState(0);

    const roomId = searchParams.get("roomId");

    /* =====================================================
       🔹 호텔 / 객실 로딩
    ===================================================== */
    useEffect(() => {
        const fetchData = async () => {
            if (!roomId) {
                navigate(`${basePath}/${hotelId}/room?${searchParams.toString()}`);
                return;
            }

            try {
                setLoading(true);

                const [hotelRes, roomListRes] = await Promise.all([
                    getHotelDetail(hotelId),
                    getHotelRooms(hotelId),
                ]);

                if (hotelRes) setHotel(hotelRes);

                const roomList = Array.isArray(roomListRes)
                    ? roomListRes
                    : roomListRes.list || [];

                const found = roomList.find(
                    (r) => String(r._id || r.id) === String(roomId)
                );

                if (found) setRoom(found);
                else navigate(`${basePath}/${hotelId}/room?${searchParams.toString()}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [hotelId, roomId, navigate, searchParams, basePath]);

    /* =====================================================
       🔹 예약 정보
    ===================================================== */
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adults = Number(searchParams.get("adults") || 2);
    const children = Number(searchParams.get("children") || 0);

    const nights =
        checkIn && checkOut
            ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
            : 0;

    const priceRoom = room?.price ?? 0;
    const totalPrice = priceRoom * nights;
    const serviceFee = Math.floor(totalPrice * 0.1);
    const tax = Math.floor(totalPrice * 0.1);
    const finalTotal = totalPrice + serviceFee + tax;
    const payableAmount = Math.max(finalTotal - usedPoints, 0);

    const formatPrice = (p) =>
        new Intl.NumberFormat("ko-KR").format(Number(p));

    /* =====================================================
       🔹 포인트 (회원만)
    ===================================================== */
    useEffect(() => {
        if (!isGuestMode) {
            const stored = localStorage.getItem("userPoints");
            if (stored) setPoints(Number(stored));
        }
    }, [isGuestMode]);

    const handleUsePoints = () => {
        if (isGuestMode) return;
        setUsedPoints(usedPoints > 0 ? 0 : Math.min(points, finalTotal));
    };

    /* =====================================================
       🔥 예약 실행 (회원 / 비회원 분기)
    ===================================================== */
    const executeBooking = async (extra = {}) => {
        try {
            const bookingRequestData = {
                hotel: hotelId,
                room: roomId,
                checkIn,
                checkOut,
                guests: { adults, children },
                totalPrice: payableAmount,
                ...extra,
            };

            // ✅ 회원 결제 정보
            if (!isGuestMode) {
                bookingRequestData.paymentInfo = {
                    provider: "card",
                    orderId: `ORD_${Date.now()}`,
                    cardLast4: cards[0]?.last4,
                };
            }

            const result = await createBookingRequest(
                bookingRequestData,
                isGuestMode
            );

            if (!result) return;

            if (!isGuestMode) {
                const remaining = points - usedPoints;
                const earned = Math.floor(payableAmount * 0.001);
                localStorage.setItem("userPoints", remaining + earned);
            }

            const params = new URLSearchParams(searchParams);
            const bookingId = result._id || result.id;
            params.set("bookingId", bookingId);
            if (isGuestMode) params.set("guest", "1");

            navigate(`${basePath}/${hotelId}/complete?${params.toString()}`);
        } catch (err) {
            alert("예약 실패: " + err.message);
        }
    };

    /* =====================================================
       🔥 결제 버튼 클릭
    ===================================================== */
    const handlePayClick = () => {
        if (!formData.agree) {
            alert("이용약관 및 개인정보처리방침에 동의해주세요.");
            return;
        }

        if (!isGuestMode && cards.length === 0) {
            alert("결제 수단을 등록해주세요.");
            return;
        }

        if (isGuestMode) {
            setGuestModalOpen(true);
            return;
        }

        if (
            window.confirm(
                `${formatPrice(payableAmount)}원을 결제하시겠습니까?`
            )
        ) {
            executeBooking();
        }
    };

    /* =====================================================
       🔥 비회원 제출
    ===================================================== */
    const handleGuestSubmit = () => {
        if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
            alert("모든 정보를 입력해주세요.");
            return;
        }

        executeBooking({
            guestName: guestInfo.name,
            guestEmail: guestInfo.email,
            guestPhone: guestInfo.phone,
        });
    };

    return {
        hotel,
        room,
        loading,
        isGuestMode,

        guestModalOpen,
        setGuestModalOpen,
        guestInfo,
        setGuestInfo,

        cards,
        setCards,
        formData,
        setFormData,

        points,
        usedPoints,
        handleUsePoints,

        checkIn,
        checkOut,
        adults,
        children,
        nights,

        priceRoom,
        totalPrice,
        serviceFee,
        tax,
        finalTotal,
        payableAmount,

        formatPrice,
        handlePayClick,
        handleGuestSubmit,
    };
}
