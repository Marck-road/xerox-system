import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
          <FileX className="w-8 h-8 text-orange-500" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">404 Error</span>
          <h1 className="text-3xl font-extrabold text-zinc-900">Page not found</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button asChild className="bg-orange-500 hover:bg-orange-400 text-white font-semibold shadow-md shadow-orange-200">
            <Link href="/customer">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="border-zinc-200 text-zinc-600 hover:text-zinc-900">
            <Link href="javascript:history.back()">Go Back</Link>
          </Button>
        </div>

      </div>
    </div>
  )
}