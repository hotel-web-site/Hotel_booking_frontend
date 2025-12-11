import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "../../styles/components/hotelpage/AvailableRooms.scss";

const AvailableRooms = ({ rooms }) => {
    const navigate = useNavigate();
    const { hotelId } = useParams();
    const [searchParams] = useSearchParams();

    /* 🔥 비회원 여부 */
    const isGuest = searchParams.get("guest") === "1";
    const basePath = isGuest ? "/booking-guest" : "/booking";

    /* 🔥 URL 파라미터 값 가져오기 */
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const adults = Number(searchParams.get("adults") || 2);
    const children = Number(searchParams.get("children") || 0);
    const totalGuests = adults + children;

    /* 🔥 예약 날짜 계산 */
    const neededDates = [];
    if (checkIn && checkOut) {
        let cur = new Date(checkIn);
        const end = new Date(checkOut);

        while (cur <= end) {
            neededDates.push(cur.toISOString().split("T")[0]);
            cur.setDate(cur.getDate() + 1);
        }
    }

    /* 🔥 객실 예약 가능 여부 체크 */
    const isRoomAvailable = (room) => {
        const fitsGuests = room.maxGuests >= totalGuests;

        if (!Array.isArray(room.availableDates)) return fitsGuests;

        const dateOK =
            neededDates.length === 0 ||
            neededDates.every((d) => room.availableDates.includes(d));

        return fitsGuests && dateOK;
    };

    /* 🔥 예약하기 버튼 클릭 */
    const handleBook = (roomId) => {
        const params = new URLSearchParams();

        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);
        params.set("adults", adults);
        params.set("children", children);
        params.set("roomId", roomId);

        // ⭐ guest 유지
        if (isGuest) params.set("guest", "1");

        // ⭐ 회원/비회원에 따라 다른 경로로 이동
        navigate(`${basePath}/${hotelId}?${params.toString()}`);
    };

    return (
        <div className="available-rooms">
            <h3 className="rooms-title">잔여 객실</h3>

            <div className="rooms-list">
                {rooms.map((room) => {
                    const available = isRoomAvailable(room);

                    return (
                        <div key={room.id} className={`room-row ${!available ? "disabled" : ""}`}>
                            {/* 왼쪽: 이미지 + 텍스트 */}
                            <div className="room-info">
                                <div className="room-img">
                                    <img src={room.images[0]} alt={room.name} />
                                    {!available && <div className="room-badge">예약 불가</div>}
                                </div>

                                <div className="room-text">
                                    <p className="room-name">{room.name}</p>
                                    <p className="room-type">{room.type}</p>
                                    <p className="room-max">최대 {room.maxGuests}명</p>
                                </div>
                            </div>

                            {/* 오른쪽: 가격 + 버튼 */}
                            <div className="room-actions">
                                <p className="room-price">
                                    ₩{room.price.toLocaleString()}
                                    <span className="night">/박</span>
                                </p>

                                {available ? (
                                    <button className="book-btn" onClick={() => handleBook(room.id)}>
                                        예약하기
                                    </button>
                                ) : (
                                    <button className="book-btn disabled" disabled>
                                        예약 불가
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AvailableRooms;
