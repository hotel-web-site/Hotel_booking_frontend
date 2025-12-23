import { useEffect, useState } from "react";
import { getHotelDetail, getHotelRooms } from "../../../api/hotelClient";
import { getReviews } from "../../../api/reviewClient";
import { calculateAverageRating } from "../../../util/reviewHelper";

export default function useHotelDetail(hotelId) {
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [hotelData, roomsData, reviewsData] = await Promise.all([
          getHotelDetail(hotelId),
          getHotelRooms(hotelId),
          getReviews(hotelId),
        ]);
        const finalHotel = hotelData?.data || hotelData;
        const finalRooms = roomsData?.list || roomsData || [];
        const finalReviews = Array.isArray(reviewsData) ? reviewsData : [];
        setHotel({
          ...finalHotel,
          image: finalHotel.image || (finalHotel.images && finalHotel.images[0]) || "/assets/images/default-hotel.jpg",
          rooms: finalRooms,
          reviews: finalReviews,
          ratingCount: finalHotel.ratingCount || finalReviews.length,
          ratingAverage: finalHotel.ratingAverage || calculateAverageRating(finalReviews)
        });
        setRooms(finalRooms);
        setReviews(finalReviews);
      } catch (err) {
        setError("호텔 정보를 불러오는 중 에러가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (hotelId) fetchHotelData();
  }, [hotelId]);

  return { hotel, rooms, reviews, loading, error };
}
