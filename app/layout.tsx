import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";
import { SITE } from "@/lib/constants";
import Providers from "./providers";
import Script from "next/script";

const inter = Inter({
  // map Inter to the variable expected by globals.css
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <Script id="dify-config" strategy="beforeInteractive">
          {`
            window.difyChatbotConfig = {
              token: 'FCVbQpF4fRXpkXb2',
              baseUrl: 'http://dify.hostiteasy.com',
              inputs: {
                // You can define the inputs from the Start node here
                // key is the variable name
                // e.g.
                // name: "NAME"
              },
              systemVariables: {
                // user_id: 'YOU CAN DEFINE USER ID HERE',
                // conversation_id: 'YOU CAN DEFINE CONVERSATION ID HERE, IT MUST BE A VALID UUID',
              },
              userVariables: {
                // avatar_url: 'YOU CAN DEFINE USER AVATAR URL HERE',
                // name: 'YOU CAN DEFINE USER NAME HERE',
              },
            }
          `}
        </Script>
        <Script
          src="http://dify.hostiteasy.com/embed.min.js"
          id="FCVbQpF4fRXpkXb2"
          strategy="afterInteractive"
        />
        <style jsx global>{`
          #dify-chatbot-bubble-button {
            background-color: #1C64F2 !important;
          }
          #dify-chatbot-bubble-window {
            width: 24rem !important;
            height: 40rem !important;
          }
        `}</style>
      </head>
      <body className={`${inter.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 to-slate-900" aria-hidden />
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
