import { motion } from "framer-motion"
import { fadeInUp } from "../../lib/motion"

export default function PageShell({
  eyebrow,
  title,
  subtitle,
  actions,
  children
}) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="pb-6 sm:pb-8 mb-4 border-b border-white/5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            {eyebrow && (
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-400">{eyebrow}</p>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-400 leading-relaxed sm:text-base max-w-2xl">{subtitle}</p>
            )}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </motion.section>

      {children}
    </div>
  )
}
