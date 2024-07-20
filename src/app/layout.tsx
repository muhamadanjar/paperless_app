import { headers } from 'next/headers';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/css/globals.css";
import classnames from "classnames";

import 'react-perfect-scrollbar/dist/css/styles.css';

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
  const headersList = headers()

  return (
    <html lang="en">
      <body
        className={classnames(
          "flex is-full min-bs-full flex-auto flex-col",
          inter.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
