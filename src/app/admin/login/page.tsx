import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Logo from '@/components/Logo' // Make sure this path is correct for your setup

// Note: Fixed the type signature here to Promise to stop Next.js 15 from throwing a red error
export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  const login = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/admin/login?error=Authentication failed')
    }
    return redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Increased to max-w-lg, p-10, and rounded-2xl for a standard, comfortable size */}
      <div className="max-w-lg w-full bg-white space-y-8 border border-gray-200 p-10 rounded-2xl shadow-xl">
        
        <div className="text-center flex flex-col items-center">
          {/* Logo container with explicit height/width so the SVG knows how big to be */}
          <div className="mx-auto  h-50 w-100  mb-4 flex items-center justify-center">
            <Logo />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#5f0229]">
            AdiJey Admin Portal
          </h2>
          {/* Increased subtitle to text-base */}
          <p className="mt-3 text-base text-gray-600">
            Sign in to view engineering enquiries
          </p>
        </div>

        <form className="mt-8 space-y-6" action={login}>
          {searchParams?.error && (
            <p className="text-red-600 text-base text-center font-medium bg-red-50 border border-red-100 p-3 rounded-lg">
              {searchParams.error}
            </p>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                // Thicker padding (py-3 px-4) and larger text (text-base)
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5f0229] focus:border-[#5f0229] text-base transition-colors"
                placeholder="Admin Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                // Thicker padding (py-3 px-4) and larger text (text-base)
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5f0229] focus:border-[#5f0229] text-base transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              // Taller button (py-3) with bolder text (font-bold text-base)
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-white bg-[#5f0229] hover:bg-[#4a011f] focus:outline-none focus:ring-4 focus:ring-[#5f0229]/20 transition-all"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}