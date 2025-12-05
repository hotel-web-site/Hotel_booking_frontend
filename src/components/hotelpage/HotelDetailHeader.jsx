import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toggleWishlist, isWishlisted } from "../../util/wishlistService";
import "../../styles/components/hotelpage/HotelDetailHeader.scss";

const HotelDetailHeader = ({ hotel }) => {
    const navigate = useNavigate();

    if (!hotel) {
        return <div className="hotel-detail-header loading">로딩 중...</div>;
    }

    // ⭐ 호텔 데이터 기반으로 찜 여부 초기화
    const [liked, setLiked] = useState(isWishlisted(hotel._id || hotel.id));

    // ⭐ 찜 토글
    const handleWishlist = () => {
        const result = toggleWishlist(hotel);
        setLiked(result);
    };

    const {
        name = "호텔명 없음",
        ratingAverage = 0,
        ratingCount = 0,
        address = "주소 정보 없음",
        city = "",
        location = "",
    } = hotel;

    const handleBookNow = () => {
        navigate(`/booking/${hotel._id || hotel.id}`);
    };

    // ⭐ 별점 렌더링
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={i < fullStars ? "star-filled" : "star-empty"}
                />
            );
        }
        return stars;
    };

    return (
        <div className="hotel-detail-header">
            {/* breadcrumb */}
            <div className="header-top">
                <div className="breadcrumb">
                    <span>{city}</span> &gt; <span>{location}</span> &gt; <span>{name}</span>
                </div>
            </div>

            {/* 메인 정보 라인 */}
            <div className="hotel-info">

                {/* 왼쪽 호텔 정보 */}
                <div className="hotel-title-section">
                    <h1 className="hotel-name">{name}</h1>

                    <div className="rating-section">
                        <div className="stars">{renderStars(ratingAverage)}</div>
                        <span className="rating-text">{ratingAverage}점</span>
                    </div>

                    <div className="location-section">
                        <FaMapMarkerAlt className="location-icon" />
                        <span className="address">{address}</span>
                    </div>

                    <div className="review-section">
                        <span className="review-score">{ratingAverage}</span>
                        <span className="review-text">아주 좋음</span>
                        <span className="review-count">{ratingCount}개 리뷰</span>
                    </div>
                </div>

                {/* 오른쪽 가격 + 버튼 */}
                <div className="price-actions-wrap">
                    <div className="price-section">
                        <span className="price">
                            ₩{(hotel.basePrice ?? hotel.price ?? 0).toLocaleString()}
                        </span>
                        <span className="price-unit">/박</span>
                    </div>

                    <div className="header-actions">

                        {/* ♥ 찜 버튼 */}
                        <button className="icon-btn heart-btn" onClick={handleWishlist}>
                            {liked ? "♥" : "♡"}
                        </button>

                        {/* 공유 버튼 */}
                        <button className="icon-btn">
                            <FaShare />
                        </button>

                        {/* 예약 버튼 */}
                        <button className="book-top-btn" onClick={handleBookNow}>
                            예약하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetailHeader;
