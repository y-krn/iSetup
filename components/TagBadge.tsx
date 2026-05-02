import Link from 'next/link'

type Props = { tag: string; type?: 'app' | 'widget' | 'theme'; label?: string }

const colors = {
  app: 'gallery-caption text-foreground hover:text-accent',
  widget: 'gallery-caption text-foreground hover:text-accent',
  theme: 'gallery-caption text-foreground hover:text-accent',
}

export function TagBadge({ tag, type = 'app', label }: Props) {
  return (
    <Link
      href={`/?tag=${encodeURIComponent(tag)}&type=${type}`}
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-colors ${colors[type]}`}
    >
      {label ?? tag}
    </Link>
  )
}
