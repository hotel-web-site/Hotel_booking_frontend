import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// 요청 인터셉터: 토큰 자동 삽입
axiosInstance.interceptors.request.use(
    (config) => {
        // 'accessToken'과 'token' 두 가지 키 이름을 모두 체크
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 처리 및 에러 핸들링
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 💡 로그인 시도 중 발생하는 401은 무시 (비밀번호 틀림 등)
        const isLoginRequest = originalRequest.url.includes("/login");

        if (error.response?.status === 401 && !isLoginRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (refreshToken) {
                    const response = await axios.post(`${BASE_URL}/users/refresh`, {
                        refreshToken,
                    });

                    // 데이터 구조 방어 코드
                    const newData = response.data.data || response.data;
                    const newAccessToken = newData.accessToken || newData.token;

                    if (newAccessToken) {
                        localStorage.setItem("accessToken", newAccessToken);
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axiosInstance(originalRequest);
                    }
                }
            } catch (refreshError) {
                // 리프레시 토큰 실패 시 모든 정보 삭제 및 로그아웃
                localStorage.clear(); // 안전하게 모두 비움
                if (!window.location.pathname.includes("/login")) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        // 백엔드 에러 메시지 추출
        const errorMessage = error.response?.data?.message || "요청 중 오류가 발생했습니다.";
        return Promise.reject({ ...error, message: errorMessage });
    }
);

export default axiosInstance;