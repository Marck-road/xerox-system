import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function Hero({ onScroll }: { onScroll: () => void }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: '16/7' }}>
        <Image src="/CoverPicture.png" alt="Connections Copier" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-white" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <Badge className="bg-orange-500 hover:bg-orange-500 text-white text-xs tracking-widest uppercase px-3 py-1">
            Fast · Affordable · Reliable
          </Badge>
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
            Connections Copier
          </h1>
          <p className="text-zinc-100 text-sm sm:text-base max-w-sm drop-shadow">
            Fill out your order below — no account needed!
          </p>
          <button onClick={onScroll} className="mt-1 flex flex-col items-center cursor-pointer gap-1 text-orange-300 hover:text-orange-200 transition-colors">
            <span className="text-xs font-bold tracking-widest uppercase">Order Now</span>
            <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
    </div>
  );
}