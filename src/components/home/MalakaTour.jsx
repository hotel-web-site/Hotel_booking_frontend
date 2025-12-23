import React from "react";
import "../../styles/components/home/MalakaTour.scss";
import { useMalakaTour } from "./hooks/useMalakaTour";

const MalakaTour = ({ hotels }) => {
    const { topHotel, finalDescription, goToDetail } = useMalakaTour(hotels);
    if (!topHotel) return null;
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
                onClick={goToDetail}
            >
                바로가기
            </button>
        </div>
    );
};

export default MalakaTour;