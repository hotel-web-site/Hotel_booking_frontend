import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/components/booking/BookingStepRoom.scss";

import { getHotelRooms } from "../../api/hotelClient";

const BookingStepRoom = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const initialSelectedRoomId = searchParams.get("roomId");
  const [selectedRoomId, setSelectedRoomId] = useState(initialSelectedRoomId);

  const roomRefs = useRef({});

  /* ===========================================================
      URL 기반 데이터
  =========================================================== */
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const adults = Number(searchParams.get("adults") || 2);
  const children = Number(searchParams.get("children") || 0);
  const totalGuests = adults + children;

  const nights =
    checkIn && checkOut
      ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
      : 0;

  /* 날짜 리스트 생성 */
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

  /* ===========================================================
      객실 불러오기
  =========================================================== */
  useEffect(() => {
    getHotelRooms(hotelId).then((data) => {
      setRooms(data);
    });
  }, [hotelId]);

  /* ===========================================================
      예약 가능 여부 (엔진)
  =========================================================== */
  const isRoomAvailable = (room) => {
    if (!room) return false; // 안전 장치

    // 1) 인원 제한 체크
    const fitsGuests = Number(room.maxGuests) >= Number(totalGuests);
    if (!fitsGuests) return false;

    // 2) 날짜 체크
    if (!Array.isArray(room.availableDates)) return true;

    return neededDates.every((d) => room.availableDates.includes(d));
  };

  /* URL roomId가 불가한 방이면 선택 해제 */
  useEffect(() => {
    if (!rooms.length || !selectedRoomId) return;

    const selected = rooms.find((r) => String(r.id) === String(selectedRoomId));
    if (!selected) return;

    if (!isRoomAvailable(selected)) {
      setSelectedRoomId(null);
    }
  }, [rooms, selectedRoomId]);

  /* 선택된 객실 자동 스크롤 */
  useEffect(() => {
    if (selectedRoomId && roomRefs.current[selectedRoomId]) {
      roomRefs.current[selectedRoomId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [rooms, selectedRoomId]);

  const handleSelectRoom = (room) => {
    if (!isRoomAvailable(room)) return;
    setSelectedRoomId(room.id);
  };

  /* ===========================================================
      결제 단계 이동
  =========================================================== */
  const goToPayment = () => {
    const selectedRoom = rooms.find(
      (r) => String(r.id) === String(selectedRoomId)
    );

    if (!selectedRoom || !isRoomAvailable(selectedRoom)) {
      alert("해당 객실은 예약할 수 없습니다.");
      return;
    }

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
          {children > 0 && <span>어린이 {children}명</span>}
        </div>
      </div>

      {/* 객실 목록 */}
      <div className="room-list">
        {rooms.map((room) => {
          const available = isRoomAvailable(room);
          const isSelected = String(selectedRoomId) === String(room.id);

          return (
            <div
              key={room.id}
              ref={(el) => (roomRefs.current[room.id] = el)}
              className={`room-card 
                ${isSelected ? "selected" : ""}
                ${!available ? "disabled" : ""}
              `}
              onClick={() => handleSelectRoom(room)}
            >
              <div className="room-image">
                <img src={room.images[0]} alt={room.name} />

                {room.originalPrice > room.price && (
                  <div className="room-badge">할인</div>
                )}

                {!available && (
                  <div className="room-badge soldout">예약 불가</div>
                )}
              </div>

              <div className="room-details">
                <h3>{room.name}</h3>
                <p className="room-size">
                  {room.size} · {room.bedType} · 최대 {room.maxGuests}명
                </p>

                <div className="room-amenities">
                  {room.amenities.map((a, idx) => (
                    <div key={idx} className="amenity">
                      ✓ {a}
                    </div>
                  ))}
                </div>

                <div className="price-row">
                  <div className="price">
                    ₩{room.price.toLocaleString()}
                    <span>/박</span>
                  </div>

                  {available ? (
                    <button
                      className={`btn-select ${isSelected ? "selected" : ""}`}
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

      {/* 하단 결제 버튼 */}
      <div className="bottom-action">
        <button
          className="btn-go-payment"
          onClick={goToPayment}
          disabled={
            !selectedRoomId ||
            !rooms.find((r) => String(r.id) === String(selectedRoomId)) ||
            !isRoomAvailable(
              rooms.find((r) => String(r.id) === String(selectedRoomId))
            )
          }
        >
          {selectedRoomId ? "결제 단계로 이동" : "예약 가능한 객실이 없습니다"}
        </button>
      </div>
    </div>
  );
};

export default BookingStepRoom;
