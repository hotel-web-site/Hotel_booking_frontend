import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE = "/fallback-hotel.jpg";

export function useDestinationCard(destination) {
    const navigate = useNavigate();
    const [imgSrc, setImgSrc] = useState(
        destination.image && destination.image.trim() !== "" ? destination.image : FALLBACK_IMAGE
    );
    const goToHotel = useCallback((e) => {
        e.stopPropagation();
        navigate(`/hotels/${destination.id}`);
    }, [navigate, destination.id]);
    const handleImgError = useCallback(() => {
        setImgSrc(FALLBACK_IMAGE);
    }, []);
    return {
        imgSrc,
        setImgSrc,
        goToHotel,
        handleImgError
    };
}
