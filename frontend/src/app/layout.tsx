import SideBar from "./SideBar";
import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ch">
      <body className="h-screen overflow-hidden">
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