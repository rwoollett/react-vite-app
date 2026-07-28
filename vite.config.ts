import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        logger: {
          warn(message, options) {
            const fileUrl = options?.span?.url;

            // Convert URL → string safely
            const file = typeof fileUrl === "string"
              ? fileUrl
              : fileUrl?.toString() ?? "";

            // Suppress ONLY Bulma warnings
            if (file.includes("node_modules/bulma")) {
              return;
            }
            // Verbose output for everything else
            console.warn("[SASS VERBOSE]", message);
            console.warn("File:", file);
            console.warn("Line:", options?.span?.start.line);
            console.warn("Column:", options?.span?.start.column);
            console.warn(message);
          },
        },
      },
    },
  },
});
