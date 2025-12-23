import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toggleWishlist, isWishlisted } from "../../../util/wishlistService";

export function useHotelListCards(hotels = [], filters = {}, isGuest) {
    const navigate = useNavigate();
    const [likes, setLikes] = useState({});
    const [visibleCount, setVisibleCount] = useState(6);

    const buildParams = useCallback(() => {
        const params = new URLSearchParams();
        const guests = filters?.guests || { adults: 2, children: 0, total: 2 };
        if (filters?.destination) params.set("destination", filters.destination);
        if (filters?.checkIn) params.set("checkIn", filters.checkIn);
        if (filters?.checkOut) params.set("checkOut", filters.checkOut);
        params.set("adults", guests.adults ?? 2);
        params.set("children", guests.children ?? 0);
        params.set("guests", (Number(guests.adults || 2) + Number(guests.children || 0)));
        if (isGuest) params.set("guest", "1");
        return params.toString();
    }, [filters, isGuest]);

    const goToHotelDetail = useCallback((hotelId) => {
        const queryString = buildParams();
        navigate(`/hotels/${hotelId}?${queryString}`);
    }, [buildParams, navigate]);

    useEffect(() => {
        const initial = {};
        hotels.forEach((hotel) => {
            const id = hotel._id || hotel.id;
            if (id) initial[id] = isWishlisted(id);
        });
        setLikes(initial);
    }, [hotels]);

    const handleWishlist = useCallback((e, hotel) => {
        e.stopPropagation();
        const id = hotel._id || hotel.id;
        const result = toggleWishlist(hotel);
        setLikes((prev) => ({ ...prev, [id]: result }));
    }, []);

    const handleLoadMore = useCallback(() => {
        setVisibleCount((prev) => prev + 6);
    }, []);

    const visibleHotels = hotels.slice(0, visibleCount);

    return {
        likes,
        visibleCount,
        setVisibleCount,
        goToHotelDetail,
        handleWishlist,
        visibleHotels,
        handleLoadMore
    };
}
