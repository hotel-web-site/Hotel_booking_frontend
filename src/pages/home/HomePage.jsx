import React, { useEffect, useState } from "react";
import HeroSection from "../../components/home/HeroSection";
import PopularDestinations from "../../components/home/PopularDestinations";
import TravelMore from "../../components/home/TravelMore";
import { getHotels } from "../../api/hotelClient";   // 🔥 호텔 API 불러오기
import "../../styles/pages/home/HomePage.scss";

const HomePage = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await getHotels(); // 🔥 API 호출
                setHotels(data);
            } catch (err) {
                console.error("Failed to load hotels:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    return (
        <div className="home-page top-container">
            <HeroSection />

            <div className="homepage-container">
                <PopularDestinations />

                {/* 🔥 반드시 hotels 전달해야 TravelMore 내부에서 MalakaTour가 정상적으로 렌더링됨 */}
                <TravelMore hotels={hotels} />
            </div>
        </div>
    );
};

export default HomePage;
