import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../../styles/components/home/PopularDestinations.scss";
import { getHotels } from "../../api/hotelClient";
import DestinationCard from "./DestinationCard";

const PopularDestinations = () => {
    const navigate = useNavigate();
    // 💡 초기값을 빈 배열로 설정하여 데이터 로딩 전 에러 방지
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await getHotels();
                /**
                 * 💡 중요 포인트:
                 * 백엔드 listHotels API는 { data: { list: [...], total: X } }를 반환합니다.
                 * hotelClient.js에서 response.data.data를 리턴하므로,
                 * 여기서는 data.list를 추출해서 state에 넣어야 배열이 저장됩니다.
                 */
                if (data && data.list) {
                    setHotels(data.list);
                } else if (Array.isArray(data)) {
                    // 혹시 몰라 배열로 직접 올 경우에 대한 방어 로직
                    setHotels(data);
                }
            } catch (error) {
                console.error("인기 숙소 로딩 실패:", error);
            }
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
                        더 보러가기
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
                    {/* 💡 hotels가 배열일 때만 map을 실행하도록 안전장치 추가 */}
                    {Array.isArray(hotels) && hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <SwiperSlide key={hotel.id || hotel._id}>
                                <DestinationCard destination={hotel} />
                            </SwiperSlide>
                        ))
                    ) : (
                        // 데이터가 없을 때 표시할 빈 슬라이드 (선택 사항)
                        <div className="no-data">등록된 추천 숙소가 없습니다.</div>
                    )}
                </Swiper>
            </div>
        </section>
    );
};

export default PopularDestinations;