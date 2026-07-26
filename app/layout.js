import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import ThemeToggle from "@/components/ThemeToggle";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  process.env.APP_URL?.replace(/\/$/, "") ||
  "https://eliteperformerscircle.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Elite Performers Circle",
  description: "Free live workshop on Airbnb rental arbitrage.",
  icons: {
    icon: [{ url: "/logo-elite-performers.png", type: "image/png" }],
    apple: [{ url: "/logo-elite-performers.png", type: "image/png" }],
    shortcut: "/logo-elite-performers.png",
  },
  openGraph: {
    title: "Elite Performers Circle",
    description: "Free live workshop on Airbnb rental arbitrage.",
    siteName: "Elite Performers Circle",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/logo-elite-performers.png",
        width: 512,
        height: 512,
        alt: "Elite Performers Circle",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Elite Performers Circle",
    description: "Free live workshop on Airbnb rental arbitrage.",
    images: ["/logo-elite-performers.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Work+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <ThemeToggle />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
