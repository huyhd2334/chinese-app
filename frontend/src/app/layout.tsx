import SideBar from "./SideBar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="h-dvh overflow-hidden bg-china-paper text-china-ink font-sans selection:bg-china-red selection:text-white antialiased">
        <div className="flex flex-col md:flex-row h-dvh w-full overflow-hidden">
          <SideBar />

          <main className="min-w-0 min-h-0 flex-1 overflow-y-auto pb-24 md:pb-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}