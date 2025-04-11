import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";
import path from "path";
import commonjs from "vite-plugin-commonjs";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";

const filename = fileURLToPath(import.meta.url);
const pathSegments = path.dirname(filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        css: {
            postcss: {
                plugins: [tailwind(), autoprefixer()],
            },
        },
        plugins: [vue(), commonjs()],
        resolve: {
            alias: {
                "@": path.resolve(pathSegments, "./src"),
            },
            extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
        },
        optimizeDeps: {
            include: ["quill","@ckeditor/ckeditor5-vue", "@ckeditor/ckeditor5-build-classic"],
        },
        preview: {
            port: parseInt(env.VITE_APP_PREVIEW_PORT) || 8081,
        },
        server: {
            port: parseInt(env.VITE_APP_PORT) || 8080,
        },
    };
});
