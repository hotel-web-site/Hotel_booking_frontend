import React from "react";
import { useNavigate } from "react-router-dom";   // 🔥 추가
import MalakaTour from "./MalakaTour";
import TravelGallery from "./TravelGallery";
import "../../styles/components/home/TravelMore.scss";

const TravelMore = ({ hotels }) => {
    const navigate = useNavigate();   // 🔥 페이지 이동 함수 준비

    return (
        <section className="travel-more">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">이달의 숙소</h2>

                    {/* 🔥 클릭 시 랭킹 페이지로 이동 */}
                    <button 
                        className="btn--primary"
                        onClick={() => navigate("/ranking")}
                    >
                        더 보러가기
                    </button>
                </div>

                <p className="section-subtitle">
                    여행 가실 거라면 제대로 즐기세요.
                    이달의 숙소는 이미 준비해두었습니다.
                </p>

                <div className="travel-content">
                    {/* 🔥 1위 호텔 카드 */}
                    <MalakaTour hotels={hotels} />

                    {/* 🔥 여행 갤러리 */}
                    <TravelGallery />
                </div>
            </div>
        </section>
    );
};

export default TravelMore;
