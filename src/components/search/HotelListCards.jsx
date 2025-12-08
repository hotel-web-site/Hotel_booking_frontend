// src/components/search/HotelListCards.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/search/HotelListCards.scss";
import { toggleWishlist, isWishlisted } from "../../util/wishlistService";

const HotelListCards = ({ hotels = [] }) => {
    const navigate = useNavigate();

    // ⭐ 찜 상태 저장 (id -> boolean)
    const [likes, setLikes] = useState({});

    // ⭐ 더보기 (처음 6개 보여주고, 클릭할 때마다 6개씩 증가)
    const [visibleCount, setVisibleCount] = useState(6);

    // ⭐ 화면에 표시될 호텔 목록
    const visibleHotels = hotels.slice(0, visibleCount);

    // ⭐ 호텔 목록 변경 시 찜 상태 세팅
    useEffect(() => {
        if (!hotels || hotels.length === 0) {
            setLikes({});
            return;
        }

        const initialLikes = {};
        hotels.forEach((hotel) => {
            const id = hotel._id || hotel.id;
            initialLikes[id] = isWishlisted(id);
        });

        setLikes(initialLikes);
    }, [hotels]);

    // ⭐ 찜 버튼 클릭 핸들러
    const handleWishlist = (e, hotel) => {
        e.stopPropagation();
        const id = hotel._id || hotel.id;

        const result = toggleWishlist(hotel);
        setLikes((prev) => ({ ...prev, [id]: result }));
    };

    // ⭐ 호텔이 하나도 없을 때
    if (!hotels || hotels.length === 0) {
        return (
            <div className="hotel-list-cards no-data">
                검색 결과가 없습니다.
            </div>
        );
    }

    return (
        <div className="hotel-list-cards">
            {visibleHotels.map((hotel) => {
                const id = hotel._id || hotel.id;

                const mainRoom =
                    hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0] : {};
                const price = mainRoom?.price ?? null;
                const amenitiesCount = mainRoom?.amenities?.length || 0;

                const liked = !!likes[id];

                // ⭐ mock 데이터 대응 (ratingAverage / ratingCount)
                const ratingScore = hotel.ratingAverage ?? hotel.rating ?? "-";
                const ratingReviews = hotel.ratingCount ?? hotel.reviews ?? 0;

                return (
                    <div
                        key={id}
                        className="hotel-card"
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                    >
                        {/* 호텔 이미지 */}
                        <div className="hotel-image">
                            <img src={hotel.image} alt={hotel.name} />
                            {hotel.imageCount && (
                                <div className="image-count">
                                    {hotel.imageCount} 장 사진
                                </div>
                            )}
                        </div>

                        {/* 호텔 정보 */}
                        <div className="hotel-info">
                            {/* 이름 + 가격 */}
                            <div className="hotel-header">
                                <h3 className="hotel-name">{hotel.name}</h3>

                                <div className="hotel-price">
                                    <div className="price-label">최저가</div>
                                    <div className="price-amount">
                                        {price
                                            ? `₩${price.toLocaleString()}/night`
                                            : "가격 정보 없음"}
                                    </div>
                                    <div className="price-note">세금 별도</div>
                                </div>
                            </div>

                            {/* 위치 */}
                            <div className="hotel-location">{hotel.location}</div>

                            {/* 별점 + 편의시설 */}
                            <div className="hotel-meta">
                                <div className="hotel-amenities">
                                    🏨 {amenitiesCount}개 편의시설
                                </div>
                            </div>

                            {/* 리뷰 */}
                            <div className="hotel-rating">
                                <span className="rating-score">{ratingScore}</span>
                                <span className="rating-label">
                                    {hotel.ratingLabel || ""}
                                </span>
                                <span className="rating-reviews">
                                    {ratingReviews}개 리뷰
                                </span>
                            </div>

                            <div className="card-divider"></div>

                            {/* 하단 버튼 */}
                            <div className="hotel-footer">
                                <button
                                    className="wishlist-button"
                                    onClick={(e) => handleWishlist(e, hotel)}
                                >
                                    {liked ? "♥" : "♡"}
                                </button>

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

            {/* ⭐ 더보기 버튼 — 남은 호텔이 있을 때만 표시 */}
            {visibleCount < hotels.length && (
                <button
                    className="load-more"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                >
                    더보기
                </button>
            )}
        </div>
    );
};

export default HotelListCards;
