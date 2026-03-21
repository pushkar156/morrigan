import Link from 'next/link'

export default function GlobalNotFound() {
    return (
        <div className="min-h-screen bg-[#e8f0fc] flex flex-col items-center justify-center font-sans px-6 text-center">
            <h1 className="text-[120px] md:text-[160px] leading-none font-bold text-[#1152d4] mb-4 font-serif drop-shadow-sm">
                404
            </h1>
            <p className="text-xl md:text-2xl text-black/60 mb-10 font-medium tracking-tight">
                Page Not Found
            </p>
            <Link 
                href="/" 
                className="bg-[#1152d4] text-white px-8 py-3.5 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-[#0c3e98] transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#1152d4]/50"
            >
                Return to Home
            </Link>
        </div>
    )
}
