import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import { Upload, User } from 'lucide-react'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'homescreen.share',
  description: 'iOSホーム画面を共有しよう',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-gray-900 tracking-tight">
              homescreen.share
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/me"
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="マイページ"
              >
                <User size={16} />
              </Link>
              <Link
                href="/upload"
                className="flex items-center gap-1.5 bg-black text-white text-sm px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                <Upload size={14} />
                投稿
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
