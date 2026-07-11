import { HomeFeed } from '@/components/shared/HomeFeed'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background-light">
      {/* Header */}
      <header className="w-full flex items-center justify-between p-6 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-textLight">Vibe</h1>
        
        {/* Streak indicator */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-neutral-100">
          <span className="text-primary-tulip font-bold text-lg leading-none">🔥</span>
          <span className="text-sm font-bold text-neutral-700">3</span>
        </div>
      </header>

      {/* Main Feed Area */}
      <div className="flex-1 w-full max-w-sm mx-auto flex flex-col relative pb-20">
        <HomeFeed />
      </div>

      {/* Simple Bottom Nav for MVP */}
      <nav className="fixed bottom-0 w-full max-w-sm mx-auto bg-white/80 backdrop-blur-md border-t border-neutral-100 p-4 flex justify-around shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)] pb-safe z-50">
        <button className="flex flex-col items-center text-primary-tulip">
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-[10px] font-bold">Feed</span>
        </button>
        <button className="flex flex-col items-center text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="text-[10px] font-bold">Explore</span>
        </button>
        <button className="flex flex-col items-center text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </main>
  )
}
