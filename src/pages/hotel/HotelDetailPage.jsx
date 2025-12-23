import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Amenities from "../../components/hotelpage/Amenities";
import AvailableRooms from "../../components/hotelpage/AvailableRooms";
import HotelDetailHeader from "../../components/hotelpage/HotelDetailHeader";
import HotelGalleryModal from "../../components/hotelpage/HotelGalleryModal";
import HotelMap from "../../components/hotelpage/HotelMap";
import HotelOverview from "../../components/hotelpage/HotelOverview";
import HotelReviews from "../../components/hotelpage/HotelReviews";
import "../../styles/pages/hotel/HotelDetailPage.scss";

import useHotelDetail from "./hooks/useHotelDetail";
import useHotelReviews from "./hooks/useHotelReviews";

const HotelDetailPage = () => {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get("guest") === "1";

  // 데이터 로직 분리: hooks 사용
  const { hotel, rooms, reviews, loading, error } = useHotelDetail(hotelId);
  const { refreshReviews, createReview, updateReview, deleteReview } = useHotelReviews(hotelId, () => {}, () => {});

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