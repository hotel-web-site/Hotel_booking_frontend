/* ============================================================
   🏨 호텔 목록 조회 API (Mock Version)
============================================================ */

// 목데이터 정의
const mockHotels = [
    {
        id: 1,
        name: "Seoul Grand Hotel",
        location: "서울시 강남구",
        rating: 4.8,
        price: 120000,
        image: "/images/hotels/hotel1.jpg",
    },
    {
        id: 2,
        name: "Busan Beach Resort",
        location: "부산 해운대구",
        rating: 4.5,
        price: 95000,
        image: "/images/hotels/hotel2.jpg",
    },
    {
        id: 3,
        name: "Jeju Premium Stay",
        location: "제주 서귀포시",
        rating: 4.7,
        price: 150000,
        image: "/images/hotels/hotel3.jpg",
    },
];

// ⭐ SearchPage에서 사용하는 함수
export const getHotels = async () => {
    // 실제 서버 붙으면 아래 코드로 교체
    /*
    import api from "./client";
    const res = await api.get("/hotels");
    return res.data;
    */

    // Mock 응답 (0.3초 후 리턴)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockHotels);
        }, 300);
    });
};
