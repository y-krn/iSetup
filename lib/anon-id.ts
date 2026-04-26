import { v4 as uuidv4 } from 'uuid'

const KEY = 'anon_user_id'

export function getAnonUserId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = uuidv4()
    localStorage.setItem(KEY, id)
  }
  return id
}
