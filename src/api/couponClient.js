import axios from "axios";

// 실제 백엔드 API 주소 (Express 서버 포트 확인)
const API_URL = "/api/coupons";

/**
 * 1. 내 쿠폰 목록 조회
 * 백엔드 라우터 설정: router.get('/my', ...)
 */
export const getMyCoupons = async () => {
  try {
    // ⚠️ 주소 수정: /my-coupons 를 /my 로 변경
    const response = await axios.get(`${API_URL}/my`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    // 백엔드(User 모델의 coupons 배열) 데이터를 프론트 UI 구조로 매핑
    // item.couponInfo는 service.js에서 보내주는 상세 데이터입니다.
    return response.data.map(item => ({
      id: item.id,                 // 유저-쿠폰 관계 ID
      title: item.name || item.couponInfo?.name, // 쿠폰 이름
      description: "사용 가능한 쿠폰입니다.",
      type: (item.discountType || item.couponInfo?.discountType) === 'percentage' ? 'percent' : 'amount',
      discountValue: item.discountValue || item.couponInfo?.discountValue,
      expiresAt: item.validUntil || item.couponInfo?.validUntil,
      status: item.status,         // unused | used | expired
      source: "발급쿠폰"
    }));
  } catch (error) {
    console.error("쿠폰 로드 실패:", error);
    return [];
  }
};

/**
 * 2. 쿠폰 사용 처리
 * 백엔드 라우터 설정: router.patch('/use/:couponId', ...)
 */
export const markCouponUsed = async (couponId) => {
  try {
    const response = await axios.patch(`${API_URL}/use/${couponId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    return response.data;
  } catch (error) {
    console.error("쿠폰 사용 처리 실패:", error);
    throw error;
  }
};