import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // 变动极少的框架代码单独成块，业务代码更新时可以继续命中缓存
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/,
            },
          ],
        },
      },
    },
    // mermaid（MarkdownRenderer 依赖）的布局引擎体积较大，但只会在用到时按需加载
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: 5173,
    // 后端联调时按需开启代理：前端请求 `/api/*` 会被转发到 target
    // proxy: {
    //   "/api": { target: "http://localhost:3000", changeOrigin: true },
    // },
  },
})
