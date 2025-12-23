import React from "react";
import "../../styles/components/search/HotelListCards.scss";
import { useHotelListCards } from "./hooks/useHotelListCards";

const HotelListCards = ({ hotels = [], filters = {}, isGuest }) => {
    const {
        likes,
        visibleCount,
        goToHotelDetail,
        handleWishlist,
        visibleHotels,
        handleLoadMore
    } = useHotelListCards(hotels, filters, isGuest);

    if (hotels.length === 0) {
        return (
            <div className="hotel-list-cards no-data">
                <p>검색 결과가 없습니다.</p>
                <span>다른 조건으로 검색해 보세요.</span>
            </div>
        );
    }

    return (
        <div className="hotel-list-cards">
            {visibleHotels.map((hotel) => {
                const targetId = hotel._id || hotel.id;
                const price = hotel.displayPrice || hotel.price;

                // ⭐ 기존 가짜 데이터 방어 로직을 서비스 필드명으로 정교화
                const hasRealReviews = Array.isArray(hotel.reviews) && hotel.reviews.length > 0;
                const ratingReviews = hotel.ratingCount || (hasRealReviews ? hotel.reviews.length : 0);
                const ratingScore = ratingReviews > 0 ? (hotel.ratingAverage || hotel.rating || 0) : 0;

                const amenitiesCount = Array.isArray(hotel.amenities)
                    ? hotel.amenities.length
                    : (hotel.rooms?.[0]?.amenities?.length || 0);

                const liked = !!likes[targetId];

                return (
                    <div key={targetId} className="hotel-card" onClick={() => goToHotelDetail(targetId)}>
                        <div className="hotel-image">
                            <img
                                src={hotel.image || hotel.images?.[0] || hotel.rooms?.[0]?.images?.[0] || "/assets/images/default-hotel.jpg"}
                                alt={hotel.name}
                                onError={(e) => { e.target.src = "/assets/images/default-hotel.jpg"; }}
                            />
                        </div>

                        <div className="hotel-info">
                            <div className="hotel-header">
                                <h3 className="hotel-name">{hotel.name}</h3>
                                <div className="hotel-price">
                                    <div className="price-label">최저가</div>
                                    <div className="price-amount">
                                        {price ? `₩${Number(price).toLocaleString()}` : "가격 정보 없음"}
                                    </div>
                                    {price && <div className="price-note">1박 기준</div>}
                                </div>
                            </div>

                            <div className="hotel-location">
                                <i className="icon-location"></i> {hotel.location || hotel.address}
                            </div>

                            <div className="hotel-meta">
                                <div className="hotel-amenities">
                                    {amenitiesCount > 0 ? `${amenitiesCount}개 편의시설` : "기본 편의시설 제공"}
                                </div>
                            </div>

                            <div className="hotel-rating">
                                {ratingReviews > 0 ? (
                                    <>
                                        <span className="rating-badge">{Number(ratingScore).toFixed(1)}</span>
                                        <span className="rating-reviews">{ratingReviews}개 리뷰</span>
                                    </>
                                ) : (
                                    <span className="no-rating">아직 등록된 리뷰가 없습니다</span>
                                )}
                            </div>

                            <div className="card-divider"></div>

                            <div className="hotel-footer">
                                <button
                                    className={`wishlist-button ${liked ? "active" : ""}`}
                                    onClick={(e) => handleWishlist(e, hotel)}
                                >
                                    {liked ? "❤️" : "♡"}
                                </button>
                                <button className="view-button" onClick={(e) => { e.stopPropagation(); goToHotelDetail(targetId); }}>
                                    상세보기
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {visibleCount < hotels.length && (
                <div className="load-more-container">
                    <button className="load-more" onClick={handleLoadMore}>
                        호텔 더보기
                    </button>
                </div>
            )}
        </div>
    );
};

export default HotelListCards;