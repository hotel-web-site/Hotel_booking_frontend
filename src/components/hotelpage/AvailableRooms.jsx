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

    /* 🔥 객실 예약 가능 여부 체크 */
    const isRoomAvailable = (room) => {
        if (!checkIn || !checkOut) return true;

        // 인원수 체크 (데이터가 없을 경우 대비해 기본값 10 설정)
        const max = Number(room.maxGuests) || 10;
        const fitsGuests = max >= totalGuests;
        if (!fitsGuests) return false;

        // 날짜 체크 (availableDates가 없으면 모든 날짜 가능으로 간주)
        if (!room.availableDates || !Array.isArray(room.availableDates) || room.availableDates.length === 0) {
            return true;
        }

        return neededDates.every((d) => room.availableDates.includes(d));
    };

    /* 🔥 예약하기 버튼 클릭 */
    const handleBook = (room) => {
        // ⭐ 백엔드 ID인 _id를 우선적으로 가져옴
        const roomId = room._id || room.id;
        const params = new URLSearchParams(searchParams); // 기존 파라미터 유지

        params.set("roomId", String(roomId));
        if (isGuest) params.set("guest", "1");

        navigate(`${basePath}/${hotelId}?${params.toString()}`);
    };

    return (
        <div className="available-rooms">
            <h3 className="rooms-title">잔여 객실</h3>

            <div className="rooms-list">
                {rooms.map((room) => {
                    // ⭐ 고유 키값 설정: _id가 있으면 쓰고 없으면 id를 사용 (둘 다 없으면 index라도 사용)
                    const roomId = room._id || room.id;
                    const available = isRoomAvailable(room);

                    return (
                        <div key={String(roomId)} className={`room-row ${!available ? "disabled" : ""}`}>
                            {/* 왼쪽: 이미지 + 텍스트 */}
                            <div className="room-info">
                                <div className="room-img">
                                    <img
                                        src={Array.isArray(room.images) && room.images.length > 0 ? room.images[0] : "/default-room.jpg"}
                                        alt={room.name}
                                    />
                                    {!available && <div className="room-badge">예약 불가</div>}
                                </div>

                                <div className="room-text">
                                    <p className="room-name">{room.name}</p>
                                    <p className="room-type">{room.type || room.bedType}</p>
                                    <p className="room-max">최대 {room.maxGuests || 2}명</p>
                                </div>
                            </div>

                            {/* 오른쪽: 가격 + 버튼 */}
                            <div className="room-actions">
                                <p className="room-price">
                                    ₩{(room.price || 0).toLocaleString()}
                                    <span className="night">/박</span>
                                </p>

                                {available ? (
                                    <button className="book-btn" onClick={() => handleBook(room)}>
                                        예약하기
                                    </button>
                                ) : (
                                    <button className="book-btn disabled" disabled>
                                        {Number(room.maxGuests) < totalGuests ? "인원 초과" : "예약 불가"}
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