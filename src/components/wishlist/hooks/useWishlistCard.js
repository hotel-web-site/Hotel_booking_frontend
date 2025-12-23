import { useNavigate } from "react-router-dom";
import { removeFromWishlist } from "../../../util/wishlistService";

export function useWishlistCard(hotel, onRemove) {
    const navigate = useNavigate();
    const handleRemove = () => {
        const id = hotel._id || hotel.id;
        removeFromWishlist(id);
        if (onRemove) onRemove(id);
    };
    const goToDetail = () => {
        navigate(`/hotels/${hotel.id}`);
    };
    return {
        handleRemove,
        goToDetail
    };
}
