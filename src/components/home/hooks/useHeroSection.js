import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export function useHeroSection() {
    const navigate = useNavigate();
    const goToSearch = useCallback(() => {
        navigate("/search");
    }, [navigate]);
    const heroSlides = [
        {
            title: "신청해보세요",
            subtitle: "퍼펙트 호텔 및 다양한 숙소를 확인하세요!",
            description:
                "컴퓨터를 통해 편리한 예약과 고객 서비스를 제공하는 다양한 복지 시설을 확인해 보세요.",
            backgroundImage: "/hotel1.png",
            className: "hero-card-1",
        },
        {
            title: "최고의 여행 경험",
            subtitle: "세계 곳곳의 숨겨진 보석같은 장소들",
            description:
                "특별한 여행을 위한 완벽한 숙소와 잊지 못할 추억을 만들어보세요.",
            backgroundImage: "/hotel2.png",
            className: "hero-card-2",
        },
        {
            title: "럭셔리 휴양지",
            subtitle: "프리미엄 리조트에서 완벽한 휴식을",
            description:
                "최고급 시설과 서비스로 당신만의 특별한 시간을 보내세요.",
            backgroundImage: "/hotel3.png",
            className: "hero-card-3",
        },
    ];
    return { heroSlides, goToSearch };
}
