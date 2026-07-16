import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "Elite Performers Circle",
  description: "Free live workshop on Airbnb rental arbitrage.",
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
