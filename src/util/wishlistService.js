// --------------------------------------------------------------
// ⭐ wishlistService.js
// --------------------------------------------------------------

const WISHLIST_KEY = "wishlist";

// 유틸리티: 호텔 객체에서 안전하게 ID 추출
const getTargetId = (hotelOrId) => {
    if (typeof hotelOrId === 'string' || typeof hotelOrId === 'number') return hotelOrId;
    return hotelOrId?._id || hotelOrId?.id;
};

// 현재 저장된 위시리스트 가져오기
export const getWishlist = () => {
    try {
        const data = localStorage.getItem(WISHLIST_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Wishlist parse error:", e);
        return [];
    }
};

// 특정 호텔이 찜 되어있는지 체크
export const isWishlisted = (hotelOrId) => {
    const targetId = getTargetId(hotelOrId);
    if (!targetId) return false;

    const list = getWishlist();
    // 저장된 아이템들의 ID와 비교할 때도 _id와 id 모두 체크
    return list.some((item) => (item._id || item.id) === targetId);
};

// ⭐ 핵심 함수: 찜 토글 (추가/삭제 처리)
export const toggleWishlist = (hotel) => {
    const targetId = getTargetId(hotel);
    if (!targetId) return false;

    const list = getWishlist();
    const exists = list.some((item) => (item._id || item.id) === targetId);

    let updated;
    if (exists) {
        // 이미 존재하면 삭제
        updated = list.filter((item) => (item._id || item.id) !== targetId);
    } else {
        // 없으면 추가 (전체 객체를 저장하되 ID가 유실되지 않도록 보장)
        updated = [...list, { ...hotel, id: targetId }];
    }

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    return !exists; // true = 추가됨, false = 삭제됨
};

// 특정 ID로 삭제
export const removeFromWishlist = (hotelId) => {
    const list = getWishlist();
    const updated = list.filter(item => (item._id || item.id) !== hotelId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
};

// 위시리스트 전체 비우기
export const clearWishlist = () => {
    localStorage.removeItem(WISHLIST_KEY);
};