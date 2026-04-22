export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-zinc-700">Loading</p>
        <p className="text-xs text-zinc-400">Please wait a moment…</p>
      </div>
    </div>
  )
}