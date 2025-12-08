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
          <h3>필터</h3>

          {/* 가격 */}
          <div className="filter-box">
            <h4>가격</h4>
            <input type="range" min="0" max="300" />
            <div className="price-range">
              <span>₩0</span>
              <span>₩300,000</span>
            </div>
          </div>

          {/* 평점 */}
          <div className="filter-box">
            <h4>평점</h4>
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r}>{r}점</button>
              ))}
            </div>
          </div>

          {/* 편의시설 */}
          <div className="filter-box">
            <h4>편의시설</h4>
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
            <button className="active">호텔</button>
            <button>모텔</button>
            <button>리조트</button>
          </div>

          {/* HEADER + SORT */}
          <div className="results-header">
            <p>
              총 <strong>487</strong>개 중 <strong>4</strong>개 표시
            </p>

            <select>
              <option>추천순 정렬</option>
              <option>낮은 가격순</option>
              <option>높은 평점순</option>
            </select>
          </div>

          {/* HOTEL CARD */}
          <div className="hotel-card">
            <div className="img-box">
              <img src="/images/hotel01.jpg" alt="hotel" />
              <span className="img-count">사진 3장</span>
            </div>

            <div className="hotel-info">
              <h3>럭셔리 리조트</h3>
              <p className="hotel-desc">
                오션뷰, 수영장, 바, 무료 조식 포함
              </p>

              <div className="hotel-meta">
                <span>⭐ 4.8 (리뷰 200개)</span>
                <span>📍 서울 특별시</span>
              </div>

              <button className="view-btn">상세보기</button>
            </div>

            <div className="hotel-price">
              <span className="price">₩240,000</span>
              <span className="info">1박 기준</span>
            </div>
          </div>

          {/* MORE BUTTON */}
          <button className="load-more">더 많은 결과 보기</button>
        </main>
      </div>
    </div>
  );
};

export default HotelListPage;
