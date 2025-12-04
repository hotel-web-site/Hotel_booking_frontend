import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../../styles/components/home/PopularDestinations.scss";
import { getHotels } from "../../api/hotelClient"; // 🔥 호텔 리스트 API 가져오기
import DestinationCard from "./DestinationCard";

const PopularDestinations = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        const fetchHotels = async () => {
            const data = await getHotels(); // 🔥 mock 호텔 리스트 가져오기
            setHotels(data);
        };

        fetchHotels();
    }, []);

    return (
        <section className="destinations-container">
            <div className="inner">
                <div className="section-header">
                    <div className="text-box">
                        <h2 className="section-title">여행에 빠지다</h2>
                        <p>특가상품으로 진행하는 여행을 예약해보세요</p>
                    </div>
                    <button
                        className="btn--primary"
                        onClick={() => navigate("/search")}
                    >
                        See All
                    </button>
                </div>

                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={4}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                    className="destinations-swiper"
                >
                    {hotels.map((hotel) => (
                        <SwiperSlide key={hotel.id}>
                            <DestinationCard destination={hotel} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default PopularDestinations;
