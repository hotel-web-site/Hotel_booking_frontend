/* ============================================================
   🏨 호텔 API (Mock Version)
============================================================ */

/* ------------------------------------------------------------
   1) 호텔 기본 리스트 (SearchPage에서 사용)
------------------------------------------------------------ */
const mockHotels = [
    {
        id: "1",
        name: "Seoul Grand Hotel",
        location: "서울시 강남구",
        ratingAverage: 4.8,
        ratingCount: 36,
        price: 120000,
        image: "/images/hotels/hotel1.jpg",

        // 상세 페이지 전용 필드
        description: "도심 속 최고급 호텔로 넓은 객실과 편의시설을 제공합니다.",
        tags: ["바다 전망", "무료 주차", "조식 포함"],
        images: [
            "/images/hotels/detail/hotel1-1.jpg",
            "/images/hotels/detail/hotel1-2.jpg",
            "/images/hotels/detail/hotel1-3.jpg"
        ],
        amenities: ["Free Wi-Fi", "Parking", "Pool", "Breakfast"],
        address: "서울특별시 강남구 테헤란로 123",
        locationMap: { lat: 37.5023, lng: 127.0247 },
    },
    {
        id: "2",
        name: "Busan Beach Resort",
        location: "부산 해운대구",
        ratingAverage: 4.5,
        ratingCount: 22,
        price: 95000,
        image: "/images/hotels/hotel2.jpg",

        description: "바다와 가장 가까운 리조트형 호텔입니다.",
        tags: ["해변 근처", "인피니티 풀"],
        images: [
            "/images/hotels/detail/hotel2-1.jpg",
            "/images/hotels/detail/hotel2-2.jpg"
        ],
        amenities: ["Free Wi-Fi", "Gym", "Restaurant"],
        address: "부산광역시 해운대구 해변로 45",
        locationMap: { lat: 35.1633, lng: 129.1635 },
    },
    {
        id: "3",
        name: "Jeju Premium Stay",
        location: "제주 서귀포시",
        ratingAverage: 4.7,
        ratingCount: 18,
        price: 150000,
        image: "/images/hotels/hotel3.jpg",

        description: "제주 자연 속 힐링을 즐길 수 있는 프리미엄 호텔입니다.",
        tags: ["풀빌라", "자연 전망"],
        images: [
            "/images/hotels/detail/hotel3-1.jpg",
            "/images/hotels/detail/hotel3-2.jpg"
        ],
        amenities: ["Parking", "Spa", "Pool"],
        address: "제주 서귀포시 중문관광로 123",
        locationMap: { lat: 33.2541, lng: 126.4089 },
    },
];

/* ------------------------------------------------------------
   2) SearchPage — 호텔 리스트 API
------------------------------------------------------------ */
export const getHotels = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockHotels), 300);
    });
};

/* ------------------------------------------------------------
   3) DetailPage — 특정 호텔 상세 정보 API
------------------------------------------------------------ */
export const getHotelDetail = async (hotelId) => {
    const hotel = mockHotels.find(
        (h) => String(h.id) === String(hotelId)
    );

    return new Promise((resolve) => {
        setTimeout(() => resolve({ hotel }), 300);
    });
};

/* ------------------------------------------------------------
   4) DetailPage — 객실 정보 (Mock Rooms)
------------------------------------------------------------ */
/* ------------------------------------------------------------
   4) DetailPage — 객실 정보 (Enhanced Mock Rooms)
------------------------------------------------------------ */
const mockRooms = {
    "1": [
        {
            id: "101",
            name: "Deluxe Double Room",
            type: "Double Room · 1 Bed",
            capacity: 2,
            price: 150000,
            images: [
                "/images/rooms/room1-1.jpg",
                "/images/rooms/room1-2.jpg",
            ],
        },
        {
            id: "102",
            name: "Executive Suite",
            type: "Suite · 2 Beds",
            capacity: 4,
            price: 250000,
            images: [
                "/images/rooms/room2-1.jpg",
                "/images/rooms/room2-2.jpg",
            ],
        },
    ],
    "2": [
        {
            id: "201",
            name: "Standard Room",
            type: "Standard · 1 Bed",
            capacity: 2,
            price: 90000,
            images: [
                "/images/rooms/room3-1.jpg",
            ],
        },
    ],
    "3": [
        {
            id: "301",
            name: "Ocean View Room",
            type: "Ocean View · 1 Bed",
            capacity: 2,
            price: 180000,
            images: [
                "/images/rooms/room4-1.jpg",
                "/images/rooms/room4-2.jpg",
            ],
        },
        {
            id: "302",
            name: "Premium Suite",
            type: "Premium Suite · 2 Beds",
            capacity: 4,
            price: 320000,
            images: [
                "/images/rooms/room5-1.jpg",
                "/images/rooms/room5-2.jpg",
            ],
        },
    ],
};


export const getHotelRooms = async (hotelId) => {
    const rooms = mockRooms[hotelId] || [];
    return new Promise((resolve) => {
        setTimeout(() => resolve(rooms), 300);
    });
};
