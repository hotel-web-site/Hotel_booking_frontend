import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotices } from "../../../api/noticeClient";

const PAGE_SIZE = 10;

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

  // highlightText는 반드시 jsx에서만 사용해야 하므로, jsx에서 정의하는 것이 안전합니다.
  // 이 훅에서는 highlightText를 반환하지 않습니다.

  return {
    navigate,
    notices,
    keyword,
    setKeyword,
    currentPage,
    setCurrentPage,
    filteredNotices,
    totalPages,
    pagedNotices
  };
}
