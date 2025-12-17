import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toggleWishlist, isWishlisted } from "../../util/wishlistService";
import "../../styles/components/hotelpage/HotelDetailHeader.scss";

const HotelDetailHeader = ({ hotel }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // ⭐ 비회원 여부 확인
    const isGuest = searchParams.get("guest") === "1";
    const basePath = isGuest ? "/booking-guest" : "/booking";

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

    /* ===========================================================
       🔥 예약 버튼 → guest 모드 유지해서 이동
    =========================================================== */
    const handleBookNow = () => {
        const params = new URLSearchParams();

        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");
        const adults = searchParams.get("adults") || 2;
        const children = searchParams.get("children") || 0;

        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);

        params.set("adults", adults);
        params.set("children", children);

        // ⭐ guest=1 유지
        if (isGuest) params.set("guest", "1");

        // ⭐ 회원/비회원에 따라 booking path 자동 선택
        navigate(`${basePath}/${hotel._id || hotel.id}?${params.toString()}`);
    };

    const handleShare = async () => {
        const currentUrl = window.location.href;

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

        try {
            await navigator.clipboard.writeText(currentUrl);
            alert("현재 페이지 링크가 복사되었습니다!");
        } catch (error) {
            console.error("URL 복사 실패:", error);
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
            <div className="header-top">
                <div className="breadcrumb">
                    <span>{city}</span> &gt; <span>{location}</span> &gt; <span>{name}</span>
                </div>
            </div>

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

                <div className="price-actions-wrap">
                    <div className="price-section">
                        <span className="price">
                            최저가 <span>₩{(hotel.basePrice ?? hotel.price ?? 0).toLocaleString()}</span>
                        </span>
                        <span className="price-unit">/박</span>
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn heart-btn" onClick={handleWishlist}>
                            {liked ? "♥" : "♡"}
                        </button>

                        <button className="icon-btn" onClick={handleShare}>
                            <FaShare />
                        </button>

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
