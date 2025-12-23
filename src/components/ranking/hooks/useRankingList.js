import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useRankingList(hotels) {
    const navigate = useNavigate();
    const sorted = useMemo(() => {
        return [...hotels]
            .sort((a, b) => {
                if (b.ratingAverage !== a.ratingAverage)
                    return b.ratingAverage - a.ratingAverage;
                return (b.ratingCount || 0) - (a.ratingCount || 0);
            })
            .slice(0, 10);
    }, [hotels]);
    const goToHotel = useCallback((id) => {
        navigate(`/hotels/${id}`);
    }, [navigate]);
    return { sorted, goToHotel };
}
