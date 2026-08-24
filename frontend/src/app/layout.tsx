import SideBar from "./SideBar";
import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ch">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="h-screen overflow-hidden bg-china-paper text-china-ink font-sans selection:bg-china-red selection:text-white">
        <div className="flex h-screen overflow-hidden">
          <SideBar />

          <main className="min-w-0 min-h-0 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}