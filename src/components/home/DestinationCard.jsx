import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // ⭐ navigate import 추가

const FALLBACK_IMAGE = "/fallback-hotel.jpg"; // public 기준

const DestinationCard = ({ destination }) => {
    const navigate = useNavigate();               // ⭐ navigate 선언

    const { id, name, country, image, price, description } = destination;

    // ✅ 이미지 없으면 바로 폴백
    const [imgSrc, setImgSrc] = useState(
        image && image.trim() !== "" ? image : FALLBACK_IMAGE
    );

    return (
        <div className="destination-card">
            <img
                className="card-img"
                src={imgSrc}
                alt={`${name} 호텔 이미지`}          // ✅ alt 처리
                onError={() => setImgSrc(FALLBACK_IMAGE)} // ✅ 로딩 실패 시 폴백
            />

            <div className="card-body">
                <div className="name-price">
                    <h3>{name}</h3>
                    <span>최저가 ₩{price.toLocaleString()}</span>
                </div>

                <p className="desc">{description}</p>

                <button
                    className="book-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/hotels/${id}`);
                    }}
                >
                    호텔 예약하기
                </button>
            </div>
        </div>
    );
};

export default DestinationCard;
