import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../../styles/components/home/PopularDestinations.scss";
import { mockDestinations } from "../../api/mockData";
import DestinationCard from "./DestinationCard"; // ✅ 추가

const PopularDestinations = () => {
    return (
        <section className="destinations-container">
            <div className="container">
                <div className="section-header">
                    <div className="text-box">
                        <h2 className="section-title">여행에 빠지다</h2>
                        <p>특가상품으로 진행하는 여행을 예약해보세요</p>
                    </div>
                    <button className="btn--primary">See All</button>
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
                    {mockDestinations.map((destination) => (
                        <SwiperSlide key={destination.id}>
                            <DestinationCard destination={destination} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default PopularDestinations;
