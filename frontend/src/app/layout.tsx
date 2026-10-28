import SideBar from "./SideBar";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import UpgradeModal from "@/components/subscription/UpgradeModal";
import AuthGate from "@/components/auth/AuthGate";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${nunito.variable} ${notoSerifSC.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Asynchronous Non-blocking fallback for full CJK glyph ranges */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&display=swap"
          media="print"
          // @ts-expect-error Next.js inline onload string
          onLoad="this.media='all'"
        />
      </head>
      <body className="h-dvh overflow-hidden bg-china-paper text-china-ink font-sans selection:bg-china-red selection:text-white antialiased">
        <AuthProvider>
          <AuthGate>
            <div className="flex flex-col md:flex-row h-dvh w-full overflow-hidden">
              <SideBar />

              <main className="min-w-0 min-h-0 flex-1 overflow-y-auto pb-24 md:pb-6">
                {children}
              </main>
            </div>
          </AuthGate>
          <AuthModal />
          <UpgradeModal />
        </AuthProvider>
      </body>
    </html>
  );
}
