import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHotels } from "../../api/hotelClient"; // 이전에 만든 API 클라이언트
import "../../styles/pages/search/HotelListPage.scss";

const HotelListPage = () => {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [hotels, setHotels] = useState([]);      // 호텔 리스트
  const [total, setTotal] = useState(0);          // 전체 개수
  const [stats, setStats] = useState({});         // 탭별 숫자 (hotel, motel, resort)
  const [loading, setLoading] = useState(true);   // 로딩 상태
  const [activeTab, setActiveTab] = useState("hotel"); // 현재 선택된 탭

  // --- 데이터 불러오기 ---
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        // 백엔드 listHotels({ type: 'hotel' ... }) 호출
        const data = await getHotels({ type: activeTab });

        setHotels(data.list || []);
        setTotal(data.total || 0);
        setStats(data.typeStats || {});
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [activeTab]);

  return (
    <div className="hotel-list-page">
      <div className="content-container">

        {/* 1. 왼쪽 필터 (UI 유지) */}
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

        {/* 2. 오른쪽 결과 리스트 */}
        <main className="hotel-results">

          {/* CATEGORY TABS - 백엔드 통계 데이터(stats) 반영 */}
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

          {/* HEADER - 동적 개수 표시 */}
          <div className="results-header">
            <p>
              총 <strong>{total}</strong>개 중 <strong>{hotels.length}</strong>개 표시
            </p>
            <select>
              <option>추천순 정렬</option>
              <option>낮은 가격순</option>
              <option>높은 평점순</option>
            </select>
          </div>

          {/* HOTEL CARD - 데이터가 있을 때만 map으로 반복 생성 */}
          {loading ? (
            <p style={{ textAlign: "center", padding: "50px" }}>데이터를 불러오는 중입니다...</p>
          ) : hotels.length > 0 ? (
            hotels.map((hotel) => (
              <div className="hotel-card" key={hotel.id}>
                <div className="img-box">
                  {/* 이미지가 배열이므로 첫 번째 사진 사용 */}
                  <img src={hotel.images?.[0] || "/images/default-hotel.jpg"} alt={hotel.name} />
                  <span className="img-count">사진 {hotel.images?.length || 0}장</span>
                </div>

                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p className="hotel-desc">{hotel.description}</p>

                  <div className="hotel-meta">
                    <span>⭐ {hotel.ratingAverage} (리뷰 {hotel.ratingCount}개)</span>
                    <span>📍 {hotel.city}</span>
                  </div>

                  <button
                    className="view-btn"
                    onClick={() => navigate(`/hotels/${hotel.id}`)}
                  >
                    상세보기
                  </button>
                </div>

                <div className="hotel-price">
                  <span className="price">₩{hotel.basePrice?.toLocaleString()}</span>
                  <span className="info">1박 기준</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", padding: "50px" }}>검색 결과가 없습니다.</p>
          )}

          <button className="load-more">더 많은 결과 보기</button>
        </main>
      </div>
    </div>
  );
};

export default HotelListPage;