export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-white/5 border border-white/10 rounded-xl ${className}`}
    />
  )
}
