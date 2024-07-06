// import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import classnames from "classnames";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paperless Exam",
  description: "Paperless App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={classnames('flex is-full min-bs-full flex-auto flex-col', inter.className)}>
      </body>
    </html>
  );
}
