import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/components/home/PopularDestinations.scss";
import DestinationCard from "./DestinationCard";
import { usePopularDestinations } from "./hooks/usePopularDestinations";

const PopularDestinations = () => {
    const { hotels, goToSearch } = usePopularDestinations();
    return (
        <section className="destinations-container">
            <div className="inner">
                <div className="section-header column-header">
                    <h2 className="section-title">여행에 빠지다</h2>
                    <button
                        className="btn--primary full-width-btn"
                        onClick={goToSearch}
                    >
                        더 보러가기
                    </button>
                </div>
                <p className="section-subtitle">특가상품으로 진행하는 여행을 예약해보세요</p>
                {(!hotels || hotels.length === 0) && (
                    <div className="no-data">등록된 추천 숙소가 없습니다.</div>
                )}
            </div>
            {Array.isArray(hotels) && hotels.length > 0 && (
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
                    {Array.isArray(hotels) && hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <SwiperSlide key={hotel.id || hotel._id}>
                                <DestinationCard destination={hotel} />
                            </SwiperSlide>
                        ))
                    ) : (
                        <div className="no-data">등록된 추천 숙소가 없습니다.</div>
                    )}
                </Swiper>
            )}
        </section>
    );
};

export default PopularDestinations;