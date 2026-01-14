import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#613C70", // Deep Purple
                    light: "#7D5A8C",
                    foreground: "white",
                },
                secondary: {
                    DEFAULT: "#AE838E", // Muted Rose
                    foreground: "white",
                },
                accent: {
                    DEFAULT: "#AE838E",
                    foreground: "white",
                },
                background: "#FFFCFF", // Warm White
                foreground: "#2a1b3d", // Dark Purple/Black
            },
            fontFamily: {
                serif: ["var(--font-serif)", "serif"],
                sans: ["var(--font-sans)", "sans-serif"],
            },
        },
        container: {
            center: true,
            padding: '2rem',
        }
    },
    plugins: [],
};
export default config;
