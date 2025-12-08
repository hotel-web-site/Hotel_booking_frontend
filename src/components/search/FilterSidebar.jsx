import React, { useState } from "react";
import "../../styles/components/search/FilterSidebar.scss";

const MIN_PRICE = 50000;
const MAX_PRICE = 1200000;
const STEP_PRICE = 50000;

// 🔑 key: 실제 검색에 사용할 문자열, label: 화면에 보여줄 텍스트
const FREEBIE_OPTIONS = [
  { key: "조식포함", label: "조식 포함" },
  { key: "무료주차", label: "무료 주차" },
  { key: "wifi", label: "WIFI" },
  { key: "공항셔틀버스", label: "공항셔틀버스" },
  { key: "무료취소", label: "무료 취소" },
];

// 🔑 amenities도 key/label 분리
// key는 실제 hotelClient 데이터에 있는 단어로 맞춰 둠
const AMENITY_OPTIONS = [
  { key: "24시 프론트데스크", label: "24시 프론트데스크" }, // (mock 데이터엔 아직 없음)
  { key: "에어컨", label: "에어컨" },                      // 객실 amenities에 "에어컨"
  { key: "Gym", label: "피트니스" },                       // Busan 호텔 amenities에 "Gym"
  { key: "Pool", label: "수영장" },                        // 호텔 amenities에 "Pool"
];

const FilterSidebar = ({ filters, onFilterChange }) => {
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
  let [currentMin, currentMax] =
    Array.isArray(filters?.priceRange) && filters.priceRange.length === 2
      ? filters.priceRange
      : [MIN_PRICE, MAX_PRICE];

  if (currentMin < MIN_PRICE) currentMin = MIN_PRICE;
  if (currentMax < MIN_PRICE || currentMax > MAX_PRICE)
    currentMax = MAX_PRICE;

  const handlePriceChange = (value) => {
    const max = Number(value);
    onFilterChange("priceRange", [MIN_PRICE, max]);
  };

  const formatKRW = (value) =>
    value.toLocaleString("ko-KR", { maximumFractionDigits: 0 }) + "원";

  /* -------------------- ⭐ Rating -------------------- */
  const ratingValue =
    typeof filters.rating === "number" ? filters.rating : 0;

  const handleRatingClick = (value) => {
    const next = ratingValue === value ? 0 : value; // 다시 누르면 해제
    onFilterChange("rating", next);
  };

  /* -------------------- 🎁 / 🏊 체크박스 -------------------- */
  const freebies = filters.freebies || [];
  const amenities = filters.amenities || [];

  const handleFreebieToggle = (key, checked) => {
    const next = checked
      ? [...freebies, key]
      : freebies.filter((f) => f !== key);
    onFilterChange("freebies", next);
  };

  const handleAmenityToggle = (key, checked) => {
    const next = checked
      ? [...amenities, key]
      : amenities.filter((a) => a !== key);
    onFilterChange("amenities", next);
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
            {[0, 1, 2, 3, 4].map((value) => (
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
                  onChange={(e) =>
                    handleFreebieToggle(opt.key, e.target.checked)
                  }
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
                  onChange={(e) =>
                    handleAmenityToggle(opt.key, e.target.checked)
                  }
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