
import React, { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/components/booking/BookingStepRoom.scss";
import useBookingStepRoom from "./hooks/useBookingStepRoom";

const BookingStepRoom = () => {
  const roomRefs = useRef({});
  const [searchParams] = useSearchParams();
  const {
    isGuest,
    basePath,
    rooms,
    loading,
    selectedRoomId,
    checkIn,
    checkOut,
    adults,
    children,
    nights,
    totalGuests,
    isRoomAvailable,
    handleSelectRoom,
    goToPrevious,
    goToPayment,
  } = useBookingStepRoom();

  if (loading) return <div className="booking-rooms loading">객실 정보를 불러오는 중입니다...</div>;

  return (
    <div className="booking-rooms">
      <div className="booking-header">
        <h1>객실 선택 {isGuest && <span className="guest-tag">(비회원)</span>}</h1>
        <div className="selected-dates">
          <span>
            {checkIn ? new Date(checkIn).toLocaleDateString("ko-KR") : "-"} ~{" "}
            {checkOut ? new Date(checkOut).toLocaleDateString("ko-KR") : "-"}
          </span>
          <span>{nights}박</span>
          <span>성인 {adults}명</span>
          {children > 0 && <span>어린이 {children}명</span>}
        </div>
      </div>

      <div className="room-list">
        {rooms.length === 0 ? (
          <div className="no-rooms">현재 조건에 맞는 객실이 없습니다.</div>
        ) : (
          rooms.map((room) => {
            const roomId = String(room._id || room.id);
            const available = isRoomAvailable(room);
            const isSelected = String(selectedRoomId) === roomId;
            return (
              <div
                key={roomId}
                ref={(el) => (roomRefs.current[roomId] = el)}
                className={`room-card ${isSelected ? "selected" : ""} ${!available ? "disabled" : ""}`}
                onClick={() => handleSelectRoom(room)}
              >
                <div className="room-image">
                  <img
                    src={Array.isArray(room.images) && room.images.length > 0 ? room.images[0] : (room.images || "/default-room.jpg")}
                    alt={room.name}
                  />
                  {room.originalPrice > room.price && <div className="room-badge">특가</div>}
                  {!available && <div className="room-badge soldout">예약 불가</div>}
                </div>
                <div className="room-details">
                  <h3>{room.name}</h3>
                  <p className="room-size">
                    {room.size} · {room.bedType} · 최대 {room.maxGuests || 2}명
                  </p>
                  <div className="room-amenities">
                    {(room.amenities || []).map((a, idx) => (
                      <div key={`${roomId}-amenity-${idx}`} className="amenity">✓ {a}</div>
                    ))}
                  </div>
                  <div className="price-row">
                    <div className="price">
                      ₩{(room.price || 0).toLocaleString()}
                      <span>/박</span>
                      {room.originalPrice > room.price && (
                        <span className="old-price">₩{room.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    {available ? (
                      <button
                        type="button"
                        className={`btn-select ${isSelected ? "selected" : ""}`}
                      >
                        {isSelected ? "선택됨" : "선택하기"}
                      </button>
                    ) : (
                      <button className="btn-disabled" disabled>
                        {Number(room.maxGuests) < totalGuests ? "인원 초과" : "선택 불가"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bottom-action">
        <button className="btn-prev" onClick={goToPrevious}>이전 단계로</button>
        <button
          className="btn-go-payment"
          onClick={goToPayment}
          disabled={!selectedRoomId}
        >
          {!selectedRoomId ? "객실을 선택해 주세요" : "결제 단계로 이동"}
        </button>
      </div>
    </div>
  );
};

export default BookingStepRoom;