import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/home/MalakaTour.scss";

/* ===============================
   1위 호텔 선정 함수
================================ */
const getTopHotel = (hotelsData) => {
    // 💡 데이터가 객체 형태({ list: [...] })로 들어올 경우를 대비해 배열 추출
    const hotels = Array.isArray(hotelsData) ? hotelsData : hotelsData?.list;

    if (!hotels || hotels.length === 0) return null;

    // 원본 배열 보호를 위해 복사 후 정렬
    const sorted = [...hotels].sort((a, b) => {
        if (b.ratingAverage !== a.ratingAverage)
            return b.ratingAverage - a.ratingAverage;

        return (b.ratingCount || 0) - (a.ratingCount || 0);
    });

    return sorted[0];
};

/* ===============================
   설명 자동 생성 함수
================================ */
const generateDescription = (hotel) => {
    return [
        `${hotel.name}은(는) 많은 여행객들에게 사랑받는 인기 숙소입니다.`,
        `${hotel.city || hotel.location}에 위치해 뛰어난 접근성과 편안한 휴식을 제공하며, 높은 평점(${hotel.ratingAverage})과 리뷰 수(${hotel.ratingCount})가 그 만족도를 증명합니다.`,
        `지금 dm과 함께 ${hotel.name}에서 특별한 여행을 시작해 보세요.`,
    ];
};

const MalakaTour = ({ hotels }) => {
    const navigate = useNavigate();
    const topHotel = getTopHotel(hotels);

    // 데이터가 없으면 아무것도 렌더링하지 않음
    if (!topHotel) return null;

    // 기존 설명이 있으면 쓰고, 없으면 자동 생성
    const finalDescription =
        Array.isArray(topHotel.description)
            ? topHotel.description
            : generateDescription(topHotel);

    return (
        <div className="malaka-tour">
            <div className="tour-header">
                <h3 className="tour-title">{topHotel.name}</h3>

                {/* 평점 표시 */}
                <div className="price-tag rating-only">
                    <span>Rating</span>
                    <strong>
                        ⭐{" "}
                        {typeof topHotel.ratingAverage === "number"
                            ? topHotel.ratingAverage.toFixed(1)
                            : "0.0"}
                    </strong>
                </div>
            </div>

            <p className="tour-desc">
                {finalDescription.map((line, idx) => (
                    <React.Fragment key={idx}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </p>

            {/* 바로가기 → 해당 호텔 상세 페이지로 이동 */}
            <button
                className="malaka-book-btn"
                onClick={() => navigate(`/hotels/${topHotel.id || topHotel._id}`)}
            >
                바로가기
            </button>
        </div>
    );
};

export default MalakaTour;