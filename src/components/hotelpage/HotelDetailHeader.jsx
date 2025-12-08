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

    const [liked, setLiked] = useState(isWishlisted(hotel._id || hotel.id));

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

    // ⭐★ 현재 URL 공유 기능 추가
    const handleShare = async () => {
        const currentUrl = window.location.href;

        // 1) 모바일/지원 브라우저 → Web Share API 사용
        if (navigator.share) {
            try {
                await navigator.share({
                    title: name,
                    text: `${name} 호텔 상세 페이지`,
                    url: currentUrl,
                });
            } catch (error) {
                console.log("공유 취소됨 또는 오류:", error);
            }
            return;
        }

        // 2) 지원되지 않는 환경 → 클립보드 복사
        try {
            await navigator.clipboard.writeText(currentUrl);
            alert("현재 페이지 링크가 클립보드에 복사되었습니다!");
        } catch (error) {
            console.error("URL 복사 실패:", error);
            alert("URL 복사 실패. 브라우저 설정을 확인하세요.");
        }
    };

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
                            최저가 <span>₩{(hotel.basePrice ?? hotel.price ?? 0).toLocaleString()}</span>
                        </span>
                        <span className="price-unit">/박</span>
                    </div>

                    <div className="header-actions">

                        {/* ♥ 찜 */}
                        <button className="icon-btn heart-btn" onClick={handleWishlist}>
                            {liked ? "♥" : "♡"}
                        </button>

                        {/* 🔗 공유 버튼 */}
                        <button className="icon-btn" onClick={handleShare}>
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
