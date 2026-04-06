export const timings = {
  fast: 0.2,
  base: 0.28,
  smooth: 0.34
}

export const easings = {
  smooth: [0.22, 1, 0.36, 1],
  gentle: [0.4, 0, 0.2, 1]
}

export const pageVariants = {
  initial: { opacity: 0, y: 10, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.995 }
}

export const pageTransition = {
  duration: timings.smooth,
  ease: easings.smooth
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: timings.base, ease: easings.smooth }
  }
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02
    }
  }
}

export const cardHover = {
  y: -4,
  boxShadow: "0 16px 32px rgba(15, 23, 42, 0.35)",
  transition: { duration: timings.base, ease: easings.smooth }
}

export const buttonTap = {
  scale: 0.95
}
