import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // 0.0.0.0으로 개방하여 도커 외부에서도 접속 가능하게 함
    port: 5173,       // 프론트엔드 표준 포트 사용
    strictPort: true, // 도커 환경에서는 포트가 고정되어야 포트 포워딩이 꼬이지 않음
    watch: {
      usePolling: true, // Windows/macOS 호스트와 도커 컨테이너 간 파일 변경 감지 필수
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: "", // 필요시 전역 scss 변수 추가 가능
        sourceMap: true,
      },
    },
  },
});