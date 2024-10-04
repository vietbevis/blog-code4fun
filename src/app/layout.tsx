import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../providers/theme-provider";
import QueryProvider from "../providers/tanstack-provider";
import { geistMono, geistSans } from "@/components/fonts";

export const metadata: Metadata = {
  title: "Code4Fun.com",
  description: "A fun place to learn code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.className} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
