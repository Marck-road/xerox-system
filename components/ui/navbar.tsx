export default function Navbar() {
  return (
    <nav className="w-full bg-zinc-950 border-b border-orange-500/20 px-6 py-0 flex items-center justify-between h-14 sticky top-0 z-50 shadow-lg shadow-orange-500/5">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5">
        {/* Icon mark */}
        <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/30">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="4" cy="4" r="2" fill="white" />
            <circle cx="12" cy="4" r="2" fill="white" opacity="0.6" />
            <circle cx="4" cy="12" r="2" fill="white" opacity="0.6" />
            <circle cx="12" cy="12" r="2" fill="white" />
            <path
              d="M6 4h4M4 6v4M12 6v4M6 12h4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Brand name */}
        <span className="text-white font-semibold text-sm tracking-tight">
          Connections{" "}
          <span className="text-orange-400 font-bold">Copier</span>
        </span>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6">
        {["Dashboard", "Connections", "History", "Docs"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-zinc-400 hover:text-white text-sm font-medium transition-colors duration-150 relative group"
          >
            {item}
            <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px bg-orange-400 transition-all duration-200" />
          </a>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Status pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-orange-400 text-xs font-medium">Active</span>
        </div>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow duration-200">
          JD
        </button>
      </div>
    </nav>
  );
}
