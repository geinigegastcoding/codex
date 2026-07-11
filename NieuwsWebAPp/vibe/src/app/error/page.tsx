export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const message = params?.message || "Something went wrong with authentication."

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#f7f9fa]">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-2xl font-bold text-[#ef4444]">Oops!</h1>
        <p className="text-gray-600 mb-2">{message}</p>
        <a href="/login" className="mt-6 inline-block rounded-xl bg-gray-100 px-4 py-2 font-medium text-gray-900 transition-transform hover:bg-gray-200 active:scale-95">
          Try again
        </a>
      </div>
    </div>
  )
}
