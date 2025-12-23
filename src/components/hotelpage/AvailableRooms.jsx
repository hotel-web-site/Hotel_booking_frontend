const AvailableRooms = ({ rooms }) => {
    const { isGuest, totalGuests, isRoomAvailable, handleBook } = useAvailableRooms();
    return (
        <div className="available-rooms">
            <h3 className="rooms-title">잔여 객실</h3>
            <div className="rooms-list">
                {rooms.map((room) => {
                    const roomId = room._id || room.id;
                    const available = isRoomAvailable(room);
                    return (
                        <div key={String(roomId)} className={`room-row ${!available ? "disabled" : ""}`}>
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