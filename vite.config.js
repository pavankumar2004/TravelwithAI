import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.VITE_GOOGLE_AUTH_CLIENT_ID": JSON.stringify(process.env.VITE_GOOGLE_AUTH_CLIENT_ID),
    "process.env.VITE_GOOGLE_GEMINI_AI_API_KEY": JSON.stringify(process.env.VITE_GOOGLE_GEMINI_AI_API_KEY),
    "process.env.VITE_GOOGLE_PLACES_API_KEY": JSON.stringify(process.env.VITE_GOOGLE_PLACES_API_KEY),
  },
});