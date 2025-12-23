import React from "react";
import useHelpPage from "./hooks/useHelpPage";
import "../../styles/pages/support/Help.scss";

const Help = () => {
    const { faqItems, handleGo } = useHelpPage();
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
