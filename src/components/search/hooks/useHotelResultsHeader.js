import { useState, useCallback } from "react";

export function useHotelResultsHeader(onSort) {
    const [open, setOpen] = useState(false);
    const [sortBy, setSortBy] = useState("추천순");
    const options = ["추천순", "가격 낮은순", "가격 높은순", "평점순"];

    const handleSelect = useCallback((option) => {
        setSortBy(option);
        setOpen(false);
        if (onSort) onSort(option);
    }, [onSort]);

    const handleDropdown = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    return {
        open,
        sortBy,
        options,
        handleSelect,
        handleDropdown,
        setOpen
    };
}
