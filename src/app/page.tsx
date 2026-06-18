import { redirect } from 'next/navigation'

export default function RootPage() {
  // Instantly redirect the root URL to the admin dashboard
  redirect('/admin')
}