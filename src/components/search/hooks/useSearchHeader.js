import { useCallback } from "react";

export function useSearchHeader({ filters, onFilterChange }) {
    // 핸들러를 useCallback으로 래핑하여 불필요한 렌더링 방지
    const handleInputChange = useCallback((key, value) => {
        onFilterChange(key, value);
    }, [onFilterChange]);

    const handleGuestsChange = useCallback((e) => {
        const [rooms, guests] = e.target.value.split(",").map(Number);
        onFilterChange("guests", { rooms, guests });
    }, [onFilterChange]);

    return {
        filters,
        handleInputChange,
        handleGuestsChange,
    };
}
