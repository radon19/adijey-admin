import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Mail, Phone, Building2, User, Clock, LogOut } from 'lucide-react'
import Logo from '@/components/Logo';

// Prevents Next.js from caching the data so you always see new enquiries immediately
export const revalidate = 0; 

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Double check session just to be completely secure
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/admin/login')
  }

  // Fetch enquiries securely
  const { data: enquiries, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('submitted_at', { ascending: false })

  const handleLogout = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           
          <div className="flex justify-between items-center h-16">
 <Logo className="h-16 w-auto md:h-20" />
            <h1 className="text-2xl font-bold text-[#5f0229]">
              Admin Panel
            </h1>
            <form action={handleLogout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#5f0229] bg-white border border-[#5f0229] rounded-md hover:bg-[#5f0229] hover:text-white transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Enquiries</h2>
          <span className="bg-[#5f0229]/10 text-[#5f0229] py-1 px-3 rounded-full text-sm font-medium">
            {enquiries?.length || 0} Total
          </span>
        </div>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            Error loading data. Check RLS policies in Supabase.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enquiries?.map((enquiry) => (
            <div 
              key={enquiry.id} 
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="text-[#5f0229]" size={20} />
                    <span className="font-semibold text-gray-900">{enquiry.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={14} />
                    {new Date(enquiry.submitted_at).toLocaleDateString()}
                  </div>
                </div>

                {enquiry.company && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                    <Building2 className="text-[#5f0229]" size={16} />
                    {enquiry.company}
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                  <Mail className="text-[#5f0229]" size={16} />
                  <a href={`mailto:${enquiry.email}`} className="hover:text-[#5f0229] hover:underline">
                    {enquiry.email}
                  </a>
                </div>

                {enquiry.phone && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Phone className="text-[#5f0229]" size={16} />
                    <a href={`tel:${enquiry.phone}`} className="hover:text-[#5f0229] hover:underline">
                      {enquiry.phone}
                    </a>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {enquiry.message}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {enquiries?.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No enquiries have been submitted yet.
            </div>
          )}
        </div>
      </main>
    </div>
 )
}