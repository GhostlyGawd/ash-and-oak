import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ash & Oak — A Living World",
  description: "An experimental living-world fantasy game about inhabiting a life that history remembers.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
