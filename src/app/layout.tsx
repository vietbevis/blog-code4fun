import type { Metadata } from 'next'

import { geistMono, geistSans } from '@/components/fonts'
import { Toaster } from '@/components/ui/sonner'

import AuthProvider from '@/providers/auth-provider'
import NetworkProvider from '@/providers/network-provider'
import QueryProvider from '@/providers/tanstack-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'

export const metadata: Metadata = {
  title: 'Code4Fun.com',
  description: 'A fun place to learn code'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.className} antialiased`}
      >
        <NetworkProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <QueryProvider>
              <AuthProvider>{children}</AuthProvider>
              <Toaster richColors position='top-center' />
            </QueryProvider>
          </ThemeProvider>
        </NetworkProvider>
      </body>
    </html>
  )
}
