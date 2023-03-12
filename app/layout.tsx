import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
  title: 'Irhal.com - Islamic Travel Guide for Muslim Travelers',
  description:
    "Build your muslim traveler friendly itinerary, powered by ChatGPT-3. Irhal.com, your AI Islamic travel assistant.",
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
        <body
          className={cn(
            'min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-gradient-to-b from-[#191919] to-[#15162c] dark:text-slate-50 flex flex-col items-center',
            fontSans.variable
          )}
        >
          {/* <SiteHeader /> */}
          <main className='flex flex-col items-center'>{children}</main>
          <TailwindIndicator />
        </body>
      </ThemeProvider>
    </html>
  )
}
