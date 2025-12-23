
import React from "react";
import "../../styles/pages/search/HotelListPage.scss";
import useHotelListPage from "./hooks/useHotelListPage";

const HotelListPage = () => {
  const {
    hotels,
    total,
    stats,
    loading,
    activeTab,
    setActiveTab,
    navigate,
  } = useHotelListPage();

  return (
    <div className="hotel-list-page">
      <div className="content-container">
        <aside className="filters">
          <h3>필터</h3>
          <div className="filter-box">
            <h4>가격</h4>
            <input type="range" min="0" max="500000" />
            <div className="price-range">
              <span>₩0</span>
              <span>₩500,000</span>
            </div>
          </div>
          <div className="filter-box">
            <h4>평점</h4>
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r}>{r}점</button>
              ))}
            </div>
          </div>
          <div className="filter-box">
            <h4>편의시설</h4>
            {["무료 WiFi", "수영장", "조식 포함", "에어컨", "헬스장", "주차"].map((a, i) => (
              <label key={i}>
                <input type="checkbox" /> {a}
              </label>
            ))}
          </div>
        </aside>
        <main className="hotel-results">
          <div className="category-tabs">
            <button
              className={activeTab === "hotel" ? "active" : ""}
              onClick={() => setActiveTab("hotel")}
            >
              호텔 ({stats.hotel || 0})
            </button>
            <button
              className={activeTab === "motel" ? "active" : ""}
              onClick={() => setActiveTab("motel")}
            >
              모텔 ({stats.motel || 0})
            </button>
            <button
              className={activeTab === "resort" ? "active" : ""}
              onClick={() => setActiveTab("resort")}
            >
              리조트 ({stats.resort || 0})
            </button>
          </div>
          {loading ? (
            <div className="loading">로딩 중...</div>
          ) : hotels.length === 0 ? (
            <div className="empty">검색 결과가 없습니다.</div>
          ) : (
            <ul className="hotel-list">
              {hotels.map((hotel) => (
                <li
                  key={hotel.id}
                  className="hotel-item"
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                >
                  <img src={hotel.images?.[0] || hotel.image} alt={hotel.name} />
                  <div className="hotel-info">
                    <h3>{hotel.name}</h3>
                    <p>{hotel.address}</p>
                    <p>₩{hotel.price?.toLocaleString() || "-"}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}

export default HotelListPage;