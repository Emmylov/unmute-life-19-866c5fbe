
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
  },
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Allow serving files from one level up from the project root
      allow: ['..']
    }
  },
}));
