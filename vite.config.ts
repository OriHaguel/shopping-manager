import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    // rollupOptions: {
    //   plugins: [visualizer({ open: true })]
    // },
  },
})
