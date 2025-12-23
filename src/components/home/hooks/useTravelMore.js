import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export function useTravelMore() {
    const navigate = useNavigate();
    const goToRanking = useCallback(() => {
        navigate("/ranking");
    }, [navigate]);
    return { goToRanking };
}
