// src/pages/ranking/RankingPage.jsx
import React, { useEffect, useState } from "react";
import { getHotels } from "../../api/hotelClient";
import RankingList from "../../components/ranking/RankingList";
import "../../styles/pages/ranking/RankingPage.scss";

const RankingPage = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await getHotels();
            setHotels(data);
        };
        load();
    }, []);

    return (
        <div className="ranking-page">
            <div className="ranking-header">
                <p className="ranking-eyebrow">dm Pick</p>
                <h1 className="ranking-title">숙소 랭킹 TOP 10</h1>
                <p className="ranking-subtitle">
                    dm 이용자들이 가장 사랑한 숙소를 평점과 리뷰 기준으로 엄선했어요.
                </p>
            </div>

            <RankingList hotels={hotels} />
        </div>
    );
};

export default RankingPage;
