import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="w-full bg-zinc-950 border-b border-orange-500/20 px-6 py-0 flex items-center justify-between h-14 sticky top-0 z-50 shadow-lg shadow-orange-500/5">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5">
        {/* Icon mark */}
        <div className="w-7 h-7 rounded-md flex items-center justify-center shadow-md shadow-orange-500/30">
          <Image src="/Logo.png" alt="logo" width={32} height={32} />
        </div>

        {/* Brand name */}
        <span className="text-white font-semibold text-sm tracking-tight">
          Connections{" "}
          <span className="text-orange-400 font-bold">Copier</span>
        </span>
      </div>
    </nav>
  );
}
