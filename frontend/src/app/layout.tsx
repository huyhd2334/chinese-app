import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import HalloweenWelcomeModal from "@/components/common/HalloweenWelcomeModal";
import UpgradeModal from "@/components/subscription/UpgradeModal";
import AppShell from "@/components/common/AppShell";
import SyncManager from "@/components/common/SyncManager";
import PwaRegister from "@/components/common/PwaRegister";
import { Nunito, Noto_Serif_SC } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-nunito",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-noto-serif-sc",
});

export const metadata: Metadata = {
  title: {
    default: "HSK Learning - Học tiếng Trung HSK 1-7",
    template: "%s | HSK Learning",
  },
  description:
    "Học tiếng Trung HSK 1-7: từ vựng, ôn tập thông minh SRS, luyện nghe đọc viết, đề thi mô phỏng. Đồng bộ đa thiết bị, học offline.",
  manifest: "/manifest.webmanifest",
  applicationName: "HSK Learning",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: { capable: true, title: "HSK Learning", statusBarStyle: "default" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${nunito.variable} ${notoSerifSC.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#c0392b" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("hsk_color_theme");if(t==="dark"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}var h=localStorage.getItem("hsk_halloween_event_theme");if(h==="on"){document.documentElement.classList.add("halloween-event-theme");}else{document.documentElement.classList.remove("halloween-event-theme");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="h-dvh overflow-hidden bg-china-paper text-china-ink font-sans selection:bg-china-red selection:text-white antialiased">
        <AuthProvider>
          <AppShell>{children}</AppShell>
          <AuthModal />
          <HalloweenWelcomeModal />
          <UpgradeModal />
          <SyncManager />
          <PwaRegister />
        </AuthProvider>
      </body>
    </html>
  );
}
