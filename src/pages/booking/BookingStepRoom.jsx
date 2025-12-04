import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/components/booking/BookingStepRoom.scss";

// 🔥 mockRooms 불러오기
import { getHotelRooms } from "../../api/hotelClient";

const BookingStepRoom = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // 🔥 API에서 실제 room 데이터 가져오기 (클래스명 유지)
  useEffect(() => {
    getHotelRooms(hotelId).then((data) => {
      setRooms(data);
      console.log("📌 hotelId:", hotelId, "→ 가져온 rooms:", data);
    });
  }, [hotelId]);

  const handleSelectRoom = (room) => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adults = searchParams.get("adults");
    const children = searchParams.get("children");

    const params = new URLSearchParams();
    params.append("checkIn", checkIn);
    params.append("checkOut", checkOut);
    params.append("adults", adults);
    if (children) params.append("children", children);
    params.append("roomId", room.id);

    navigate(`/booking/${hotelId}/payment?${params.toString()}`);
  };

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div className="booking-rooms">
      <div className="booking-header">
        <h1>객실 선택</h1>

        <div className="selected-dates">
          <div className="date-info">
            <span>
              {checkIn ? new Date(checkIn).toLocaleDateString("ko-KR") : "-"} ~{" "}
              {checkOut ? new Date(checkOut).toLocaleDateString("ko-KR") : "-"}
            </span>
          </div>

          <div className="date-info">
            <span>{nights}박</span>
          </div>

          <div className="date-info">
            <span>성인 {searchParams.get("adults")}명</span>
          </div>
        </div>
      </div>

      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <div className="room-image">
              <img src={room.images[0]} alt={room.name} />

              {room.originalPrice > room.price && (
                <div className="room-badge">할인</div>
              )}
            </div>

            <div className="room-details">
              <div className="room-header">
                <h3>{room.name}</h3>
                <div className="room-size">
                  {room.size} · {room.bedType} · 최대 {room.maxGuests}명
                </div>
              </div>

              <div className="room-amenities">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="amenity">
                    <span className="icon">✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>

              <div className="room-info">
                {room.features.map((feature, idx) => (
                  <div key={idx} className="info-item">
                    <span className="icon">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="room-footer">
                <div className="price-info">
                  {room.originalPrice > room.price && (
                    <div className="original-price">
                      ₩{room.originalPrice.toLocaleString()}
                    </div>
                  )}

                  <div className="current-price">
                    ₩{room.price.toLocaleString()}
                    <span className="unit">/박</span>
                  </div>
                </div>

                <button
                  className="btn-select"
                  onClick={() => handleSelectRoom(room)}
                >
                  선택하기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStepRoom;
