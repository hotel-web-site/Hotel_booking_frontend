import { useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";

export function useMalakaTour(hotels) {
    const navigate = useNavigate();
    // 1위 호텔 선정
    const topHotel = useMemo(() => {
        const hotelsArr = Array.isArray(hotels) ? hotels : hotels?.list;
        if (!hotelsArr || hotelsArr.length === 0) return null;
        const sorted = [...hotelsArr].sort((a, b) => {
            if (b.ratingAverage !== a.ratingAverage)
                return b.ratingAverage - a.ratingAverage;
            return (b.ratingCount || 0) - (a.ratingCount || 0);
        });
        return sorted[0];
    }, [hotels]);

    // 설명 자동 생성
    const finalDescription = useMemo(() => {
        if (!topHotel) return [];
        if (Array.isArray(topHotel.description)) return topHotel.description;
        return [
            `${topHotel.name}은(는) 많은 여행객들에게 사랑받는 인기 숙소입니다.`,
            `${topHotel.city || topHotel.location}에 위치해 뛰어난 접근성과 편안한 휴식을 제공하며, 높은 평점(${topHotel.ratingAverage})과 리뷰 수(${topHotel.ratingCount})가 그 만족도를 증명합니다.`,
            `지금 dm과 함께 ${topHotel.name}에서 특별한 여행을 시작해 보세요.`,
        ];
    }, [topHotel]);

    // 상세 페이지 이동
    const goToDetail = useCallback(() => {
        if (topHotel) {
            navigate(`/hotels/${topHotel.id || topHotel._id}`);
        }
    }, [navigate, topHotel]);

    return {
        topHotel,
        finalDescription,
        goToDetail
    };
}
