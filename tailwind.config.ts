import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: '#080402',
        footerColor: '#0C0F20',
        footerTextColor: '#B0B4B8',
        goldColor: '#D2AB62',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
export default config;
