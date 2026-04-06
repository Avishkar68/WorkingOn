export default function WelcomeModal({ close, openCreatePost }) {
  return (
    <div className="fixed h-screen inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md transition-all">
      
      {/* Container with a subtle border gradient for that 'premium' look */}
      <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-white/20 to-transparent animate-in fade-in zoom-in duration-300">
        
        <div className="relative bg-[#09090b]/90 backdrop-blur-2xl p-10 rounded-[22px] w-[540px] text-center overflow-hidden shadow-2xl">
          
          {/* Animated Background Orbs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full"></div>

          {/* Header Section */}
          <div className="space-y-2 mb-8">
            <span className="px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
              Early Access
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white pt-4">
              Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">SPITians</span>
            </h2>
          </div>

          {/* Body Text: Adjusted sizing for better visual balance */}
          <p className="text-gray-300 text-lg leading-relaxed font-light mb-10">
            You&apos;re part of an exclusive group of early users. <br /> 
            <span className="text-white font-medium">Ready to make your mark?</span>
          </p>

          {/* Action Area */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                close()
                if (typeof openCreatePost === "function") {
                  openCreatePost()
                }
              }}
              className="group relative w-full overflow-hidden rounded-xl bg-white px-8 py-4 font-semibold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)]">
                <div className="relative h-full w-8 bg-white/30 blur-md animate-shine"></div>
              </div>
              
              <span className="relative flex items-center justify-center gap-2 cursor-pointer ">
                Create Your First Post
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button
              onClick={close}
              className="w-full py-2 text-sm cursor-pointer font-medium text-gray-500 transition-colors hover:text-white"
            >
              Maybe later
            </button>
          </div>
          
        </div>
      </div>

    </div>
  );
}