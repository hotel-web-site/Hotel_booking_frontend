import React from "react";
import "../../styles/components/home/TravelGallery.scss";

const TravelGallery = () => {
    return (
        <div className="travel-gallery">
            <div className="gallery-grid">
                <img src="/travel1.png" alt="travel1" className="gallery-img" />
                <img src="/travel2.png" alt="travel2" className="gallery-img" />
                <img src="/travel3.png" alt="travel3" className="gallery-img" />
                <img src="/travel4.png" alt="travel4" className="gallery-img" />
            </div>
        </div>
    );
};

export default TravelGallery;
