// src/api/couponClient.js

// ◼️ 기본 mock 쿠폰 데이터
const baseMockCoupons = [
  {
    id: "WELCOME_5P",
    title: "신규 회원 5% 할인",
    description: "가입 후 첫 예약에 5% 할인 적용",
    type: "percent",           // percent | amount
    discountValue: 5,          // 5%
    minAmount: 50000,          // 최소 결제 금액
    maxDiscount: 20000,        // 최대 할인 금액
    expiresAt: "2025-12-31",   // 만료일
    source: "회원가입",         // 발급 경로
    status: "unused",          // unused | used | expired
  },
  {
    id: "SUBSCRIBE_10000",
    title: "구독 서비스 전용 10,000원 쿠폰",
    description: "구독 유저에게 제공되는 정액 할인 쿠폰",
    type: "amount",
    discountValue: 10000,
    minAmount: 80000,
    maxDiscount: 10000,
    expiresAt: "2025-08-31",
    source: "구독서비스",
    status: "unused",
  },
  {
    id: "BIG_SPENDER_7P",
    title: "30만 원 이상 결제 고객 7% 쿠폰",
    description: "과거 누적 결제 30만 원 이상 고객 대상",
    type: "percent",
    discountValue: 7,
    minAmount: 100000,
    maxDiscount: 30000,
    expiresAt: "2025-07-15",
    source: "우수고객",
    status: "unused",
  },
  {
    id: "EVENT_SPRING",
    title: "봄맞이 프로모션 5,000원 쿠폰",
    description: "봄 시즌 한정 이벤트 쿠폰",
    type: "amount",
    discountValue: 5000,
    minAmount: 60000,
    maxDiscount: 5000,
    expiresAt: "2024-05-01",
    source: "이벤트",
    status: "expired", // 이미 만료된 예시
  },
];

// ◼️ localStorage 키
const STORAGE_KEY = "myCoupons";

/**
 * 현재 저장된 쿠폰 리스트를 가져온다.
 * - 처음 호출 시 localStorage에 없으면 baseMockCoupons를 저장한 뒤 반환
 * - 만료일이 지난 쿠폰은 status를 expired로 업데이트
 */
export const getMyCoupons = async () => {
  let coupons;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      coupons = JSON.parse(stored);
    } catch (e) {
      coupons = baseMockCoupons;
    }
  } else {
    coupons = baseMockCoupons;
  }

  const now = new Date();

  // 만료 상태 자동 업데이트
  const updated = coupons.map((c) => {
    if (!c.expiresAt) return c;
    const exp = new Date(c.expiresAt);
    if (c.status === "unused" && exp < now) {
      return { ...c, status: "expired" };
    }
    return c;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * 쿠폰을 사용 처리하는 가짜 API.
 * - 나중에 백엔드 연결하면 여기서 axios.post("/coupons/use", { id }) 같은 식으로 교체
 */
export const markCouponUsed = async (couponId) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  let coupons = [];
  try {
    coupons = JSON.parse(stored);
  } catch (e) {
    return;
  }

  const updated = coupons.map((c) =>
    c.id === couponId ? { ...c, status: "used" } : c
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
