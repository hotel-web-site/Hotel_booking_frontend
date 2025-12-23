import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getHotelRooms } from '../../../api/hotelClient';

export default function useBookingStepRoom() {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // 날짜, 인원, 객실 등 예약 관련 상태
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 1);
  const [children, setChildren] = useState(Number(searchParams.get('children')) || 0);
  const [rooms, setRooms] = useState(Number(searchParams.get('rooms')) || 1);

  // 객실 데이터 및 로딩/에러 상태
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 선택된 객실
  const [selectedRoom, setSelectedRoom] = useState(null);

  // 객실 데이터 불러오기
  const fetchRooms = useCallback(async () => {
    if (!hotelId || !checkIn || !checkOut) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHotelRooms(hotelId, { checkIn, checkOut, adults, children, rooms });
      setRoomList(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [hotelId, checkIn, checkOut, adults, children, rooms]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // 날짜/인원 변경 핸들러
  const handleDateChange = (newCheckIn, newCheckOut) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
    searchParams.set('checkIn', newCheckIn);
    searchParams.set('checkOut', newCheckOut);
    setSearchParams(searchParams);
  };

  const handleGuestChange = (newAdults, newChildren, newRooms) => {
    setAdults(newAdults);
    setChildren(newChildren);
    setRooms(newRooms);
    searchParams.set('adults', newAdults);
    searchParams.set('children', newChildren);
    searchParams.set('rooms', newRooms);
    setSearchParams(searchParams);
  };

  // 객실 선택 핸들러
  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  // 다음 단계로 이동
  const goToNextStep = () => {
    if (!selectedRoom) return;
    navigate(`/booking/step/dates/${hotelId}`, {
      state: {
        checkIn,
        checkOut,
        adults,
        children,
        rooms,
        selectedRoom,
      },
    });
  };

  return {
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
    roomList,
    loading,
    error,
    selectedRoom,
    handleDateChange,
    handleGuestChange,
    handleSelectRoom,
    goToNextStep,
  };
}
