import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import classnames from 'classnames'

import '@/assets/css/globals.css'
import 'react-perfect-scrollbar/dist/css/styles.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Paperless Exam',
  description: 'Paperless App',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={classnames(
          'flex is-full min-bs-full flex-auto flex-col',
          inter.className
        )}
      >
        {/* AppRouterCacheProvider diperlukan untuk MUI v7 dengan Next.js App Router */}
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
