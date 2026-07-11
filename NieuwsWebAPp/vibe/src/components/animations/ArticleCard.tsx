'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Article } from '@/lib/heuristic/score'

interface ArticleCardProps {
  article: Article
  isTop: boolean
  index: number
  totalActive: number
  onSwipe: (article: Article, direction: 'left' | 'right') => void
}

export function ArticleCard({ article, isTop, index, totalActive, onSwipe }: ArticleCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-5, 5])
  
  // Background color changes based on swipe direction (Green for right/save, Red for left/mute)
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#fee2e2', '#ffffff', '#dcfce7']
  )

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100
    if (info.offset.x > swipeThreshold) {
      onSwipe(article, 'right')
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe(article, 'left')
    }
  }

  // Visual stack effect
  const position = totalActive - index - 1
  const scale = 1 - position * 0.05
  const yOffset = position * 10

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        y: yOffset,
        rotate: isTop ? rotate : 0,
        backgroundColor: isTop ? background : '#ffffff',
        scale,
        zIndex: index,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className={`absolute flex h-[500px] w-full max-w-[340px] flex-col overflow-hidden rounded-3xl shadow-premium border border-neutral-100 ${
        isTop ? 'cursor-grab' : ''
      }`}
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-primary-tulip uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-md">
            {article.source_name}
          </span>
          {article.is_breaking && (
            <span className="text-xs font-bold text-accent-danger uppercase tracking-wider bg-red-50 px-2 py-1 rounded-md flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-accent-danger animate-pulse"></span>
              Breaking
            </span>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-textLight mb-3 leading-tight">
          {article.title}
        </h2>
        
        <p className="text-neutral-textDark text-sm leading-relaxed line-clamp-6">
          {article.description}
        </p>

        <div className="mt-auto pt-4 flex gap-2 flex-wrap">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-textDark font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="h-12 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between px-6 text-xs text-neutral-400 font-medium">
        <span>{new Date(article.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <button className="flex items-center justify-center h-6 w-6 rounded-full bg-neutral-200 text-neutral-600 hover:bg-neutral-300">
          i
        </button>
      </div>
    </motion.div>
  )
}
