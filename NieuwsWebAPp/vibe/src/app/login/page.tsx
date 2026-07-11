import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f9fa] p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
        {/* Playful mascot or logo could go here */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff6b6b] text-white text-3xl font-bold">
            V
          </div>
        </div>
        
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Welcome to Vibe
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          Your calm, personalized daily news.
        </p>

        <form className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#ff6b6b] focus:outline-none focus:ring-1 focus:ring-[#ff6b6b]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#ff6b6b] focus:outline-none focus:ring-1 focus:ring-[#ff6b6b]"
            />
          </div>
          
          <div className="mt-4 flex flex-col gap-3">
            <button
              formAction={login}
              className="rounded-xl bg-[#ff6b6b] px-4 py-3 font-semibold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-95"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-900 transition-transform hover:bg-gray-200 active:scale-95"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
