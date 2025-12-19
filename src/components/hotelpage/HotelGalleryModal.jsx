import React from "react";

const HotelGalleryModal = ({ images = [], name = "", mainFallbackImage = "" }) => {

    // 우선순위: 상세 이미지 배열 첫번째 -> 부모가 찾아서 보내준 메인 이미지 -> 기본 이미지
    const getDisplayImage = () => {
        if (Array.isArray(images) && images.length > 0) {
            const firstValid = images.find(img => img && typeof img === "string");
            if (firstValid) return firstValid;
        }

        if (mainFallbackImage) return mainFallbackImage;

        return "/assets/images/default-hotel.jpg";
    };

    const finalSrc = getDisplayImage();

    return (
        <div className="hotel-gallery-modal">
            <div className="hotel-images">
                <div className="main-image" style={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                    <img
                        src={finalSrc}
                        alt={`${name} 대표 이미지`}
                        style={{ width: "100%", height: "450px", objectFit: "cover", display: "block" }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/images/default-hotel.jpg";
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default HotelGalleryModal;