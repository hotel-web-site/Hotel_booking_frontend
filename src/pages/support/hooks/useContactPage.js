import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useContactPage() {
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");

  const navigate = useNavigate();

  const templates = [
    "호텔 예약이 된 건지 확인하고 싶어요.",
    "호텔 예약을 변경하고 싶어요.",
    "호텔 예약 정보에 대해 추가 정보를 얻고 싶어요.",
    "결제 내역과 실제 예약 내용이 일치하는지 확인하고 싶어요.",
  ];

  const handleTemplateClick = (text) => {
    setSummary(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      subject,
      summary,
      detail,
    };

    console.log("문의 전송 데이터:", payload);

    alert("문의가 등록되었습니다.");

    // 입력 초기화
    setSubject("");
    setSummary("");
    setDetail("");

    // 문의 완료 후 /support/help 이동
    navigate("/support/help");
  };

  return {
    subject,
    setSubject,
    summary,
    setSummary,
    detail,
    setDetail,
    templates,
    handleTemplateClick,
    handleSubmit,
  };
}
