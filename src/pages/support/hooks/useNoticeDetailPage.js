import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoticeById } from "../../api/noticeClient";

export default function useNoticeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    getNoticeById(id).then(setNotice);
  }, [id]);

  return {
    notice,
    navigate,
  };
}
