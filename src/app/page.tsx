import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function RootPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('ws-session')?.value
  if (token) {
    redirect('/marketing/campanhas/meta-ads')
  }
  redirect('/login')
}
