import { defineConfig } from 'vite';
import wasm from "vite-plugin-wasm";

export default defineConfig({
    server: {
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin',
        },
    },
    plugins: [
        wasm()
    ]
});