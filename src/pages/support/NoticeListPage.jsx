
const NoticeListPage = () => {
  const {
    navigate,
    keyword,
    setKeyword,
    currentPage,
    setCurrentPage,
    filteredNotices,
    totalPages,
    pagedNotices
  } = useNoticeListPage();

  // highlightText 함수는 컴포넌트 내부에서 정의
  const highlightText = (text) => {
    if (!keyword) return text;
    const parts = text.split(keyword);
    return parts.map((part, i) =>
      i < parts.length - 1 ? (
        <>
          {part}
          <mark>{keyword}</mark>
        </>
      ) : (
        part
      )
    );
  };

  return (
    <section className="notice-page">
      <h2 className="page-title">공지사항</h2>
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
      <table className="notice-table">
        <tbody>
          {pagedNotices.map((notice) => (
            <tr
              key={notice.id}
              onClick={() => navigate(`/support/notices/${notice.id}`)}
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
      <div className="pagination">
        <button
          className="nav-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ‹
        </button>
        <button
          className={currentPage === 1 ? "active" : ""}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
        {Array.from({ length: totalPages - 1 }).map((_, i) => {
          const page = i + 2;
// (중복된 return 블록 제거)
        })}
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
// (컴포넌트 외부 불필요 코드 완전 제거)

export default NoticeListPage;
