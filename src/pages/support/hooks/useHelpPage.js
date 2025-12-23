import { useNavigate } from "react-router-dom";

export default function useHelpPage() {
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

  return {
    faqItems,
    handleGo,
  };
}
