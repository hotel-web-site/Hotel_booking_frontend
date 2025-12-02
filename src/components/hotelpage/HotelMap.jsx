import React from "react";
import "../../styles/components/hotelpage/HotelMap.scss";

const HotelMap = ({ address, location }) => {
    const GOOGLE_MAPS_API_KEY = "AIzaSyDHcx9sCPnQhwcKlC5uHDUgqOJTXqJ5234";
    const encodedAddress = encodeURIComponent(address || "서울시청");

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedAddress}&zoom=15`;
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    return (
        <div className="hotel-map">
            {/* 상단 제목 + 버튼 */}
            <div className="map-header">
                <h3 className="map-title">지도보기</h3>
                <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link"
                >
                    View on google maps
                </a>
            </div>

            {/* 실제 지도 */}
            <div className="map-container">
                <iframe
                    width="100%"
                    height="380"
                    style={{ border: 0 }}
                    src={mapUrl}
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            </div>

            {/* 주소 */}
            <p className="address-text">
                <span className="pin">📍</span>
                {address}
            </p>

            <div className="divider"></div>
        </div>
    );
};

export default HotelMap;
