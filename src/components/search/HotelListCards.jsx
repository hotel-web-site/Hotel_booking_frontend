import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/search/HotelListCards.scss";

const HotelListCards = ({ hotels = [] }) => {
    const navigate = useNavigate();
    console.log("HotelListCards received hotels:", hotels);

    if (!hotels || hotels.length === 0) {
        return (
            <div className="hotel-list-cards empty">호텔을 찾을 수 없습니다.</div>
        );
    }

    return (
        <div className="hotel-list-cards">
            {hotels.map((hotel, i) => {
                const price = hotel.basePrice ?? null;

                return (
                    <div
                        key={i}
                        className="hotel-card"
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                    >
                        {/* 이미지 */}
                        <div className="hotel-image">
                            <img src={hotel.image} alt={hotel.name} />
                            {hotel.imageCount && (
                                <div className="image-count">
                                    {hotel.imageCount} images
                                </div>
                            )}
                        </div>

                        {/* 오른쪽 카드 전체 */}
                        <div className="hotel-info">

                            {/* 상단: 이름 + 가격 */}
                            <div className="hotel-header">
                                <h3 className="hotel-name">{hotel.name}</h3>

                                <div className="hotel-price">
                                    <div className="price-label">starting from</div>
                                    <div className="price-amount">
                                        {price
                                            ? `₩${price.toLocaleString()}/night`
                                            : "가격 정보 없음"}
                                    </div>
                                    <div className="price-note">excl. tax</div>
                                </div>
                            </div>

                            {/* 위치 */}
                            <div className="hotel-location">{hotel.location}</div>

                            {/* 별점/타입/어메니티 */}
                            <div className="hotel-meta">
                                <div className="hotel-stars">
                                    {"⭐".repeat(hotel.stars || 0)} {hotel.stars} Star Hotel
                                </div>
                                <div className="hotel-amenities">
                                    🏨 {hotel.amenities}+ Amenities
                                </div>
                            </div>

                            {/* 평점 */}
                            <div className="hotel-rating">
                                <span className="rating-score">{hotel.rating}</span>
                                <span className="rating-label">{hotel.ratingLabel}</span>
                                <span className="rating-reviews">
                                    {hotel.reviews} reviews
                                </span>
                            </div>

                            {/* 구분선 */}
                            <div className="card-divider"></div>

                            {/* 하단 버튼영역 */}
                            <div className="hotel-footer">
                                <button
                                    className="wishlist-button"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    ♡
                                </button>

                                <button
                                    className="view-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/hotels/${hotel.id}`);
                                    }}
                                >
                                    View Place
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default HotelListCards;
