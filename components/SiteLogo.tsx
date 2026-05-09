'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SiteLogo() {
  const pathname = usePathname()
  const href = pathname?.startsWith('/en') ? '/en' : '/'

  return (
    <Link href={href} className="font-black text-lg text-foreground">
      iSetup.app
    </Link>
  )
}

