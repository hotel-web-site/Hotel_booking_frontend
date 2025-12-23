import React from "react";
import { useDestinationCard } from "./hooks/useDestinationCard";

const DestinationCard = ({ destination }) => {
    const { imgSrc, handleImgError, goToHotel } = useDestinationCard(destination);
    const { name, price, description } = destination;
    return (
        <div className="destination-card">
            <img
                className="card-img"
                src={imgSrc}
                alt={`${name} 호텔 이미지`}
                onError={handleImgError}
            />
            <div className="card-body">
                <div className="name-price">
                    <h3>{name}</h3>
                    <span>최저가 ₩{price.toLocaleString()}</span>
                </div>
                <p className="desc">{description}</p>
                <button
                    className="book-btn"
                    onClick={goToHotel}
                >
                    호텔 예약하기
                </button>
            </div>
        </div>
    );
};

export default DestinationCard;
