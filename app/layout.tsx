import "@/public/globals.css"
import type { Metadata } from "next";
import { GlobalContextProvider } from "@/app/Context/store"
import { AuthHandler, Notification, Popup } from "./commons"

export const metadata: Metadata = {
  title: "Daimon Esports",
  description: "Powered by Daimon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalContextProvider>
          <AuthHandler>
            {children}
          </AuthHandler>
          <Notification/>
          <Popup/>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
