import Link from 'next/link'

type Props = { tag: string; type?: 'app' | 'widget' | 'theme' }

const colors = {
  app: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  widget: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  theme: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
}

export function TagBadge({ tag, type = 'app' }: Props) {
  return (
    <Link
      href={`/?tag=${encodeURIComponent(tag)}&type=${type}`}
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${colors[type]}`}
    >
      {tag}
    </Link>
  )
}
