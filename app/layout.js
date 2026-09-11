import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TITLE,
  SITE_NAME,
  sharedOpenGraph,
  sharedTwitter,
  siteBaseUrl,
} from "@/lib/site-seo";

export const metadata = {
  metadataBase: new URL(siteBaseUrl()),
  title: {
    default: DEFAULT_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: [{ url: "/logo-elite-performers.png", type: "image/png" }],
    apple: [{ url: "/logo-elite-performers.png", type: "image/png" }],
    shortcut: "/logo-elite-performers.png",
  },
  openGraph: sharedOpenGraph(DEFAULT_TITLE, DEFAULT_DESCRIPTION),
  twitter: sharedTwitter(DEFAULT_TITLE, DEFAULT_DESCRIPTION),
  other: {
    "og:image:alt": DEFAULT_OG_IMAGE_ALT,
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
