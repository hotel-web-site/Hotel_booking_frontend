import React from "react";
import "../../styles/pages/search/HotelListPage.scss";

const HotelListPage = () => {
  return (
    <div className="hotel-list-page">

      <div className="content-container">

        {/* ------------------------------
            LEFT FILTERS
        -------------------------------- */}
        <aside className="filters">
          <h3>Filters</h3>

          {/* Price */}
          <div className="filter-box">
            <h4>Price</h4>
            <input type="range" min="0" max="300" />
            <div className="price-range">
              <span>$0</span>
              <span>$300</span>
            </div>
          </div>

          {/* Rating */}
          <div className="filter-box">
            <h4>Rating</h4>
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r}>{r}★</button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="filter-box">
            <h4>Amenities</h4>
            {[
              "무료 WiFi",
              "수영장",
              "조식 포함",
              "에어컨",
              "헬스장",
              "주차",
            ].map((a, i) => (
              <label key={i}>
                <input type="checkbox" /> {a}
              </label>
            ))}
          </div>
        </aside>

        {/* ------------------------------
            RIGHT HOTEL RESULT LIST
        -------------------------------- */}
        <main className="hotel-results">

          {/* CATEGORY TABS */}
          <div className="category-tabs">
            <button className="active">Hotels</button>
            <button>Motels</button>
            <button>Resorts</button>
          </div>

          {/* HEADER + SORT */}
          <div className="results-header">
            <p>
              Showing <strong>4</strong> of <strong>487</strong> places
            </p>

            <select>
              <option>Sort by Recommended</option>
              <option>Lowest Price</option>
              <option>Highest Rating</option>
            </select>
          </div>

          {/* HOTEL CARD */}
          <div className="hotel-card">
            <div className="img-box">
              <img src="/images/hotel01.jpg" alt="hotel" />
              <span className="img-count">3 images</span>
            </div>

            <div className="hotel-info">
              <h3>럭셔리 리조트</h3>
              <p className="hotel-desc">
                오션뷰, 수영장, 바, 무료 조식 포함
              </p>

              <div className="hotel-meta">
                <span>⭐ 4.8 (200 reviews)</span>
                <span>📍 서울 특별시</span>
              </div>

              <button className="view-btn">View Place</button>
            </div>

            <div className="hotel-price">
              <span className="price">₩240,000</span>
              <span className="info">1박 기준</span>
            </div>
          </div>

          {/* MORE BUTTON */}
          <button className="load-more">Show more results</button>
        </main>
      </div>
    </div>
  );
};

export default HotelListPage;
