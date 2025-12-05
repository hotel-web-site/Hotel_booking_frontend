import React from "react";
import { useNavigate } from "react-router-dom";   // ⭐ navigate import 추가

const DestinationCard = ({ destination }) => {
    const navigate = useNavigate();               // ⭐ navigate 선언

    const { id, name, country, image, price, description } = destination;

    return (
        <div className="destination-card">
            <img className="card-img" src={image} alt={name} />

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
                        navigate(`/hotels/${id}`);  // ⭐ destination.id로 이동
                    }}
                >
                    Book a Hotel
                </button>
            </div>
        </div>
    );
};

export default DestinationCard;
