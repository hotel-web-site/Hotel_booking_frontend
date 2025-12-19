import axios from "axios";

const API_URL = "/api/reviews";

// 1. 특정 호텔 리뷰 가져오기
export const getReviews = async (hotelId) => {
    try {
        const response = await axios.get(`${API_URL}/hotel/${hotelId}`);
        return response.data.data || [];
    } catch (error) {
        console.error("리뷰 가져오기 실패:", error);
        return [];
    }
};

// 2. 리뷰 작성
export const createReview = async (hotelId, rating, comment) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("로그인이 필요한 서비스입니다.");

    try {
        const response = await axios.post(
            API_URL,
            {
                hotel: hotelId,
                rating: Number(rating),
                comment: comment.trim(),
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "리뷰 등록 중 오류 발생");
    }
};

// 3. 내 리뷰 목록 가져오기
export const getMyReviews = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/my`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data || [];
    } catch (error) {
        console.error("내 리뷰 로드 실패:", error);
        return [];
    }
};

// 기존 함수 유지
export const updateReview = async (reviewId, payload) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(`${API_URL}/${reviewId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const deleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return true;
};

export const postReview = createReview;