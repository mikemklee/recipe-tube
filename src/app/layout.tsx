import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecipeTube",
  description: "Extract structured recipes from YouTube videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
