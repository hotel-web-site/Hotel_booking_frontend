import { useState, useEffect, useCallback } from "react";

const normalize = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
const DEFAULT_GUESTS = { adults: 2, children: 0, total: 2 };

export function useSearchFilterWrap({ filters = {}, onFilterChange, onSearch, hotels = [] }) {
    const [keyword, setKeyword] = useState(filters.destination || "");
    const [checkIn, setCheckIn] = useState(filters.checkIn || "");
    const [checkOut, setCheckOut] = useState(filters.checkOut || "");
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [guests, setGuests] = useState(() => {
        if (filters.guests) {
            const a = Number(filters.guests.adults) || 2;
            const c = Number(filters.guests.children) || 0;
            return { adults: a, children: c, total: a + c };
        }
        return DEFAULT_GUESTS;
    });

    useEffect(() => {
        const total = Number(guests.adults) + Number(guests.children);
        if (guests.total !== total) {
            const updatedGuests = { ...guests, total };
            setGuests(updatedGuests);
            onFilterChange?.("guests", updatedGuests);
        }
    }, [guests.adults, guests.children, onFilterChange]);

    useEffect(() => {
        setKeyword(filters.destination || "");
        setCheckIn(filters.checkIn || "");
        setCheckOut(filters.checkOut || "");
        if (filters.guests) {
            setGuests({
                adults: Number(filters.guests.adults) || 2,
                children: Number(filters.guests.children) || 0,
                total: (Number(filters.guests.adults) || 2) + (Number(filters.guests.children) || 0)
            });
        }
    }, [filters]);

    useEffect(() => {
        const term = normalize(keyword);
        if (!term) return setSuggestions([]);
        const matches = hotels
            .filter((hotel) => normalize(hotel.name).includes(term))
            .slice(0, 5);
        setSuggestions(matches);
    }, [keyword, hotels]);

    const handleSearch = useCallback(() => {
        const payload = {
            destination: keyword,
            checkIn,
            checkOut,
            guests,
        };
        onSearch?.(payload);
        const params = new URLSearchParams();
        if (keyword) params.set("destination", keyword);
        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);
        params.set("adults", guests.adults);
        params.set("children", guests.children);
        params.set("guests", guests.total);
        window.history.replaceState(null, "", `?${params.toString()}`);
    }, [keyword, checkIn, checkOut, guests, onSearch]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                const selectedName = suggestions[activeIndex].name;
                setKeyword(selectedName);
                onFilterChange?.("destination", selectedName);
                setSuggestions([]);
                handleSearch();
            } else {
                handleSearch();
            }
        }
        if (e.key === "ArrowDown") {
            setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        }
        if (e.key === "ArrowUp") {
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }
    }, [activeIndex, suggestions, handleSearch, onFilterChange]);

    return {
        keyword,
        setKeyword,
        checkIn,
        setCheckIn,
        checkOut,
        setCheckOut,
        guests,
        setGuests,
        suggestions,
        setSuggestions,
        activeIndex,
        setActiveIndex,
        handleSearch,
        handleKeyDown,
    };
}
