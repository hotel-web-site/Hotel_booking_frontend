import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import HeroCard from "./HeroCard";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "../../styles/components/home/HeroSection.scss";
import { Pagination, Autoplay } from "swiper/modules";
import { useHeroSection } from "./hooks/useHeroSection";

const HeroSection = () => {
    const { heroSlides, goToSearch } = useHeroSection();
    return (
        <div className="hero-section">
            <Swiper
                className="hero-swiper"
                loop={true}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                modules={[Pagination, Autoplay]}
            >
                {heroSlides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <HeroCard
                            title={slide.title}
                            subtitle={slide.subtitle}
                            description={slide.description}
                            backgroundImage={slide.backgroundImage}
                            className={slide.className}
                        >
                            <div className="search-btn-wrapper">
                                <button
                                    className="btn btn--blur"
                                    onClick={goToSearch}
                                >
                                    호텔 예약 바로가기
                                </button>
                            </div>
                        </HeroCard>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSection;
