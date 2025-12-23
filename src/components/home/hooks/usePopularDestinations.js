import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getHotels } from "../../../api/hotelClient";

export function usePopularDestinations() {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await getHotels();
                if (data && data.list) {
                    setHotels(data.list);
                } else if (Array.isArray(data)) {
                    setHotels(data);
                }
            } catch (error) {
                console.error("인기 숙소 로딩 실패:", error);
            }
        };
        fetchHotels();
    }, []);

    const goToSearch = useCallback(() => {
        navigate("/search");
    }, [navigate]);

    return {
        hotels,
        goToSearch
    };
}
