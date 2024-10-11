import type { Metadata } from 'next'

import { geistMono, geistSans } from '@/components/fonts'
import Header from '@/components/header/Header'
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
        className={`${geistSans.variable} ${geistMono.className} h-screen overflow-y-scroll antialiased`}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <NetworkProvider>
            <QueryProvider>
              <AuthProvider>
                <Header />
                <main>
                  <div className='h-16 w-full bg-card'></div>
                  <div className='container'>{children}</div>
                </main>
              </AuthProvider>
            </QueryProvider>
          </NetworkProvider>
          <Toaster richColors position='top-center' />
        </ThemeProvider>
      </body>
    </html>
  )
}
