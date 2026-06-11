import type { Metadata } from "next";
import { Outfit, Poppins } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-outfit",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raxa",
  description: "Organize sua pelada",
};

/**
 * Root application layout that applies global fonts, HTML language and wraps page content with application providers.
 *
 * @param children - The page content to render inside the layout
 * @returns The root HTML element containing the themed body and provided children
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-background font-poppins text-text antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
