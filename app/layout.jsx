import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./provider";

export const metadata = {
  title: "FlickAI - AI Video Generator",
  description: "Generate videos using AI for YouTube, TikTok, and more.",
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
