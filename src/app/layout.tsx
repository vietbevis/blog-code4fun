import { geistMono, geistSans } from '@/components/fonts'
import Header from '@/components/header/Header'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import AuthProvider from '@/providers/auth-provider'
import FirebaseProvider from '@/providers/firebase-provider'
import NetworkProvider from '@/providers/network-provider'
import ScrollTop from '@/providers/scroll-top-provider'
import QueryProvider from '@/providers/tanstack-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import { baseOpenGraph } from '@/shared-metadata'

import './globals.css'

export async function generateMetadata() {
  return {
    title: {
      template: `%s | Code4Fun.com`,
      default: 'Code4Fun.com'
    },
    openGraph: {
      ...baseOpenGraph
    }
  }
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
          <TooltipProvider>
            <NetworkProvider>
              <QueryProvider>
                <AuthProvider>
                  <FirebaseProvider>
                    <Header />
                    <main>
                      <div className='h-16 w-full bg-card'></div>
                      <div className='container'>{children}</div>
                    </main>
                  </FirebaseProvider>
                </AuthProvider>
              </QueryProvider>
            </NetworkProvider>
            <Toaster richColors position='top-center' />
            <ScrollTop />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
