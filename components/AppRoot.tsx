import { Analytics } from '@vercel/analytics/next'
import { Geist } from 'next/font/google'
import { AuthHeader } from '@/components/AuthHeader'
import { Footer } from '@/components/Footer'
import { SiteLogo } from '@/components/SiteLogo'
import { ThemeProvider } from '@/components/ThemeProvider'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans', preload: false })

type AppRootProps = {
  children: React.ReactNode
  lang: 'ja' | 'en'
}

export function AppRoot({ children, lang }: AppRootProps) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${geist.variable} antialiased`}>
        <ThemeProvider>
          <header className="sticky top-0 z-40 glass-soft">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
              <SiteLogo />
              <AuthHeader />
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
