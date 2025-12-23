import React from "react";
import MalakaTour from "./MalakaTour";
import TravelGallery from "./TravelGallery";
import "../../styles/components/home/TravelMore.scss";
import { useTravelMore } from "./hooks/useTravelMore";

const TravelMore = ({ hotels }) => {
    const { goToRanking } = useTravelMore();
    return (
        <section className="travel-more">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">이달의 숙소</h2>
                    <button 
                        className="btn--primary"
                        onClick={goToRanking}
                    >
                        더 보러가기
                    </button>
                </div>
                <p className="section-subtitle">
                    여행 가실 거라면 제대로 즐기세요.
                    이달의 숙소는 이미 준비해두었습니다.
                </p>
                <div className="travel-content">
                    <MalakaTour hotels={hotels} />
                    <TravelGallery />
                </div>
            </div>
        </section>
    );
};

export default TravelMore;
