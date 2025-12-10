import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/components/booking/BookingStepRoom.scss";
import { getHotelRooms } from "../../api/hotelClient";

const BookingStepRoom = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [rooms, setRooms] = useState([]);

  // URL로부터 선택된 객실
  const initialSelectedRoomId = searchParams.get("roomId");
  const [selectedRoomId, setSelectedRoomId] = useState(initialSelectedRoomId || null);

  const roomRefs = useRef({});

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");

  const nights =
    checkIn && checkOut
      ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
      : 0;

  /* 날짜 범위 */
  const getDateRange = () => {
    if (!checkIn || !checkOut) return [];
    const range = [];
    let cur = new Date(checkIn);
    const end = new Date(checkOut);

    while (cur <= end) {
      range.push(cur.toISOString().split("T")[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return range;
  };

  const neededDates = getDateRange();

  /* 객실 불러오기 */
  useEffect(() => {
    getHotelRooms(hotelId).then((data) => {
      setRooms(data);
    });
  }, [hotelId]);

  /* 예약 가능 여부 체크 */
  const isRoomAvailable = (room) => {
    if (!Array.isArray(room.availableDates)) return true;
    return neededDates.every((d) => room.availableDates.includes(d));
  };

  /* 선택된 객실로 자동 스크롤 */
  useEffect(() => {
    if (selectedRoomId && roomRefs.current[selectedRoomId]) {
      roomRefs.current[selectedRoomId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [rooms, selectedRoomId]);

  /* 객실 선택 (선택/해제 모두 처리) */
  const handleSelectRoom = (room) => {
    if (!isRoomAvailable(room)) return;

    const clickedId = String(room.id);
    const currentSelected = String(selectedRoomId);

    if (clickedId === currentSelected) {
      setSelectedRoomId(null);
      return;
    }

    setSelectedRoomId(room.id);
  };

  /* 다음 단계 이동 */
  const goToPayment = () => {
    if (!selectedRoomId) return;

    const params = new URLSearchParams(searchParams);
    params.set("roomId", selectedRoomId);

    navigate(`/booking/${hotelId}/payment?${params.toString()}`);
  };

  return (
    <div className="booking-rooms">
      <div className="booking-header">
        <h1>객실 선택</h1>
        <div className="selected-dates">
          <span>
            {checkIn ? new Date(checkIn).toLocaleDateString("ko-KR") : "-"} ~{" "}
            {checkOut ? new Date(checkOut).toLocaleDateString("ko-KR") : "-"}
          </span>
          <span>{nights}박</span>
          <span>성인 {adults}명</span>
        </div>
      </div>

      <div className="room-list">
        {rooms.map((room) => {
          const available = isRoomAvailable(room);
          const isSelected = String(selectedRoomId) === String(room.id);

          return (
            <div
              key={room.id}
              className={`room-card ${isSelected ? "selected" : ""} ${
                !available ? "disabled" : ""
              }`}
              ref={(el) => (roomRefs.current[room.id] = el)}
            >
              <div className="room-image">
                <img src={room.images[0]} alt={room.name} />

                {room.originalPrice > room.price && (
                  <div className="room-badge">할인</div>
                )}

                {!available && <div className="room-badge soldout">예약 불가</div>}
              </div>

              <div className="room-details">
                <h3>{room.name}</h3>
                <p className="room-size">
                  {room.size} · {room.bedType} · 최대 {room.maxGuests}명
                </p>

                <div className="room-amenities">
                  {room.amenities.map((a, idx) => (
                    <div className="amenity" key={idx}>
                      ✓ {a}
                    </div>
                  ))}
                </div>

                <div className="price-row">
                  <div className="price">
                    ₩{room.price.toLocaleString()} <span>/박</span>
                  </div>

                  {available ? (
                    <button
                      className={`btn-select ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectRoom(room)}
                    >
                      {isSelected ? "선택됨" : "선택하기"}
                    </button>
                  ) : (
                    <button className="btn-disabled" disabled>
                      예약 불가
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ⭐ 하단 결제단계로 이동 버튼 */}
      <div className="bottom-action">
          <button
            className="btn-back"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              navigate(`/booking/${hotelId}?${params.toString()}`);
            }}
            style={{ marginRight: "12px" }}
          >
            이전 단계로
          </button>
          <button
            className="btn-go-payment"
            onClick={goToPayment}
            disabled={!selectedRoomId}
          >
            {selectedRoomId ? "결제 단계로 이동" : "객실을 선택해주세요"}
          </button>
      </div>
    </div>
  );
};

export default BookingStepRoom;