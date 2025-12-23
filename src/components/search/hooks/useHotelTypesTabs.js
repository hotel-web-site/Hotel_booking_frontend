import { useMemo } from "react";

export function useHotelTypesTabs(hotels) {
    const counts = useMemo(() => {
        if (!hotels || hotels.length === 0) return { hotels: 0, motels: 0, resorts: 0 };
        return {
            hotels: hotels.filter(h =>
                (h.type === "호텔" || h.category === "hotel" || h.type === "hotel")
            ).length,
            motels: hotels.filter(h =>
                (h.type === "모텔" || h.category === "motel" || h.type === "motel")
            ).length,
            resorts: hotels.filter(h =>
                (h.type === "리조트" || h.category === "resort" || h.type === "resort")
            ).length
        };
    }, [hotels]);
    return { counts };
}
