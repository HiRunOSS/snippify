import type {Metadata} from "next";
import {Inter, JetBrains_Mono} from "next/font/google";
import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from "@vercel/speed-insights/next";

import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title:
    "Snippify - Code Snippet & Screenshot Generator with Advanced Code Editor",
  description:
    "Snippify v2: Free code snippet generator & screenshot tool with enhanced code editor. 22+ professional themes, 50+ languages support, beautiful gradients. Perfect for developers, bloggers, and documentation.",
  keywords: [
    "code snippet generator",
    "screenshot tool",
    "code beautifier",
    "syntax highlighter",
    "code image generator",
    "developer tools",
    "code editor",
    "snippet sharing",
    "code visualization",
  ],
  authors: [{name: "Arun Kumar", url: "https://x.com/hiarun02"}],
  creator: "Arun Kumar",
  icons: {
    icon: "/icon.svg",
  },
  metadataBase: new URL("https://snippify.dev"),
  alternates: {
    canonical: "https://snippify.dev",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://snippify.dev",
    title: "Snippify - Free Code Snippet & Screenshot Generator",
    description:
      "Create beautiful code snippet images with 22+ themes, advanced editor, and professional screenshot tool. Free, no watermarks.",
    siteName: "Snippify",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Snippify - Code Snippet Generator & Screenshot Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snippify - Code Snippet & Screenshot Generator",
    description:
      "Free tool to create beautiful code snippet images with 22+ themes and advanced features.",
    creator: "@hiarun02",
    site: "@hiarun02",
    images: ["/preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport = {
  width: "device-width" as const,
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} ${jetBrainsMono.variable} min-h-screen overflow-x-hidden overflow-y-auto bg-background text-foreground`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
