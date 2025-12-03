import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true
  },
  server: {
    host: "127.0.0.1", // IPv6 (::1) 비활성 → EACCES 해결
    port: 3000,        // 충돌 나면 3000으로 바꿔도 됨
    strictPort: false   // 포트 점유 시 자동으로 다른 포트로 이동
  }
})
