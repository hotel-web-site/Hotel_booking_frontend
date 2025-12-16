// src/components/search/HotelListCards.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/search/HotelListCards.scss";
import { toggleWishlist, isWishlisted } from "../../util/wishlistService";

const HotelListCards = ({ hotels = [], filters = {}, isGuest }) => {
    const navigate = useNavigate();

    const [likes, setLikes] = useState({});
    const [visibleCount, setVisibleCount] = useState(6);

    /** 🔥 guests 구조 준비 */
    const guests = filters.guests || {
        adults: 2,
        children: 0,
        total: 2,
    };

    /** 🔥 URL 파라미터 생성 함수 (params 객체 반환) */
    const buildParams = () => {
        const params = new URLSearchParams();

        if (filters.destination) params.set("destination", filters.destination);
        if (filters.checkIn) params.set("checkIn", filters.checkIn);
        if (filters.checkOut) params.set("checkOut", filters.checkOut);

        params.set("adults", guests.adults);
        params.set("children", guests.children);
        params.set("guests", guests.total);

        return params;
    };

    const baseParams = buildParams();

    /** ⭐ 호텔 상세 페이지로 이동 (guest=1 유지 포함) */
    const goToHotelDetail = (hotelId) => {
        const params = new URLSearchParams(baseParams);
        if (isGuest) params.set("guest", "1");

        navigate(`/hotels/${hotelId}?${params.toString()}`);
    };

    /** 🔥 초기 찜 로딩 */
    useEffect(() => {
        const initial = {};
        hotels.forEach((hotel) => {
            const id = hotel._id || hotel.id;
            initial[id] = isWishlisted(id);
        });
        setLikes(initial);
    }, [hotels]);

    /** 찜 버튼 */
    const handleWishlist = (e, hotel) => {
        e.stopPropagation();
        const id = hotel._id || hotel.id;

        const result = toggleWishlist(hotel);
        setLikes((prev) => ({ ...prev, [id]: result }));
    };

    /** 날짜 범위 만들기 */
    const getDateRange = () => {
        if (!filters.checkIn || !filters.checkOut) return [];
        const start = new Date(filters.checkIn);
        const end = new Date(filters.checkOut);

        const days = [];
        let cur = new Date(start);
        while (cur <= end) {
            days.push(cur.toISOString().split("T")[0]);
            cur.setDate(cur.getDate() + 1);
        }
        return days;
    };

    const neededDates = getDateRange();

    /** 🔥 호텔 필터링 (인원수 + 날짜 조건 포함) */
    const filteredHotels = hotels.filter((hotel) => {
        const totalGuests = filters?.guests?.total || 1;

        // 인원 조건
        const fitsGuests = hotel.rooms?.some(
            (room) => room.maxGuests >= totalGuests
        );
        if (!fitsGuests) return false;

        // 날짜 조건
        if (neededDates.length > 0) {
            const fitsDates = hotel.rooms?.some((room) =>
                neededDates.every((d) => room.availableDates?.includes(d))
            );
            if (!fitsDates) return false;
        }

        return true;
    });

    /** 출력할 호텔 목록 */
    const visibleHotels = filteredHotels.slice(0, visibleCount);

    /** 검색 결과 없음 */
    if (filteredHotels.length === 0) {
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
                    hotel.rooms && hotel.rooms.length > 0
                        ? hotel.rooms[0]
                        : {};

                const price = mainRoom?.price ?? null;
                const amenitiesCount = mainRoom?.amenities?.length || 0;

                const liked = !!likes[id];
                const ratingScore = hotel.ratingAverage ?? hotel.rating ?? "-";
                const ratingReviews = hotel.ratingCount ?? hotel.reviews ?? 0;

                return (
                    <div
                        key={id}
                        className="hotel-card"
                        onClick={() => goToHotelDetail(hotel.id)}
                    >
                        {/* 이미지 */}
                        <div className="hotel-image">
                            <img src={hotel.image} alt={hotel.name} />
                        </div>

                        {/* 호텔 정보 */}
                        <div className="hotel-info">
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

                            <div className="hotel-location">
                                {hotel.location}
                            </div>

                            <div className="hotel-meta">
                                <div className="hotel-amenities">
                                    {amenitiesCount}개 편의시설
                                </div>
                            </div>

                            <div className="hotel-rating">
                                <span className="rating-score">
                                    {ratingScore}
                                </span>
                                <span className="rating-reviews">
                                    {ratingReviews}개 리뷰
                                </span>
                            </div>

                            <div className="card-divider"></div>

                            <div className="hotel-footer">
                                {/* 찜 */}
                                <button
                                    className="wishlist-button"
                                    onClick={(e) => handleWishlist(e, hotel)}
                                >
                                    {liked ? "♥" : "♡"}
                                </button>

                                {/* 상세보기 */}
                                <button
                                    className="view-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToHotelDetail(hotel.id);
                                    }}
                                >
                                    상세보기
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {visibleCount < filteredHotels.length && (
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
