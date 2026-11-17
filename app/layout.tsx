import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Moon & Bloom | Tic-Tac-Toe by Johnrey",
  description:
    "A little friendly rivalry. Play Moon & Bloom, a two-player tic-tac-toe game with original characters, saved rounds, and a celebration for every win.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
