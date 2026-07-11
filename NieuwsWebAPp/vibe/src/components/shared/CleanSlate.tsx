'use client'

import { motion } from 'framer-motion'

export function CleanSlate() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-8 relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-white shadow-premium">
        {/* Playful windmill/sun visual */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-dashed border-blue-200 opacity-50"
        />
        <span className="text-5xl">✨</span>
      </div>
      
      <h2 className="mb-3 text-3xl font-bold tracking-tight text-neutral-textLight">
        Je bent helemaal bij!
      </h2>
      <p className="text-neutral-textDark max-w-[250px] leading-relaxed">
        You've read everything important. Come back later for the next Vibe drop.
      </p>

      <button className="mt-10 rounded-xl bg-neutral-100 px-6 py-3 font-semibold text-neutral-textLight transition-transform hover:scale-105 active:scale-95">
        View Stats
      </button>
    </motion.div>
  )
}
