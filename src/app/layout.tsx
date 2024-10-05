import type { Metadata } from 'next'

import { geistMono, geistSans } from '@/components/fonts'
import { Toaster } from '@/components/ui/sonner'

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
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <QueryProvider>{children}</QueryProvider>
          <Toaster richColors position='top-center' />
        </ThemeProvider>
      </body>
    </html>
  )
}
