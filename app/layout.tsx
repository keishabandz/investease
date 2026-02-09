import "./globals.css";
import type { Metadata } from "next";
import { getAppUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Investease Learning Studio",
  description: "Adaptive MOOC-style investing curriculum with AI-guided learning plans.",
  metadataBase: getAppUrl(),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
