/* reviewHelper.js */

// 1. 평균 평점 계산 (데이터가 없으면 명시적으로 null 반환)
export const calculateAverageRating = (reviews = []) => {
    if (!reviews || reviews.length === 0) return null;
    const total = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    return Number((total / reviews.length).toFixed(1));
};

// 2. 평점별 라벨 (리뷰 개수가 0이면 빈 문자열 반환)
export const getRatingLabel = (rating, count = 0) => {
    if (count === 0 || rating === null) return ""; // 👈 데이터 없을 때 가짜 정보 차단

    const r = Number(rating);
    if (r >= 4.5) return "최고에요";
    if (r >= 4.0) return "매우 좋음";
    if (r >= 3.0) return "만족함";
    if (r >= 2.0) return "보통";
    return "아쉬움";
};

// 3. 평점 분포 (배열 안전성 강화)
export const getRatingDistribution = (reviews = []) => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!Array.isArray(reviews)) return dist;

    reviews.forEach((r) => {
        const score = Math.round(Number(r.rating || 0));
        if (dist[score] !== undefined) dist[score]++;
    });
    return dist;
};

// 4. 별점 텍스트
export const renderStars = (rating) => {
    if (rating === null || rating === undefined) return "☆☆☆☆☆";
    const r = Math.round(Number(rating));
    return "★".repeat(r) + "☆".repeat(Math.max(0, 5 - r));
};