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
    <div className="space-y-6">
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-white/10 bg-white/2 px-5 py-5 sm:px-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            {eyebrow && (
              <p className="text-xs uppercase tracking-widest text-slate-400">{eyebrow}</p>
            )}
            <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-400 sm:text-base">{subtitle}</p>
            )}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </motion.section>

      {children}
    </div>
  )
}
