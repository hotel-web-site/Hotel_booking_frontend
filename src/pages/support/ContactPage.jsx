import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../styles/pages/support/ContactPage.scss";

const ContactPage = () => {
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

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1 className="contact-title">1:1 문의</h1>
        <p className="contact-subtitle">
          궁금한 점이나 문제 상황을 자세히 작성해 주세요. 빠르게 확인 후 답변드리겠습니다.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        {/* 제목 */}
        <div className="form-group">
          <label className="form-label">제목</label>
          <input
            type="text"
            className="form-input"
            placeholder="예: 호텔 예약 관련 문의드립니다."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        {/* 문의 요약 */}
        <div className="form-group">
          <label className="form-label">
            문의 요약 <span className="label-sub">(예시 선택 가능)</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="예: 호텔 예약이 된 건지 확인하고 싶어요."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          {/* 템플릿 */}
          <div className="template-list">
            {templates.map((text, idx) => (
              <button
                key={idx}
                type="button"
                className="template-pill"
                onClick={() => handleTemplateClick(text)}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* 상세 내용 */}
        <div className="form-group">
          <label className="form-label">문의 내용 상세</label>
          <textarea
            className="form-textarea"
            placeholder="상세한 상황, 예약일자, 예약번호, 사용하신 플랫폼(웹/모바일) 등을 적어주시면 더 빠르게 도와드릴 수 있어요."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={8}
            required
          />
        </div>

        {/* 제출 */}
        <div className="form-footer">
          <button type="submit" className="submit-btn">
            문의 보내기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
