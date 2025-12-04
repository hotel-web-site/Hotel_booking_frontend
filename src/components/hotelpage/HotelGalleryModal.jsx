import React from "react";

const HotelGalleryModal = ({ images = [], name = "" }) => {
    return (
        <div className="hotel-gallery-modal">
            <div className="hotel-images">
                {/* 메인 이미지 */}
                <div className="main-image">
                    <img
                        src={
                            images[0] ||
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
                        }
                        alt={name}
                    />
                </div>

                {/* 서브 이미지 */}
                <div className="sub-images">
                    {images.slice(1, 5).map((img, index) => (
                        <div key={index} className="sub-image">
                            <img src={img} alt={`${name}_${index}`} />

                            {index === 3 && images.length > 5 && (
                                <div className="view-all-overlay">View all photos</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelGalleryModal;
