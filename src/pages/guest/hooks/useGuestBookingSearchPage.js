import { useState } from "react";

export default function useGuestBookingSearchPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    checkIn: "",
    bookingNumber: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(form).toString();
    window.location.href = `/guest/booking-result?${params}`;
  };

  return {
    form,
    handleChange,
    handleSubmit,
  };
}
