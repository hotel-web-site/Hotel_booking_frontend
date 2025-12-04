// src/pages/support/InquiryHistoryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/support/InquiryHistoryPage.scss";

const InquiryHistoryPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate(); // ⭐ 이동용

    // 🔥 API 실제 연결 준비
    const fetchInquiryHistory = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/inquiry/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setInquiries(res.data.inquiries || []);
        } catch (error) {
            console.error("문의 내역 불러오기 실패:", error);
            setInquiries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiryHistory();
    }, []);

    return (
        <div className="inquiry-page">
            
            {/* 🔹 페이지 헤더 */}
            <div className="inquiry-header">
                <div className="header-left">
                    <h1 className="inquiry-title">내 문의 내역</h1>
                    <p className="inquiry-subtitle">
                        지금까지 남기신 1:1 문의 내역을 확인할 수 있어요.
                    </p>
                </div>

                {/* 🔙 고객센터로 돌아가기 */}
                <button
                    className="back-to-help-btn"
                    onClick={() => navigate("/support/help")}
                >
                    ← 고객센터로 돌아가기
                </button>
            </div>

            {/* 🔹 콘텐츠 */}
            <div className="inquiry-content">
                {loading ? (
                    <div className="inquiry-empty">문의 내역을 불러오는 중입니다...</div>
                ) : inquiries.length === 0 ? (
                    <div className="inquiry-empty">
                        아직 등록된 문의가 없습니다.
                        <br />
                        고객센터에서 1:1 문의를 남겨보세요.
                    </div>
                ) : (
                    <ul className="inquiry-list">
                        {inquiries.map((item) => (
                            <li key={item.id} className="inquiry-card">
                                <div className="inquiry-card-header">
                                    <span className="inquiry-status">
                                        {item.status === "done" ? "답변 완료" : "접수 중"}
                                    </span>
                                    <span className="inquiry-date">{item.createdAt}</span>
                                </div>

                                <h2 className="inquiry-subject">{item.subject}</h2>
                                <p className="inquiry-summary">{item.summary}</p>

                                <div className="inquiry-card-footer">
                                    <button
                                        type="button"
                                        className="inquiry-detail-btn"
                                        onClick={() =>
                                            window.location.href = `/inquiry/${item.id}`
                                        }
                                    >
                                        상세 보기
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default InquiryHistoryPage;
