import { useState, useCallback } from "react";

const MIN_PRICE = 50000;
const MAX_PRICE = 1200000;
const STEP_PRICE = 50000;

export function useFilterSidebar(filters, onFilterChange) {
  const [open, setOpen] = useState({
    price: true,
    rating: true,
    freebies: true,
    amenities: true,
  });

  const toggle = useCallback((key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const currentMax = filters?.priceRange?.[1] ?? MAX_PRICE;
  const handlePriceChange = useCallback((value) => {
    const max = Number(value);
    onFilterChange("priceRange", [MIN_PRICE, max]);
  }, [onFilterChange]);

  const formatKRW = (value) => value.toLocaleString("ko-KR", { maximumFractionDigits: 0 }) + "원";

  const ratingValue = typeof filters?.rating === "number" ? filters.rating : 0;
  const handleRatingClick = useCallback((value) => {
    const next = ratingValue === value ? 0 : value;
    onFilterChange("rating", next);
  }, [ratingValue, onFilterChange]);

  const freebies = filters?.freebies || [];
  const amenities = filters?.amenities || [];
  const handleToggle = useCallback((type, key, checked) => {
    const currentList = type === "freebies" ? freebies : amenities;
    const next = checked
      ? [...currentList, key]
      : currentList.filter((item) => item !== key);
    onFilterChange(type, next);
  }, [freebies, amenities, onFilterChange]);

  return {
    open,
    toggle,
    currentMax,
    handlePriceChange,
    formatKRW,
    ratingValue,
    handleRatingClick,
    freebies,
    amenities,
    handleToggle,
    MIN_PRICE,
    MAX_PRICE,
    STEP_PRICE
  };
}
