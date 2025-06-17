import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Nelson Mbau - Full Stack Developer",
  description:
    "Portfolio of Nelson Mbau, a passionate full-stack developer and UI/UX designer creating amazing digital experiences.",
  keywords: "portfolio, developer, full-stack, react, nextjs, typescript",
  authors: [{ name: "Nelson Mbau" }],
  openGraph: {
    title: "Nelson Mbau - Full Stack Developer",
    description:
      "Portfolio of Nelson Mbau, a passionate full-stack developer and UI/UX designer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <TRPCReactProvider>
        <body className={inter.className}>{children}</body>
      </TRPCReactProvider>
    </html>
  );
}
