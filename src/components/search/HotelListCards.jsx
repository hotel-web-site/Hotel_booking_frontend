import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/search/HotelListCards.scss";
import { toggleWishlist, isWishlisted } from "../../util/wishlistService";

const HotelListCards = ({ hotels = [] }) => {
    const navigate = useNavigate();

    if (!hotels || hotels.length === 0) {
        return (
            <div className="hotel-list-cards empty">
                호텔을 찾을 수 없습니다.
            </div>
        );
    }

    return (
        <div className="hotel-list-cards">
            {hotels.map((hotel) => {
                const mainRoom =
                    hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0] : {};

                const price = mainRoom?.price ?? null;
                const amenitiesCount = mainRoom?.amenities?.length || 0;

                // ⭐ 각 호텔 카드마다 찜 상태를 개별로 가짐
                const [liked, setLiked] = useState(
                    isWishlisted(hotel._id || hotel.id)
                );

                const handleWishlist = (e) => {
                    e.stopPropagation(); // 카드 클릭과 충돌 방지
                    const result = toggleWishlist(hotel);
                    setLiked(result);
                };

                return (
                    <div
                        key={hotel.id}
                        className="hotel-card"
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                    >
                        {/* ------------ 이미지 ------------- */}
                        <div className="hotel-image">
                            <img
                                src={hotel.image}
                                alt={hotel.name}
                            />
                            {hotel.imageCount && (
                                <div className="image-count">
                                    {hotel.imageCount}장 사진
                                </div>
                            )}
                        </div>

                        {/* ------------ 오른쪽 정보 전체 ------------- */}
                        <div className="hotel-info">

                            {/* 상단: 이름 + 가격 */}
                            <div className="hotel-header">
                                <h3 className="hotel-name">{hotel.name}</h3>

                                <div className="hotel-price">
                                    <div className="price-label">최저가</div>
                                    <div className="price-amount">
                                        {price
                                            ? `₩${price.toLocaleString()}/1박`
                                            : "가격 정보 없음"}
                                    </div>
                                    <div className="price-note">세금 별도</div>
                                </div>
                            </div>

                            {/* 위치 */}
                            <div className="hotel-location">{hotel.location}</div>

                            {/* 별점 / 어메니티 */}
                            <div className="hotel-meta">
                                <div className="hotel-stars">
                                    {"⭐".repeat(hotel.stars || 0)} {hotel.stars}성급 호텔
                                </div>
                                <div className="hotel-amenities">
                                    🏨 {amenitiesCount}개 편의시설
                                </div>
                            </div>

                            {/* 평점 */}
                            <div className="hotel-rating">
                                <span className="rating-score">{hotel.rating}</span>
                                <span className="rating-label">{hotel.ratingLabel}</span>
                                <span className="rating-reviews">
                                    {hotel.reviews}개 리뷰
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="card-divider"></div>

                            {/* 하단 버튼 영역 */}
                            <div className="hotel-footer">
                                {/* ♥ 찜 버튼 */}
                                <button
                                    className="wishlist-button"
                                    onClick={handleWishlist}
                                >
                                    {liked ? "♥" : "♡"}
                                </button>

                                {/* 상세보기 */}
                                <button
                                    className="view-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/hotels/${hotel.id}`);
                                    }}
                                >
                                    상세보기
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            <button className="load-more">더보기</button>
        </div>
    );
};

export default HotelListCards;
