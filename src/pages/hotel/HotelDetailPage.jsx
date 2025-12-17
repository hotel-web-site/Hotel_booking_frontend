// src/pages/hotel/HotelDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";   // ⭐ 추가
import Amenities from "../../components/hotelpage/Amenities";
import AvailableRooms from "../../components/hotelpage/AvailableRooms";
import HotelDetailHeader from "../../components/hotelpage/HotelDetailHeader";
import HotelGallery from "../../components/hotelpage/HotelGallery";
import HotelMap from "../../components/hotelpage/HotelMap";
import HotelOverview from "../../components/hotelpage/HotelOverview";
import HotelReviews from "../../components/hotelpage/HotelReviews";
import "../../styles/pages/hotel/HotelDetailPage.scss";

import {
  getHotelDetail,
  getHotelRooms,
} from "../../api/hotelClient";

import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../api/reviewClient";

const HotelDetailPage = () => {
  const { hotelId } = useParams(); // URL에서 호텔 ID 추출
  const [searchParams] = useSearchParams();      // ⭐ 추가
  const isGuest = searchParams.get("guest") === "1";   // ⭐ 비회원 여부 확인

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);

        const [hotelData, roomsData, reviewsData] = await Promise.all([
          getHotelDetail(hotelId),
          getHotelRooms(hotelId),
          getReviews(hotelId),
        ]);

        setHotel(hotelData.hotel);
        setRooms(roomsData);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch hotel data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) fetchHotelData();
  }, [hotelId]);

  if (loading)
    return <div className="hotel-detail-container inner loading">Loading...</div>;

  if (error)
    return (
      <div className="hotel-detail-container inner error">
        Error: {error}
      </div>
    );

  if (!hotel)
    return (
      <div className="hotel-detail-container inner">
        호텔을 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="hotel-detail-container inner">
      <HotelDetailHeader hotel={hotel} />

      <HotelGallery images={hotel.images} hotelName={hotel.name} />

      <HotelOverview
        description={hotel.description}
        rating={hotel.ratingAverage}
        reviewCount={hotel.ratingCount}
        tags={hotel.tags}
      />

      <Amenities amenities={hotel.amenities} />

      {/* ⭐ AvailableRooms에 비회원 여부 전달 */}
      <AvailableRooms rooms={rooms} isGuest={isGuest} />

      <HotelMap address={hotel.address} location={hotel.location} />

      <HotelReviews
        hotelId={hotelId}
        rating={hotel.ratingAverage}
        reviewCount={hotel.ratingCount}
        createReview={createReview}
        updateReview={updateReview}
        deleteReview={deleteReview}
        reviews={reviews}
        getReviews={getReviews}
      />
    </div>
  );
};

export default HotelDetailPage;
