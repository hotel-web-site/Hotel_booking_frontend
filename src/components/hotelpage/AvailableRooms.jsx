import React from "react";
import "../../styles/components/hotelpage/AvailableRooms.scss";

const AvailableRooms = ({ rooms }) => {
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

                            <button className="book-btn">예약하기</button>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default AvailableRooms;
