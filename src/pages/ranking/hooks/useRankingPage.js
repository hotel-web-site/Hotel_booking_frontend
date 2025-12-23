import { useEffect, useState } from "react";
import { getHotels } from "../../../api/hotelClient";

export default function useRankingPage() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getHotels();
      setHotels(data);
    };
    load();
  }, []);

  return {
    hotels,
  };
}
