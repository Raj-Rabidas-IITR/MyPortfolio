export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white relative overflow-hidden">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500 opacity-30 animate-ping" />
        <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400 animate-spin" />
        <div className="absolute inset-2 bg-cyan-600 rounded-full shadow-inner shadow-cyan-700"></div>
      </div>
      <p className="absolute bottom-12 text-sm text-cyan-400 animate-pulse tracking-widest">LOADING...</p>
    </div>
  );
}
