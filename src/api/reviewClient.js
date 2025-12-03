/* ============================================================
   ⭐ Mock 리뷰 데이터
============================================================ */
let mockReviews = [
    {
        id: 1,
        hotelId: 1,
        userId: { name: "김성민" },
        rating: 5,
        comment: "시설도 깨끗하고 직원도 친절했어요!",
        date: "2024-12-01",
    },
    {
        id: 2,
        hotelId: 1,
        userId: { name: "이혜성" },
        rating: 4,
        comment: "위치가 정말 좋아요.",
        date: "2024-12-02",
    },
    {
        id: 3,
        hotelId: 1,
        userId: { name: "정우람" },
        rating: 5,
        comment: "전반적으로 매우 만족했습니다.",
        date: "2024-12-03",
    },
];


/* ============================================================
   📌 1. 특정 호텔 리뷰 가져오기 (현재 구조에 맞춘 getReviews)
============================================================ */
export const getReviews = async (hotelId) => {
    const filtered = mockReviews.filter(
        r => r.hotelId === Number(hotelId)
    );

    // HotelDetailPage.jsx의 setReviews(reviewsData)에서
    // reviewsData가 반드시 "배열"이어야 하기 때문에:
    return filtered;
};


/* ============================================================
   📌 2. 리뷰 통계 (평균 + 분포)
============================================================ */
export const getReviewStats = async (hotelId) => {
    const filtered = mockReviews.filter(
        r => r.hotelId === Number(hotelId)
    );

    const average =
        filtered.reduce((sum, r) => sum + r.rating, 0) /
        (filtered.length || 1);

    const distribution = filtered.reduce(
        (acc, r) => {
            acc[r.rating] = (acc[r.rating] || 0) + 1;
            return acc;
        },
        { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    );

    return {
        averageRating: Number(average.toFixed(1)),
        reviewCount: filtered.length,
        distribution,
    };
};


/* ============================================================
   📌 3. 리뷰 작성 (CREATE)
============================================================ */
export const createReview = async (
    hotelId,
    rating,
    comment,
    userName = "익명"
) => {
    const newReview = {
        id: Date.now(),
        hotelId: Number(hotelId),
        userId: { name: userName },
        rating,
        comment,
        date: new Date().toISOString(),
    };

    mockReviews = [newReview, ...mockReviews];

    return newReview;
};


/* ============================================================
   📌 4. 기존 리뷰 수정 (UPDATE)
============================================================ */
export const updateReview = async (reviewId, payload) => {
    mockReviews = mockReviews.map((review) =>
        review.id === reviewId ? { ...review, ...payload } : review
    );

    return mockReviews.find(r => r.id === reviewId);
};


/* ============================================================
   📌 5. 리뷰 삭제 (DELETE)
============================================================ */
export const deleteReview = async (reviewId) => {
    mockReviews = mockReviews.filter(r => r.id !== reviewId);
    return true;
};


/* ============================================================
   📌 6. 호환용 (postReview 그대로 유지)
============================================================ */
export const postReview = createReview;
