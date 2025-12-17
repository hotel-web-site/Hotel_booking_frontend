import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotices } from "../../api/noticeClient";
import "../../styles/pages/support/NoticeListPage.scss";

const PAGE_SIZE = 10;

const NoticeListPage = () => {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* 공지 불러오기 */
  useEffect(() => {
    getNotices().then(setNotices);
  }, []);

  /* 🔍 실시간 필터 */
  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.includes(keyword) ||
      notice.category.includes(keyword)
  );

  /* 페이지네이션 계산 */
  const totalPages = Math.ceil(filteredNotices.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedNotices = filteredNotices.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  /* 검색 시 페이지 초기화 */
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  /* 🔥 제목 강조 */
  const highlightText = (text) => {
    if (!keyword) return text;

    const parts = text.split(keyword);
    return parts.map((part, i) =>
      i < parts.length - 1 ? (
        <React.Fragment key={i}>
          {part}
          <mark>{keyword}</mark>
        </React.Fragment>
      ) : (
        part
      )
    );
  };

  return (
    <section className="notice-page">
      <h2 className="page-title">공지사항</h2>

      {/* 상단 */}
      <div className="notice-header">
        <span>Total {filteredNotices.length}</span>

        <input
          className="search-input"
          placeholder="검색어를 입력해주세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* 목록 */}
      <table className="notice-table">
        <tbody>
          {pagedNotices.map((notice) => (
            <tr
              key={notice.id}
              onClick={() =>
                navigate(`/support/notices/${notice.id}`)
              }
            >
              <td>{notice.category}</td>
              <td>{highlightText(notice.title)}</td>
              <td>{notice.date}</td>
            </tr>
          ))}

          {pagedNotices.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ 페이지네이션 (앞/뒤 + 숫자) */}
      <div className="pagination">
        {/* 이전 */}
        <button
          className="nav-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ‹
        </button>

        {/* 1은 무조건 */}
        <button
          className={currentPage === 1 ? "active" : ""}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>

        {/* 2 이상 */}
        {Array.from({ length: totalPages - 1 }).map((_, i) => {
          const page = i + 2;
          return (
            <button
              key={page}
              className={page === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          );
        })}

        {/* 다음 */}
        <button
          className="nav-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default NoticeListPage;
