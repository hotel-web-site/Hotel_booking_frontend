/* ============================================================
   ⭐ 별을 찍어주는 함수
   ex) rating 4 → "★★★★☆"
============================================================ */
export const renderStars = (rating) => {
    if (!rating) return "☆☆☆☆☆";

    const r = Math.round(rating);
    return "★".repeat(r) + "☆".repeat(5 - r);
};

/* ============================================================
   ⭐ 평점 레이블 반환
============================================================ */
export const getRatingLabel = (rating) => {
    if (!rating) return "No rating";

    const r = parseFloat(rating);

    if (r >= 4.5) return "Excellent";
    if (r >= 4.0) return "Very good";
    if (r >= 3.0) return "Good";
    if (r >= 2.0) return "Fair";
    return "Poor";
};

/* ============================================================
   ⭐ 리뷰 배열 → 평균 평점 계산
============================================================ */
export const calculateAverageRating = (reviews = []) => {
    if (!reviews || reviews.length === 0) return 0;

    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
};

/* ============================================================
   ⭐ 리뷰 배열 → 평점 분포 (막대그래프용)
============================================================ */
export const getRatingDistribution = (reviews = []) => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((r) => {
        const score = Math.round(r.rating);
        if (dist[score] !== undefined) dist[score]++;
    });

    return dist;
};
