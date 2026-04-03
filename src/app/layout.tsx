import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from 'next/font/google'
import "./globals.css";
import { Analytics } from "@vercel/analytics"
import { SpeedInsights } from "@vercel/speed-insights"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const notoSans = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-sans-tc' })

export const metadata: Metadata = {
  title: 'Investment-Lens',
  description: 'AI 投資分析平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className="dark h-full">
      <body className={`${inter.variable} ${notoSans.variable} font-sans antialiased h-full`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}