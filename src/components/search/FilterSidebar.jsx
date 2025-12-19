import React, { useState } from "react";
import "../../styles/components/search/FilterSidebar.scss";

const MIN_PRICE = 50000;
const MAX_PRICE = 1200000;
const STEP_PRICE = 50000;

const FREEBIE_OPTIONS = [
  { key: "무료 WiFi", label: "WIFI" },
  { key: "주차장", label: "주차장" },
  { key: "수영장", label: "수영장" },
  { key: "공항셔틀버스", label: "공항셔틀버스" },
  { key: "무료취소", label: "무료 취소" },
];

const AMENITY_OPTIONS = [
  { key: "24시 프론트데스크", label: "24시 프론트데스크" },
  { key: "에어컨", label: "에어컨" },
  { key: "Gym", label: "피트니스" },
  { key: "Pool", label: "수영장" },
];

const FilterSidebar = ({ filters, onFilterChange }) => {
  // 기존 아코디언 상태 유지
  const [open, setOpen] = useState({
    price: true,
    rating: true,
    freebies: true,
    amenities: true,
  });

  const toggle = (key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* -------------------- 💰 가격 -------------------- */
  // filters.priceRange가 없을 경우를 대비한 안전한 할당
  const currentMax = filters?.priceRange?.[1] ?? MAX_PRICE;

  const handlePriceChange = (value) => {
    const max = Number(value);
    onFilterChange("priceRange", [MIN_PRICE, max]);
  };

  const formatKRW = (value) =>
    value.toLocaleString("ko-KR", { maximumFractionDigits: 0 }) + "원";

  /* -------------------- ⭐ 평점 -------------------- */
  const ratingValue = typeof filters?.rating === "number" ? filters.rating : 0;

  const handleRatingClick = (value) => {
    const next = ratingValue === value ? 0 : value;
    onFilterChange("rating", next);
  };

  /* -------------------- 🎁 / 🏊 체크박스 통합 관리 -------------------- */
  const freebies = filters?.freebies || [];
  const amenities = filters?.amenities || [];

  const handleToggle = (type, key, checked) => {
    const currentList = type === "freebies" ? freebies : amenities;
    const next = checked
      ? [...currentList, key]
      : currentList.filter((item) => item !== key);
    onFilterChange(type, next);
  };

  return (
    <aside className="filter-sidebar">
      <h3 className="filter-title">필터</h3>

      {/* PRICE */}
      <div className="filter-box">
        <div className="filter-header" onClick={() => toggle("price")}>
          <h4>가격</h4>
          <span className={`arrow ${open.price ? "open" : ""}`}>⌃</span>
        </div>

        <div className={`filter-body ${open.price ? "show" : ""}`}>
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP_PRICE}
            value={currentMax}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="price-slider"
          />

          <div className="price-labels">
            <span>{formatKRW(MIN_PRICE)}</span>
            <span>{formatKRW(MAX_PRICE)}</span>
          </div>

          <div className="price-current">
            선택한 최대 금액: <strong>{formatKRW(currentMax)}</strong>
          </div>
        </div>
      </div>

      {/* RATING */}
      <div className="filter-box">
        <div className="filter-header" onClick={() => toggle("rating")}>
          <h4>평점</h4>
          <span className={`arrow ${open.rating ? "open" : ""}`}>⌃</span>
        </div>

        <div className={`filter-body ${open.rating ? "show" : ""}`}>
          <div className="rating-options">
            {/* 사용자 경험을 위해 1+ 부터 4+까지 표시 (기존 구조 유지) */}
            {[1, 2, 3, 4].map((value) => (
              <button
                key={value}
                type="button"
                className={ratingValue === value ? "active" : ""}
                onClick={() => handleRatingClick(value)}
              >
                {value}+
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FREEBIES */}
      <div className="filter-box">
        <div className="filter-header" onClick={() => toggle("freebies")}>
          <h4>무료 제공</h4>
          <span className={`arrow ${open.freebies ? "open" : ""}`}>⌃</span>
        </div>

        <div className={`filter-body ${open.freebies ? "show" : ""}`}>
          <div className="checkbox-list">
            {FREEBIE_OPTIONS.map((opt) => (
              <label key={opt.key}>
                <input
                  type="checkbox"
                  checked={freebies.includes(opt.key)}
                  onChange={(e) => handleToggle("freebies", opt.key, e.target.checked)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* AMENITIES */}
      <div className="filter-box">
        <div className="filter-header" onClick={() => toggle("amenities")}>
          <h4>편의시설</h4>
          <span className={`arrow ${open.amenities ? "open" : ""}`}>⌃</span>
        </div>

        <div className={`filter-body ${open.amenities ? "show" : ""}`}>
          <div className="checkbox-list">
            {AMENITY_OPTIONS.map((opt) => (
              <label key={opt.key}>
                <input
                  type="checkbox"
                  checked={amenities.includes(opt.key)}
                  onChange={(e) => handleToggle("amenities", opt.key, e.target.checked)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;