import Image from 'next/image'
import { getPopularApps, type PopularApp } from '@/lib/popular-apps'

// 決定論的疑似乱数 (シード基準) → SSR/CSR 一致
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export async function AppIconBackdrop() {
  const data = await getPopularApps(24)
  const apps: PopularApp[] = data.filter((a) => !!a.info?.icon)

  if (apps.length === 0) return null

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div className="absolute inset-0 opacity-40 dark:opacity-25 [filter:blur(48px)_saturate(1.5)]">
        {apps.map((app, i) => {
          const x = seededRandom(i * 13.7) * 100
          const y = seededRandom(i * 7.3 + 1) * 120 - 10
          const scale = 0.8 + seededRandom(i * 5.1 + 2) * 1.2
          const rotate = (seededRandom(i * 11.2 + 3) - 0.5) * 30
          return (
            <Image
              key={app.name}
              src={app.info!.icon}
              alt=""
              width={120}
              height={120}
              unoptimized
              className="absolute rounded-3xl"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
              }}
            />
          )
        })}
      </div>
      {/* グラデーションオーバーレイで読みやすく */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60 dark:from-slate-950/50 dark:via-slate-950/30 dark:to-slate-950/70" />
    </div>
  )
}
