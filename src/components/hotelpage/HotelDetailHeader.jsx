import React, { useState, useEffect } from "react";
import { FaStar, FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toggleWishlist, isWishlisted } from "../../util/wishlistService";
import "../../styles/components/hotelpage/HotelDetailHeader.scss";

const HotelDetailHeader = ({ hotel }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const isGuest = searchParams.get("guest") === "1";
    const basePath = isGuest ? "/booking-guest" : "/booking";
    const targetId = hotel?._id || hotel?.id;

    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (targetId) {
            setLiked(isWishlisted(targetId));
        }
    }, [targetId]);

    if (!hotel) return null;

    /* ===========================================================
        💰 실시간 최저가 계산
    =========================================================== */
    const getMinPrice = () => {
        if (hotel.rooms && Array.isArray(hotel.rooms) && hotel.rooms.length > 0) {
            const prices = hotel.rooms
                .map(r => Number(r.price))
                .filter(p => !isNaN(p) && p > 0);

            if (prices.length > 0) {
                return Math.min(...prices);
            }
        }
        return Number(hotel.displayPrice || hotel.price || 0);
    };

    /* ===========================================================
        ⭐ 리뷰 데이터 정합성 (실제 리뷰 배열 최우선)
    =========================================================== */
    // 1. 실제 리뷰 배열이 있으면 그 길이를, 없으면 0을 우선 적용 (가짜 85개 방어)
    const finalReviewCount = Array.isArray(hotel.reviews)
        ? hotel.reviews.length
        : (hotel.ratingCount || 0);

    // 2. 리뷰가 있을 때만 평점을 계산
    const finalRating = finalReviewCount > 0 ? Number(hotel.ratingAverage || 0) : 0;

    const handleWishlist = () => {
        const result = toggleWishlist(hotel);
        setLiked(result);
    };

    const handleBookNow = () => {
        const params = new URLSearchParams(searchParams);
        if (isGuest) params.set("guest", "1");
        navigate(`${basePath}/${targetId}?${params.toString()}`);
    };

    const handleShare = async () => {
        const currentUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: hotel.name, url: currentUrl });
            } catch (error) { console.log("공유 실패", error); }
        } else {
            navigator.clipboard.writeText(currentUrl);
            alert("링크가 복사되었습니다!");
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.round(rating);
        for (let i = 0; i < 5; i++) {
            stars.push(<FaStar key={i} className={i < fullStars ? "star-filled" : "star-empty"} />);
        }
        return stars;
    };

    return (
        <div className="hotel-detail-header">
            <div className="header-top">
                <div className="breadcrumb">
                    <span>{hotel.city || "지역"}</span> &gt; <span>{hotel.location || "위치"}</span> &gt; <span>{hotel.name}</span>
                </div>
            </div>

            <div className="hotel-info">
                <div className="hotel-title-section">
                    <h1 className="hotel-name">{hotel.name || "호텔명 없음"}</h1>

                    {/* ⭐ 리뷰가 있을 때만 별점과 평점 텍스트 노출 */}
                    {finalReviewCount > 0 ? (
                        <>
                            <div className="rating-section">
                                <div className="stars">{renderStars(finalRating)}</div>
                                <span className="rating-text">{finalRating.toFixed(1)}점</span>
                            </div>
                            <div className="location-section">
                                <FaMapMarkerAlt className="location-icon" />
                                <span className="address">{hotel.address || "주소 정보 없음"}</span>
                            </div>
                            <div className="review-section">
                                <span className="review-score">{finalRating.toFixed(1)}</span>
                                <span className="review-text">
                                    {finalRating >= 4.5 ? "최고" : finalRating >= 4.0 ? "아주 좋음" : "만족함"}
                                </span>
                                <span className="review-count">{finalReviewCount}개 리뷰</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="location-section no-review">
                                <FaMapMarkerAlt className="location-icon" />
                                <span className="address">{hotel.address || "주소 정보 없음"}</span>
                            </div>
                            <div className="review-section empty">
                                <span className="no-review-text">아직 등록된 리뷰가 없습니다</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="price-actions-wrap">
                    <div className="price-section">
                        <span className="price">
                            최저가 <span>₩{getMinPrice().toLocaleString()}</span>
                        </span>
                        <span className="price-unit">/박</span>
                    </div>
                    <div className="header-actions">
                        <button className={`icon-btn heart-btn ${liked ? "active" : ""}`} onClick={handleWishlist}>
                            {liked ? "♥" : "♡"}
                        </button>
                        <button className="icon-btn" onClick={handleShare}><FaShare /></button>
                        <button className="book-top-btn" onClick={handleBookNow}>예약하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetailHeader;