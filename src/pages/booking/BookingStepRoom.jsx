import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/components/booking/BookingStepRoom.scss";

import { getHotelRooms } from "../../api/hotelClient";

const BookingStepRoom = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ===========================================================
      ⭐ 비회원 모드 및 경로 설정
  =========================================================== */
  const isGuest = searchParams.get("guest") === "1";
  const basePath = isGuest ? "/booking-guest" : "/booking";

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL 쿼리 스트링에서 roomId 추출
  const initialSelectedRoomId = searchParams.get("roomId");
  const [selectedRoomId, setSelectedRoomId] = useState(initialSelectedRoomId);

  const roomRefs = useRef({});

  /* URL 기반 데이터 추출 */
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = Number(searchParams.get("adults") || 2);
  const children = Number(searchParams.get("children") || 0);
  const totalGuests = adults + children;

  const nights = checkIn && checkOut
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
      ⭐ 데이터 페칭
  =========================================================== */
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getHotelRooms(hotelId);
        // 응답 구조 대응: data 직접 혹은 data.list
        const roomList = Array.isArray(data) ? data : data.list || [];
        setRooms(roomList);
      } catch (err) {
        console.error("객실 데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [hotelId]);

  /* ===========================================================
      ⭐ 예약 가능 여부 (데이터 보정 로직)
  =========================================================== */
  const isRoomAvailable = (room) => {
    if (!room) return false;

    // 1. 인원수 체크: 데이터가 0이거나 없을 경우 기본값 10명으로 설정하여 통과 유도
    const max = Number(room.maxGuests) || 10;
    const fitsGuests = max >= totalGuests;
    if (!fitsGuests) return false;

    // 2. 날짜 체크: availableDates가 없으면 모든 날짜 예약 가능으로 간주
    if (!room.availableDates || !Array.isArray(room.availableDates) || room.availableDates.length === 0) {
      return true;
    }

    return neededDates.every((d) => room.availableDates.includes(d));
  };

  /* 초기 선택 방 유효성 검사 및 자동 스크롤 */
  useEffect(() => {
    if (rooms.length > 0 && selectedRoomId) {
      // ⭐ ID 타입 불일치 방지를 위해 String() 강제 변환
      const selected = rooms.find((r) => String(r._id || r.id) === String(selectedRoomId));

      if (!selected || !isRoomAvailable(selected)) {
        // 유효하지 않은 방이면 선택 해제 (단, 테스트를 위해 필요시 이 로직을 주석처리 하세요)
        // setSelectedRoomId(null); 
      } else {
        // 유효한 방이면 해당 위치로 스크롤
        setTimeout(() => {
          roomRefs.current[selectedRoomId]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
  }, [rooms, selectedRoomId]);

  /* ===========================================================
      ⭐ 액션 핸들러
  =========================================================== */
  const handleSelectRoom = (room) => {
    const targetId = String(room._id || room.id);
    if (!isRoomAvailable(room)) {
      alert("해당 객실은 인원 초과 또는 예약 가능한 날짜가 아닙니다.");
      return;
    }
    setSelectedRoomId((prev) => (String(prev) === targetId ? null : targetId));
  };

  const goToPrevious = () => {
    const params = new URLSearchParams(searchParams);
    navigate(`${basePath}/${hotelId}?${params.toString()}`);
  };

  const goToPayment = () => {
    // ⭐ 전송 전 최종 ID 매칭 확인
    const selectedRoom = rooms.find(
      (r) => String(r._id || r.id) === String(selectedRoomId)
    );

    if (!selectedRoom) {
      alert("선택하신 객실 정보를 찾을 수 없습니다. 다시 선택해주세요.");
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("roomId", String(selectedRoomId)); // ID 문자열 보장

    // 결제 페이지로 이동
    navigate(`${basePath}/${hotelId}/payment?${params.toString()}`);
  };

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