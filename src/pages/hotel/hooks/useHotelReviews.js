import { useCallback } from "react";
import { getReviews, createReview, updateReview, deleteReview } from "../../../api/reviewClient";
import { getHotelDetail } from "../../../api/hotelClient";
import { calculateAverageRating } from "../../../util/reviewHelper";

export default function useHotelReviews(hotelId, setHotel, setReviews) {
  // 리뷰 갱신 함수
  const refreshReviews = useCallback(async () => {
    try {
      const [reviewsData, hotelData] = await Promise.all([
        getReviews(hotelId),
        getHotelDetail(hotelId)
      ]);
      const finalReviews = Array.isArray(reviewsData) ? [...reviewsData] : [];
      const finalHotel = hotelData?.data || hotelData;
      setReviews(finalReviews);
      setHotel(prev => ({
        ...prev,
        ...finalHotel,
        ratingCount: finalHotel.ratingCount || finalReviews.length,
        ratingAverage: finalHotel.ratingAverage || calculateAverageRating(finalReviews)
      }));
    } catch (err) {
      console.error("리뷰 갱신 실패:", err);
    }
  }, [hotelId, setHotel, setReviews]);

  return {
    refreshReviews,
    createReview,
    updateReview,
    deleteReview
  };
}
