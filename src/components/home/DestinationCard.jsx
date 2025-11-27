import React from "react";

const DestinationCard = ({ destination }) => {
    const { name, country, image, price, description } = destination;

    return (
        <div className="destination-card">
            <img className="card-img" src={image} alt={name} />

            <div className="card-body">
                <div className="name-price">
                    <h3>{name}</h3>
                    <span>₩{price.toLocaleString()}</span>
                </div>

                <p className="desc">{description}</p>

                <button className="book-btn">Book a Hotel</button>
            </div>
        </div>

    );
};

export default DestinationCard;