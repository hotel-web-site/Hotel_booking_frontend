// --------------------------------------------------------------
// ⭐ wishlistService.js
// 전역에서 단 하나로 사용하는 찜(위시리스트) 공용 서비스
// --------------------------------------------------------------

const WISHLIST_KEY = "wishlist";

// 현재 저장된 위시리스트 가져오기
export const getWishlist = () => {
    try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) {
        console.error("Wishlist parse error:", e);
        return [];
    }
};

// 특정 호텔이 찜 되어있는지 체크
export const isWishlisted = (hotelId) => {
    const list = getWishlist();
    return list.some((item) => item.id === hotelId);
};

// ⭐ 핵심 함수: 찜 토글 (추가/삭제 처리)
export const toggleWishlist = (hotel) => {
    const list = getWishlist();
    const exists = list.some((item) => item.id === hotel.id);

    let updated;

    if (exists) {
        // 이미 존재하면 삭제
        updated = list.filter((item) => item.id !== hotel.id);
    } else {
        // 없으면 추가
        updated = [...list, hotel];
    }

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));

    return !exists; // true = 추가됨, false = 삭제됨
};

export const removeFromWishlist = (hotelId) => {
    const list = getWishlist();
    const updated = list.filter(item => (item._id || item.id) !== hotelId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
};

// 위시리스트 전체 비우기 (필요하면)
export const clearWishlist = () => {
    localStorage.removeItem(WISHLIST_KEY);
};
