import type { Metadata } from "next";
import "@mairie360/lib-components/dist/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Files",
  description: "The Files's module.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="apple-mobile-web-app-title" content="Mairie360" />
      </head>
      <body>{children}</body>
    </html>
  );
}
