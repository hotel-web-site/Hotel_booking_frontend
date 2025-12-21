import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Amenities from "../../components/hotelpage/Amenities";
import AvailableRooms from "../../components/hotelpage/AvailableRooms";
import HotelDetailHeader from "../../components/hotelpage/HotelDetailHeader";
import HotelGalleryModal from "../../components/hotelpage/HotelGalleryModal";
import HotelMap from "../../components/hotelpage/HotelMap";
import HotelOverview from "../../components/hotelpage/HotelOverview";
import HotelReviews from "../../components/hotelpage/HotelReviews";
import "../../styles/pages/hotel/HotelDetailPage.scss";

import { calculateAverageRating } from "../../util/reviewHelper";
import { getHotelDetail, getHotelRooms } from "../../api/hotelClient";
import { getReviews, createReview, updateReview, deleteReview } from "../../api/reviewClient";

const HotelDetailPage = () => {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get("guest") === "1";

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ 데이터 갱신 함수 (기존 구조 유지)
  const refreshReviews = async () => {
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
  };

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

  if (loading) return <div className="hotel-detail-container inner loading">로딩 중...</div>;
  if (error) return <div className="hotel-detail-container inner error">{error}</div>;
  if (!hotel) return <div className="hotel-detail-container inner">숙소를 찾을 수 없습니다.</div>;

  return (
    <div className="hotel-detail-container inner">
      <HotelDetailHeader hotel={hotel} />
      <HotelGalleryModal images={hotel.images} name={hotel.name} mainFallbackImage={hotel.image} />

      <HotelOverview
        description={hotel.description}
        rating={hotel.ratingAverage || 0}
        reviewCount={hotel.ratingCount || 0}
        tags={hotel.tags || []}
      />

      <Amenities amenities={hotel.amenities || []} />

      <AvailableRooms
        rooms={rooms}
        isGuest={isGuest}
        hotelId={hotelId}
        searchParams={Object.fromEntries([...searchParams])}
      />

      <HotelMap
        address={hotel.address || hotel.location}
        coordinates={hotel.coordinates || hotel.coords}
      />

      <HotelReviews
        hotelId={hotelId}
        reviews={reviews}
        createReview={createReview}
        updateReview={updateReview}
        deleteReview={deleteReview}
        getReviews={refreshReviews}
      />
    </div>
  );
};

export default HotelDetailPage;