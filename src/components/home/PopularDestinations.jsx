import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/components/home/PopularDestinations.scss";
import DestinationCard from "./DestinationCard";
import { mockDestinations } from "../../api/mockData";

const PopularDestinations = () => {
    return (
        <section className="container">
            <div className="inner">
                <div className="section-header">
                    <h2>어떻게 빠지다</h2>
                    <p>최고의호주로 여행놓은 드롭을 생애에빠뜨440</p>
                    <button className="btn-see-all">See All</button>
                </div>

                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={4}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 15 },
                        640: { slidesPerView: 2, spaceBetween: 15 },
                        1024: { slidesPerView: 3, spaceBetween: 20 },
                        1280: { slidesPerView: 4, spaceBetween: 20 },
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