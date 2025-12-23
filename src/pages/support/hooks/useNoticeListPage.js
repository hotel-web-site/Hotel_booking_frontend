import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotices } from "../../../api/noticeClient";

const PAGE_SIZE = 10;

// eslint-disable-next-line
export default function useNoticeListPage() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getNotices().then(setNotices);
  }, []);

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.includes(keyword) ||
      notice.category.includes(keyword)
  );

  const totalPages = Math.ceil(filteredNotices.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedNotices = filteredNotices.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  // highlightText는 반드시 jsx 파일에서만 사용해야 하므로, jsx 파일로 확장자를 변경해야 함
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

  return {
    navigate,
    notices,
    keyword,
    setKeyword,
    currentPage,
    setCurrentPage,
    filteredNotices,
    totalPages,
    pagedNotices,
    highlightText,
  };
}
