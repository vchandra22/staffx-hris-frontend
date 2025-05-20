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
                "vtd-primary": colors.emerald, // Menggunakan emerald sebagai base untuk primary
                "vtd-secondary": colors.slate, // Menggunakan slate sebagai base untuk secondary

                background: "hsl(210, 20%, 98%)", // Warna latar light (dari #E5E7EB)
                foreground: "hsl(220, 13%, 13%)", // Warna teks dark (dari #1C242E)

                primary: {
                    DEFAULT: "hsl(158, 64%, 33%)", // #0E9F6E
                    foreground: "hsl(0, 0%, 100%)",
                },
                secondary: {
                    DEFAULT: "hsl(220, 13%, 13%)", // #1C242E
                    foreground: "hsl(0, 0%, 100%)",
                },
                info: {
                    DEFAULT: "hsl(220, 80%, 60%)", // Biru cerah (tetap)
                    foreground: "hsl(0, 0%, 100%)",
                },
                success: {
                    DEFAULT: "hsl(158, 64%, 33%)", // Menggunakan warna primary
                    foreground: "hsl(0, 0%, 100%)",
                },
                warning: {
                    DEFAULT: "hsl(43, 74%, 66%)", // Warna kuning dari chart-4 (#E5E7EB disesuaikan)
                    foreground: "hsl(0, 0%, 10%)",
                },
                danger: {
                    DEFAULT: "hsl(0, 85%, 60%)", // #EF4444
                    foreground: "hsl(0, 0%, 100%)",
                },
                accent: {
                    DEFAULT: "hsl(158, 64%, 43%)", // Lebih terang dari primary
                    foreground: "hsl(0, 0%, 100%)",
                },
                muted: {
                    DEFAULT: "hsl(220, 9%, 46%)", // #6B7280
                    foreground: "hsl(220, 13%, 13%)", // #1C242E
                },
                destructive: {
                    DEFAULT: "hsl(0, 85%, 60%)", // #EF4444
                    foreground: "hsl(0, 0%, 100%)",
                },
                border: "hsl(220, 13%, 90%)", // Light border
                input: "hsl(220, 13%, 90%)", // Light input
                ring: "hsl(158, 64%, 33%)", // Warna primary untuk focus rings
                card: {
                    DEFAULT: "hsl(0, 0%, 100%)",
                    foreground: "hsl(220, 13%, 13%)",
                },
                popover: {
                    DEFAULT: "hsl(0, 0%, 100%)",
                    foreground: "hsl(220, 13%, 13%)",
                },
                chart: {
                    1: "hsl(158, 64%, 33%)", // Primary (#0E9F6E)
                    2: "hsl(220, 13%, 13%)", // Secondary (#1C242E)
                    3: "hsl(220, 9%, 46%)",  // Muted (#6B7280)
                    4: "hsl(220, 14%, 96%)", // Light (#E5E7EB)
                    5: "hsl(0, 85%, 60%)",   // Danger (#EF4444)
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
