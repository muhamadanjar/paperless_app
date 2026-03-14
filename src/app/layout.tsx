import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import classnames from 'classnames'

import '@/assets/css/globals.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import { AuthProvider } from '@/context/auth-provider'
import ProviderWrapper from '@/providers'
import ThemeRegistry from '@/components/ui/theme-registry'

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
        <ProviderWrapper>
          <AuthProvider>
            <ThemeRegistry>

              {children}
            </ThemeRegistry>
          </AuthProvider>
        </ProviderWrapper>
      </body>
    </html>
  )
}
