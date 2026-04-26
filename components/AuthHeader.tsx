import Link from 'next/link'
import { Upload, User, LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from './SignOutButton'

export async function AuthHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthed = !!user && !user.is_anonymous

  return (
    <div className="flex items-center gap-2">
      {isAuthed ? (
        <>
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
          <SignOutButton />
        </>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-1.5 bg-black text-white text-sm px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
        >
          <LogIn size={14} />
          ログイン
        </Link>
      )}
    </div>
  )
}
