import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "../../styles/components/booking/BookingStepPayment.scss";
import { getHotelDetail, getHotelRooms, createBookingRequest } from "../../api/hotelClient";
import PaymentContent from "../../components/payment/PaymentContent";

const BookingStepPayment = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isGuestMode = location.pathname.includes("-guest") || searchParams.get("guest") === "1";
  const basePath = isGuestMode ? "/booking-guest" : "/booking";

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "", phone: "" });
  const [cards, setCards] = useState([{ id: 1, last4: "4321", exp: "02/27", brand: "visa" }]);
  const [formData, setFormData] = useState({ agree: false });
  const [points, setPoints] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);

  const roomId = searchParams.get("roomId");

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
          getHotelRooms(hotelId)
        ]);
        if (hotelRes) setHotel(hotelRes);
        const roomList = Array.isArray(roomListRes) ? roomListRes : roomListRes.list || [];
        const found = roomList.find((r) => String(r._id || r.id) === String(roomId));
        if (found) setRoom(found);
        else navigate(`${basePath}/${hotelId}/room?${searchParams.toString()}`);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hotelId, roomId, navigate, searchParams, basePath]);

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = Number(searchParams.get("adults") || 2);
  const children = Number(searchParams.get("children") || 0);
  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000) : 0;

  const priceRoom = room?.price ?? 0;
  const totalPrice = priceRoom * nights;
  const serviceFee = Math.floor(totalPrice * 0.1);
  const tax = Math.floor(totalPrice * 0.1);
  const finalTotal = totalPrice + serviceFee + tax;
  const payableAmount = Math.max(finalTotal - usedPoints, 0);

  const formatPrice = (p) => new Intl.NumberFormat("ko-KR").format(Number(p));

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

  const executeBooking = async (additionalInfo = {}) => {
    try {
      const bookingRequestData = {
        hotel: hotelId,
        room: roomId,
        checkIn,
        checkOut,
        guests: { adults, children },
        totalPrice: payableAmount,
        paymentInfo: {
          provider: "card",
          orderId: `ORD_${Date.now()}`,
          cardLast4: cards[0]?.last4
        },
        ...additionalInfo
      };

      const result = await createBookingRequest(bookingRequestData, isGuestMode);
      if (!result) return;

      if (!isGuestMode) {
        const remaining = points - usedPoints;
        const earned = Math.floor(payableAmount * 0.001);
        localStorage.setItem("userPoints", remaining + earned);
      }

      const finalParams = new URLSearchParams(searchParams);
      const bId = result._id || result.id;
      finalParams.set("bookingId", bId);
      if (isGuestMode) finalParams.set("guest", "1");

      navigate(`${basePath}/${hotelId}/complete?${finalParams.toString()}`);
    } catch (err) {
      alert("예약 실패: " + err.message);
    }
  };

  const handlePayClick = () => {
    // 💡 약관 동의 검증 강화
    if (!formData.agree) {
      alert("이용약관 및 개인정보처리방침에 동의해주세요.");
      return;
    }
    if (cards.length === 0) return alert("결제 수단을 등록해주세요.");

    if (isGuestMode) {
      setGuestModalOpen(true);
    } else {
      if (window.confirm(`${formatPrice(payableAmount)}원을 결제하시겠습니까?`)) {
        executeBooking();
      }
    }
  };

  const handleGuestSubmit = () => {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      return alert("모든 정보를 입력해주세요.");
    }
    executeBooking({
      guestName: guestInfo.name,
      guestEmail: guestInfo.email,
      guestPhone: guestInfo.phone
    });
  };

  if (loading) return <div className="booking-payment loading">정보를 불러오는 중입니다...</div>;

  return (
    <div className="booking-payment">
      <div className="booking-content">
        <PaymentContent
          cards={cards}
          onAddCard={(newCard) => setCards([...cards, newCard])}
          onDeleteCard={(id) => setCards(cards.filter(c => c.id !== id))}
        />
        <div className="payment-section">
          <div className="section-card terms-section">
            <h3>약관 동의</h3>
            <div className="term-item">
              <input
                type="checkbox"
                id="agree"
                checked={formData.agree}
                onChange={(e) => setFormData({ agree: e.target.checked })}
              />
              <label htmlFor="agree" style={{ cursor: "pointer" }}>이용약관 및 개인정보처리방침에 동의합니다. (필수)</label>
            </div>
          </div>
          <button className="btn-back" onClick={() => navigate(-1)}>← 이전 단계로</button>
        </div>
        <div className="payment-summary">
          <h3>예약 요약</h3>
          {hotel && (
            <div className="booking-details">
              <div className="detail-item"><span className="label">호텔명</span><span className="value">{hotel.name}</span></div>
              <div className="detail-item"><span className="label">주소</span><span className="value">{hotel.address}</span></div>
            </div>
          )}
          <div className="booking-details">
            <div className="detail-item"><span className="label">체크인</span><span className="value">{new Date(checkIn).toLocaleDateString()}</span></div>
            <div className="detail-item"><span className="label">체크아웃</span><span className="value">{new Date(checkOut).toLocaleDateString()}</span></div>
            <div className="detail-item"><span className="label">숙박 기간</span><span className="value">{nights}박</span></div>
            <div className="detail-item"><span className="label">투숙객</span><span className="value">성인 {adults}명{children > 0 && ` / 어린이 ${children}명`}</span></div>
          </div>
          <div className="price-breakdown">
            <div className="price-row"><span className="label">객실 합계</span><span className="value">₩{formatPrice(totalPrice)}</span></div>
            <div className="price-row"><span className="label">수수료 및 세금</span><span className="value">₩{formatPrice(serviceFee + tax)}</span></div>
            {!isGuestMode && usedPoints > 0 && <div className="price-row points"><span className="label">포인트 사용</span><span className="value">- ₩{formatPrice(usedPoints)}</span></div>}
            <div className="price-row total"><span className="label">총 결제 금액</span><span className="value">₩{formatPrice(payableAmount)}</span></div>
          </div>
          {!isGuestMode && (
            <div className="points-section">
              <p>보유 포인트: {formatPrice(points)}P</p>
              <button className="btn--outline" onClick={handleUsePoints}>{usedPoints > 0 ? "사용 취소" : "포인트 사용"}</button>
            </div>
          )}

          {/* 💡 약관 동의 시에만 버튼 활성화 및 스타일 변경 */}
          <button
            disabled={!formData.agree}
            onClick={handlePayClick}
            className={`btn--primary btn--lg ${!formData.agree ? "disabled" : ""}`}
            style={{
              opacity: formData.agree ? 1 : 0.6,
              cursor: formData.agree ? "pointer" : "not-allowed"
            }}
          >
            ₩{formatPrice(payableAmount)} 결제하기
          </button>
        </div>
      </div>

      {/* 비회원 모달 */}
      {guestModalOpen && (
        <div className="guest-modal-backdrop" onClick={() => setGuestModalOpen(false)}>
          <div className="guest-modal" onClick={(e) => e.stopPropagation()}>
            <h3>비회원 정보 입력</h3>
            <div className="input-row"><label>이름</label><input value={guestInfo.name} onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })} /></div>
            <div className="input-row"><label>이메일</label><input value={guestInfo.email} onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })} /></div>
            <div className="input-row"><label>연락처</label><input value={guestInfo.phone} onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })} /></div>
            <div className="modal-actions">
              <button className="btn--primary" onClick={handleGuestSubmit}>확인 및 결제</button>
              <button onClick={() => setGuestModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStepPayment;