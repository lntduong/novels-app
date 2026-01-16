import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/components/providers/language-provider';
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ContentProtection } from "@/components/providers/content-protection";

export const metadata: Metadata = {
  metadataBase: new URL('https://novels.yangyu.win'),
  title: {
    template: '%s | vnnovely',
    default: 'vnnovely',
  },
  description: 'Read your favorite novels for free on vnnovely. Updated daily with the best stories.',
  openGraph: {
    title: 'vnnovely - Read Novels Online',
    description: 'Read your favorite novels for free on vnnovely. Updated daily with the best stories.',
    url: 'https://novels.yangyu.win',
    siteName: 'vnnovely',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'vnnovely - Read Novels Online',
    description: 'Read your favorite novels for free on vnnovely.',
    creator: '@vnnovely',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ContentProtection />
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
