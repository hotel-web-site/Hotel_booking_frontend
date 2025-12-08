// src/components/search/HotelListCards.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/search/HotelListCards.scss";
import { toggleWishlist, isWishlisted } from "../../util/wishlistService";

const HotelListCards = ({ hotels = [] }) => {
  const navigate = useNavigate();

  // 🔐 호텔별 찜 상태 관리 (id -> boolean)
  const [likes, setLikes] = useState({});

  // ✅ 항상 훅이 먼저 실행되고, 안에서 hotels가 비었는지 처리
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

  const handleWishlist = (e, hotel) => {
    e.stopPropagation();
    const result = toggleWishlist(hotel);
    const id = hotel._id || hotel.id;
    setLikes((prev) => ({ ...prev, [id]: result }));
  };

  // 🔻 여기서 호텔이 0개일 때 분기
  if (!hotels || hotels.length === 0) {
    return (
        <div className="hotel-list-cards">
            {visibleHotels.map((hotel) => {
                const mainRoom =
                    hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0] : {};

                const price = mainRoom?.price ?? null;
                const amenitiesCount = mainRoom?.amenities?.length || 0;

                const [liked, setLiked] = useState(
                    isWishlisted(hotel._id || hotel.id)
                );

                const handleWishlist = (e) => {
                    e.stopPropagation();
                    const result = toggleWishlist(hotel);
                    setLiked(result);
                };

                return (
                    <div
                        key={hotel.id}
                        className="hotel-card"
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                    >
                        <div className="hotel-image">
                            <img src={hotel.image} alt={hotel.name} />
                            {hotel.imageCount && (
                                <div className="image-count">
                                    {hotel.imageCount}장 사진
                                </div>
                            )}
                        </div>

                        <div className="hotel-info">
                            <div className="hotel-header">
                                <h3 className="hotel-name">{hotel.name}</h3>

                                <div className="hotel-price">
                                    <div className="price-label">최저가</div>
                                    <div className="price-amount">
                                        {" "}
                                        <span>
                                            {price
                                                ? `₩${price.toLocaleString()}/night`
                                                : "가격 정보 없음"}
                                        </span>
                                    </div>
                                    <div className="price-note">세금 별도</div>
                                </div>
                            </div>

                            <div className="hotel-location">{hotel.location}</div>

                            <div className="hotel-meta">
                                <div className="hotel-stars">
                                    {"⭐".repeat(hotel.stars || 0)} {hotel.stars}점
                                </div>
                                <div className="hotel-amenities">
                                    🏨 {amenitiesCount}개 편의시설
                                </div>
                            </div>

                            <div className="hotel-rating">
                                <span className="rating-score">{hotel.rating}</span>
                                <span className="rating-label">{hotel.ratingLabel}</span>
                                <span className="rating-reviews">
                                    {hotel.reviews}개 리뷰
                                </span>
                            </div>

                            <div className="card-divider"></div>

                            <div className="hotel-footer">
                                <button
                                    className="wishlist-button"
                                    onClick={handleWishlist}
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

            {/* ⭐ 더보기는 아직 보이지 않은 호텔이 있을 때만 표시 */}
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
  }

  return (
    <div className="hotel-list-cards">
      {hotels.map((hotel) => {
        const id = hotel._id || hotel.id;
        const mainRoom =
          hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0] : {};

        const price = mainRoom?.price ?? null;
        const amenitiesCount = mainRoom?.amenities?.length || 0;
        const liked = !!likes[id];

        // mock 데이터 보정용 (ratingAverage / ratingCount 사용)
        const ratingScore =
          hotel.ratingAverage ?? hotel.rating ?? "-";
        const ratingReviews =
          hotel.ratingCount ?? hotel.reviews ?? 0;

        return (
          <div
            key={id}
            className="hotel-card"
            onClick={() => navigate(`/hotels/${hotel.id}`)}
          >
            {/* 이미지 */}
            <div className="hotel-image">
              <img src={hotel.image} alt={hotel.name} />
              {hotel.imageCount && (
                <div className="image-count">
                  {hotel.imageCount} 장 사진
                </div>
              )}
            </div>

            {/* 오른쪽 정보 */}
            <div className="hotel-info">
              {/* 상단: 이름 + 가격 */}
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

              {/* 별점 / 어메니티 수 */}
              <div className="hotel-meta">
                <div className="hotel-stars">
                  {"⭐".repeat(hotel.stars || 0)}{" "}
                  {hotel.stars} 점
                </div>
                <div className="hotel-amenities">
                  🏨 {amenitiesCount}개 편의시설
                </div>
              </div>

              {/* 평점 */}
              <div className="hotel-rating">
                <span className="rating-score">{ratingScore}</span>
                <span className="rating-label">
                  {hotel.ratingLabel || ""}
                </span>
                <span className="rating-reviews">
                  {ratingReviews} 개 리뷰
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

      <button className="load-more">더보기</button>
    </div>
  );
};

export default HotelListCards;
