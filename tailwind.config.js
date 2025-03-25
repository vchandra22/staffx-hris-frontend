/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/views/**/*.{ts,tsx,vue}",
        "./src/components/**/*.{ts,tsx,vue}",
        "./src/**/**/*.{ts,tsx,vue}",
        "./node_modules/vue-tailwind-datepicker/**/*.js",
    ],
    theme: {
        extend: {
            fontSize: {
                sm: '12px',
                base: '14px',
                lg: '16px',
                xl: '20px',
                '2xl': '24px',
                '3xl': '30px',
                '4xl': '36px',
                '5xl': '48px',
                '6xl': '60px',
                '7xl': '72px',
                '8xl': '96px',
                '9xl': '128px',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                "vtd-primary": colors.sky,
                "vtd-secondary": colors.gray,
        
                background: "hsl(210, 40%, 98%)", // Latar belakang terang
                foreground: "hsl(210, 20%, 20%)", // Teks utama

                primary: {
                    DEFAULT: "hsl(193, 58%, 40%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                secondary: {
                    DEFAULT: "hsl(193, 50%, 30%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                info: {
                    DEFAULT: "hsl(220, 80%, 60%)", // Biru cerah
                    foreground: "hsl(0, 0%, 100%)",
                },
                success: {
                    DEFAULT: "hsl(130, 70%, 40%)", // Hijau sukses
                    foreground: "hsl(0, 0%, 100%)",
                },
                warning: {
                    DEFAULT: "hsl(45, 90%, 50%)", // Kuning peringatan
                    foreground: "hsl(0, 0%, 10%)",
                },
                danger: {
                    DEFAULT: "hsl(0, 80%, 50%)", // Merah bahaya
                    foreground: "hsl(0, 0%, 100%)",
                },
                accent: {
                    DEFAULT: "hsl(193, 70%, 50%)", // Lebih terang dari primary
                    foreground: "hsl(0, 0%, 100%)",
                },
                muted: {
                    DEFAULT: "hsl(193, 25%, 70%)", // Versi lebih soft dari primary
                    foreground: "hsl(193, 25%, 30%)",
                },
                destructive: {
                    DEFAULT: "hsl(0, 80%, 50%)", // Warna merah untuk aksi berbahaya
                    foreground: "hsl(0, 0%, 100%)",
                },
                border: "hsl(210, 20%, 80%)",
                input: "hsl(210, 20%, 90%)",
                ring: "hsl(193, 58%, 40%)", // Warna primary untuk focus rings
                card: {
                    DEFAULT: "hsl(0, 0%, 100%)",
                    foreground: "hsl(210, 20%, 20%)",
                },
                popover: {
                    DEFAULT: "hsl(0, 0%, 100%)",
                    foreground: "hsl(210, 20%, 20%)",
                },
                chart: {
                    1: "hsl(193, 58%, 40%)", // Primary
                    2: "hsl(340, 80%, 50%)", // Reddish tone
                    3: "hsl(45, 90%, 50%)", // Yellow tone
                    4: "hsl(220, 80%, 50%)", // Blue tone
                    5: "hsl(130, 70%, 40%)", // Green tone
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
