import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/support/Help.scss";

const Help = () => {
    const navigate = useNavigate();

    // 자주 묻는 질문 더미 데이터 (원하면 나중에 API로 교체)
    const faqItems = [
        {
            key: "faq1",
            title: "호텔 예약이 제대로 된 건지 확인하고 싶어요.",
            description: "마이 페이지 -> 예약 내역에서 확인하실 수 있어요.",
        },
        {
            key: "faq2",
            title: "계정 도용(해킹)이 의심돼요.",
            description: "보안 설정 및 임시 조치 방법을 안내해 드립니다.",
        },
        {
            key: "faq3",
            title: "예약 취소를 하고 싶어요.",
            description: "마이 페이지 -> 예약 내역에서 취소하실 수 있어요.",
        },
        {
            key: "faq4",
            title: "제대로 결제가 되지 않은 것 같아요.",
            description: "사이트 재접속 혹은 카드사에 연락해보시는 걸 추천드려요.",
        },
    ];

    const handleGo = (path) => navigate(path);

    return (
        <div className="help-page">
            {/* 상단: 제목 + 우측 버튼들 */}
            <div className="help-header-row">
                <div className="help-header-left">
                    <h1 className="help-title">고객센터</h1>
                    <p className="help-subtitle">
                        자주 묻는 질문을 먼저 확인해 보시고, 해결되지 않는 경우 문의를 남겨주세요.
                    </p>
                </div>

                <div className="help-actions">
                    <button
                        type="button"
                        className="help-action-btn"
                        onClick={() => handleGo("/support/contact")}
                    >
                        1:1 문의
                    </button>
                    <button
                        type="button"
                        className="help-action-btn"
                        onClick={() => handleGo("/support/inquiryhistory")}
                    >
                        내 문의 내역
                    </button>
                </div>
            </div>

            {/* 자주 묻는 질문 섹션 */}
            <section className="help-faq-section">
                <h2 className="faq-section-title">자주 묻는 질문</h2>

                <div className="faq-grid">
                    {faqItems.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className="faq-card"
                            onClick={() => handleGo("/faq")}
                        >
                            <h3 className="faq-card-title">{item.title}</h3>
                            <p className="faq-card-desc">{item.description}</p>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Help;
