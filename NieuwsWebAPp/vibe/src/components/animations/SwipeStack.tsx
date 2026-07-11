'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

export type CardData = {
  id: string
  title: string
  image?: string
  description?: string
}

interface SwipeStackProps {
  cards: CardData[]
  onSwipe: (card: CardData, direction: 'left' | 'right') => void
  onComplete: () => void
}

export function SwipeStack({ cards, onSwipe, onComplete }: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // We show the cards in reverse order so the first is on top
  const activeCards = cards.slice(currentIndex, currentIndex + 3).reverse()

  const handleDragEnd = (event: any, info: any, card: CardData) => {
    const swipeThreshold = 100
    if (info.offset.x > swipeThreshold) {
      onSwipe(card, 'right') // Liked
      nextCard()
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe(card, 'left') // Disliked
      nextCard()
    }
  }

  const nextCard = () => {
    if (currentIndex === cards.length - 1) {
      onComplete()
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  if (currentIndex >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">All caught up!</h2>
        <p className="text-neutral-textDark">You've established your Vibe.</p>
      </div>
    )
  }

  return (
    <div className="relative flex h-[400px] w-full max-w-sm items-center justify-center">
      {activeCards.map((card, index) => {
        // isTop indicates the card currently being interacted with
        const isTop = index === activeCards.length - 1

        return (
          <SwipeCard
            key={card.id}
            card={card}
            isTop={isTop}
            index={index}
            totalActive={activeCards.length}
            onDragEnd={(e, info) => handleDragEnd(e, info, card)}
          />
        )
      })}
    </div>
  )
}

function SwipeCard({
  card,
  isTop,
  index,
  totalActive,
  onDragEnd,
}: {
  card: CardData
  isTop: boolean
  index: number
  totalActive: number
  onDragEnd: (e: any, info: any) => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-10, 10])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  // Stack styling calculation
  const position = totalActive - index - 1
  const scale = 1 - position * 0.05
  const yOffset = position * 15

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        y: yOffset,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        scale,
        zIndex: index,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className={`absolute flex h-[350px] w-[300px] flex-col overflow-hidden rounded-3xl bg-white shadow-premium ${
        isTop ? 'cursor-grab' : ''
      }`}
    >
      <div className="flex h-3/5 items-center justify-center bg-neutral-100">
        {/* Placeholder for image/icon */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-tulip text-4xl font-bold text-white shadow-inner">
          {card.title.charAt(0)}
        </div>
      </div>
      <div className="flex h-2/5 flex-col justify-center p-6 text-center">
        <h3 className="mb-2 text-xl font-bold text-neutral-textLight">{card.title}</h3>
        {card.description && (
          <p className="text-sm text-neutral-textDark">{card.description}</p>
        )}
      </div>
    </motion.div>
  )
}
