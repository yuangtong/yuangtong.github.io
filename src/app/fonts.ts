import { Geist_Mono, Host_Grotesk, Noto_Sans_TC } from 'next/font/google';

export const host = Host_Grotesk({ subsets: ['latin'], weight: ['300', '400'], variable: '--font-host', display: 'swap' });
export const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-geist-mono', display: 'swap' });
export const notoTc = Noto_Sans_TC({ weight: ['300'], variable: '--font-noto-tc', display: 'swap', preload: false });
