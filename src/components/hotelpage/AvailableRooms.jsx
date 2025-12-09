import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/components/hotelpage/AvailableRooms.scss";

const AvailableRooms = ({ rooms }) => {
    const navigate = useNavigate();
    const { hotelId } = useParams();

    const handleBook = (roomId) => {
        // 날짜 선택 페이지로 이동 + 선택한 객실(roomId) 전달
        navigate(`/booking/${hotelId}?roomId=${roomId}`);
    };

    return (
        <div className="available-rooms">
            <h3 className="rooms-title">잔여 객실</h3>

            <div className="rooms-list">
                {rooms.map((room) => (
                    <div key={room.id} className="room-row">

                        {/* 왼쪽: 이미지 + 텍스트 */}
                        <div className="room-info">
                            <div className="room-img">
                                <img src={room.images[0]} alt={room.name} />
                            </div>

                            <div className="room-text">
                                <p className="room-name">{room.name}</p>
                                <p className="room-type">{room.type}</p>
                            </div>
                        </div>

                        {/* 오른쪽: 가격 + 버튼 */}
                        <div className="room-actions">
                            <p className="room-price">
                                ₩{room.price.toLocaleString()}
                                <span className="night">/박</span>
                            </p>

                            <button
                                className="book-btn"
                                onClick={() => handleBook(room.id)}
                            >
                                예약하기
                            </button>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default AvailableRooms;
