// src/pages/support/InquiryHistoryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/pages/support/InquiryHistoryPage.scss";

const InquiryHistoryPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔥 실제 API 연결 준비만 해둠
    // 예시 API => GET /api/inquiry/my
    // 나중에 백엔드 만들어지면 해당 주소만 맞춰주면 됨
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

            // 🔥 백엔드에서 받은 데이터 그대로 보여줌
            setInquiries(res.data.inquiries || []);
        } catch (error) {
            console.error("문의 내역 불러오기 실패:", error);
            setInquiries([]); // 실패 시 빈 리스트
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiryHistory();
    }, []);

    return (
        <div className="inquiry-page">
            <div className="inquiry-header">
                <h1 className="inquiry-title">내 문의 내역</h1>
                <p className="inquiry-subtitle">
                    지금까지 남기신 1:1 문의 내역을 확인할 수 있어요.
                </p>
            </div>

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
