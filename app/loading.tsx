export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Neon spinning ring */}
      <div className="relative w-24 h-24">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/40 animate-ping" />
        
        {/* Gradient spinner */}
        <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-transparent border-t-cyan-400 border-r-purple-500 animate-spin" />
        
        {/* Inner glowing core */}
        <div className="absolute inset-4 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.8)]" />
      </div>

      {/* Loading text with futuristic style */}
      <p className="mt-10 text-cyan-400 tracking-[0.3em] text-sm font-mono animate-pulse">
        LOADING<span className="text-purple-400">...</span>
      </p>
    </div>
  );
}
