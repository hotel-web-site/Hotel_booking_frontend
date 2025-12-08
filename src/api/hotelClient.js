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
    description:
      "도심 속 최고급 호텔로 넓은 객실과 편의시설을 제공합니다.",
    // 👉 Freebies 필터용 키워드들 추가
    tags: ["바다 전망", "무료 주차", "조식 포함", "공항셔틀버스"],
    images: [
      "/images/hotels/detail/hotel1-1.jpg",
      "/images/hotels/detail/hotel1-2.jpg",
      "/images/hotels/detail/hotel1-3.jpg",
    ],
    amenities: [
      "Free Wi-Fi", // wifi
      "Parking", // 무료주차
      "Pool",
      "Breakfast", // 조식
      "Airport shuttle", // 공항셔틀버스
    ],
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
    // 👉 조식/무료주차/무료취소 일부만 제공
    tags: ["해변 근처", "인피니티 풀", "조식 포함"],
    images: [
      "/images/hotels/detail/hotel2-1.jpg",
      "/images/hotels/detail/hotel2-2.jpg",
    ],
    amenities: [
      "Free Wi-Fi", // wifi
      "Gym",
      "Restaurant",
      "Parking", // 무료주차
    ],
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
    // 👉 조식/무료주차는 있지만 공항셔틀은 없음(필터 테스트용)
    tags: ["풀빌라", "자연 전망", "조식 포함", "무료 주차"],
    images: [
      "/images/hotels/detail/hotel3-1.jpg",
      "/images/hotels/detail/hotel3-2.jpg",
    ],
    amenities: [
      "Parking", // 무료주차
      "Spa",
      "Pool",
      "Free Wi-Fi", // wifi
    ],
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
   4) DetailPage — 객실 정보 (Enhanced Mock Rooms)
------------------------------------------------------------ */
const mockRooms = {
  "1": [
    {
      id: "101",
      name: "Standard Double Room",
      size: "23㎡",
      bedType: "더블베드 1개",
      maxGuests: 2,
      view: "시티뷰",
      price: 120000,
      originalPrice: 150000,
      images: [
        "/images/rooms/standard1.jpg",
        "/images/rooms/standard2.jpg",
      ],
      amenities: ["WiFi", "에어컨", "TV", "드라이기", "샤워부스"],
      // 👉 무료취소 / 조식 없음
      features: ["즉시 예약", "무료 취소", "VAT 포함"],
      breakfast: false,
      refundable: true,
    },
    {
      id: "102",
      name: "Superior Twin Room",
      size: "28㎡",
      bedType: "싱글 2개",
      maxGuests: 3,
      view: "부분 오션뷰",
      price: 160000,
      originalPrice: 180000,
      images: [
        "/images/rooms/superior1.jpg",
        "/images/rooms/superior2.jpg",
      ],
      amenities: ["WiFi", "에어컨", "옷장", "냉장고", "욕조"],
      features: ["즉시 확정", "조식 포함"], // 조식
      breakfast: true,
      refundable: false,
    },
    {
      id: "103",
      name: "Deluxe King Room",
      size: "32㎡",
      bedType: "킹베드 1개",
      maxGuests: 3,
      view: "풀뷰",
      price: 190000,
      originalPrice: 210000,
      images: [
        "/images/rooms/deluxe1.jpg",
        "/images/rooms/deluxe2.jpg",
      ],
      amenities: ["WiFi", "무료 생수", "에어컨", "미니바", "욕조"],
      features: ["무료 취소", "조식 포함", "넓은 객실"], // 조식 + 무료취소
      breakfast: true,
      refundable: true,
    },
    {
      id: "104",
      name: "Executive Suite",
      size: "45㎡",
      bedType: "킹베드 1개",
      maxGuests: 4,
      view: "오션뷰",
      price: 280000,
      originalPrice: 350000,
      images: [
        "/images/rooms/suite1.jpg",
        "/images/rooms/suite2.jpg",
      ],
      amenities: [
        "WiFi",
        "에어컨",
        "거실 분리형",
        "대형 TV",
        "욕조",
        "발코니",
      ],
      features: [
        "Suite Room",
        "바다 전망",
        "조식 포함",
        "무료 취소",
      ], // 조식 + 무료취소
      breakfast: true,
      refundable: true,
    },
  ],

  "2": [
    {
      id: "201",
      name: "Beach Standard Room",
      size: "26㎡",
      bedType: "더블베드",
      maxGuests: 2,
      view: "해변뷰",
      price: 135000,
      originalPrice: 160000,
      images: ["/images/rooms/beach-standard1.jpg"],
      amenities: ["WiFi", "TV", "에어컨", "샤워부스"],
      features: ["바다 근처", "즉시 예약"], // 무료취소/조식 없음
      breakfast: false,
      refundable: true,
    },
    {
      id: "202",
      name: "Ocean Deluxe",
      size: "34㎡",
      bedType: "킹베드",
      maxGuests: 3,
      view: "오션뷰",
      price: 210000,
      originalPrice: 250000,
      images: ["/images/rooms/ocean-deluxe1.jpg"],
      amenities: ["WiFi", "TV", "욕조", "냉장고"],
      features: ["오션뷰", "조식 포함"], // 조식
      breakfast: true,
      refundable: false,
    },
  ],

  "3": [
    {
      id: "301",
      name: "Jeju Garden Room",
      size: "29㎡",
      bedType: "킹베드",
      maxGuests: 2,
      view: "정원뷰",
      price: 170000,
      originalPrice: 190000,
      images: ["/images/rooms/jeju-garden1.jpg"],
      amenities: ["WiFi", "에어컨", "TV", "욕조"],
      features: ["무료 취소", "즉시 예약"], // 무료취소
      breakfast: false,
      refundable: true,
    },
    {
      id: "302",
      name: "Jeju Pool Villa",
      size: "52㎡",
      bedType: "퀸베드 2개",
      maxGuests: 4,
      view: "풀뷰",
      price: 350000,
      originalPrice: 420000,
      images: [
        "/images/rooms/jeju-pool1.jpg",
        "/images/rooms/jeju-pool2.jpg",
      ],
      amenities: [
        "WiFi",
        "프라이빗 풀",
        "미니바",
        "에어컨",
        "욕조",
      ],
      features: ["Pool Villa", "조식 포함", "무료 취소"], // 조식 + 무료취소
      breakfast: true,
      refundable: true,
    },
  ],
};

export const getHotelRooms = async (hotelId) => {
  const id = String(hotelId);
  const rooms = mockRooms[id] || [];
  console.log("💬 hotelId:", hotelId, "→ 변환된 id:", id);
  console.log("💬 mockRooms[id]:", mockRooms[id]);
  return new Promise((resolve) => {
    setTimeout(() => resolve(rooms), 300);
  });
};
