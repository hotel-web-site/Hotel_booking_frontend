import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoticeById } from "../../api/noticeClient";
import "../../styles/pages/support/NoticeDetailPage.scss";

const NoticeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        getNoticeById(id).then(setNotice);
    }, [id]);

    if (!notice) {
        return (
            <section className="notice-detail">
                <p style={{ textAlign: "center" }}>
                    공지사항을 불러오는 중입니다...
                </p>
            </section>
        );
    }

    return (
        <section className="notice-detail">
            {/* 제목 */}
            <h2>{notice.title}</h2>

            {/* 메타 정보 */}
            <div className="meta">
                <span>{notice.category}</span>
                <span>{notice.date}</span>
            </div>

            {/* 본문 */}
            <pre className="notice-content">
                {notice.content}
            </pre>

            {/* 하단 버튼 */}
            <div className="notice-actions">
                <button onClick={() => navigate("/support/notices")}>
                    목록
                </button>
            </div>
        </section>
    );
};

export default NoticeDetail;
