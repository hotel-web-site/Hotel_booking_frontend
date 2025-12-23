import { useState } from "react";

export default function usePaymentForm(onAddCard) {
  const [form, setForm] = useState({
    cardNumber: "", exp: "", cvc: "", name: "", country: "", saveInfo: false,
  });
  const [showModal, setShowModal] = useState(false);

  // 카드번호 4자리마다 자동 공백
  const handleInputCardNumber = (value) => {
    let onlyNum = value.replace(/\D/g, "").slice(0, 16);
    let formatted = onlyNum.replace(/(\d{4})(?=\d)/g, "$1 ");
    setForm((prev) => ({ ...prev, cardNumber: formatted }));
  };

  // 만료일 MM/YY 자동 포맷팅
  const handleInputExp = (value) => {
    let onlyNum = value.replace(/[^0-9]/g, "").slice(0, 4);
    let formatted = onlyNum;
    if (onlyNum.length > 2) {
      formatted = onlyNum.slice(0, 2) + "/" + onlyNum.slice(2);
    }
    else if (onlyNum.length > 0 && onlyNum.length <= 2) {
      formatted = onlyNum;
    }
    setForm((prev) => ({ ...prev, exp: formatted }));
  };

  const handleInput = (key, value) => {
    let formattedValue = value;
    if (key === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);
    } else if (key === "exp") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(?=\d)/g, "$1/").slice(0, 5);
    } else if (key === "cvc") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }
    setForm((prev) => ({ ...prev, [key]: formattedValue }));
  };

  const validateCardNumber = (number) => {
    const digits = number.replace(/\s+/g, "");
    return digits.length >= 13 && digits.length <= 16 && /^\d+$/.test(digits);
  };

  const handleSubmitCard = () => {
    if (!validateCardNumber(form.cardNumber)) {
      return alert("올바른 카드 번호를 입력해주세요.");
    }
    if (!form.name || form.exp.length < 5) {
      return alert("정보를 모두 입력해주세요.");
    }
    const firstDigit = form.cardNumber[0];
    let brand = "CARD";
    let themeColor = "linear-gradient(135deg, #a1a1a1 0%, #7b7b7b 100%)";
    if (firstDigit === "4") {
      brand = "VISA";
      themeColor = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
    } else if (firstDigit === "5") {
      brand = "MASTER";
      themeColor = "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)";
    } else {
      themeColor = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
    onAddCard({
      id: Date.now(),
      last4: form.cardNumber.replace(/\s/g, "").slice(-4),
      exp: form.exp,
      brand: brand,
      color: themeColor,
      name: form.name.toUpperCase()
    });
    setForm({ cardNumber: "", exp: "", cvc: "", name: "", country: "", saveInfo: false });
    setShowModal(false);
  };

  return {
    form,
    setForm,
    showModal,
    setShowModal,
    handleInputCardNumber,
    handleInputExp,
    handleInput,
    handleSubmitCard
  };
}
