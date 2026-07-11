'use client'

import { useRouter } from 'next/navigation'
import { SwipeStack, type CardData } from '@/components/animations/SwipeStack'

const ONBOARDING_TOPICS: CardData[] = [
  {
    id: 'f1',
    title: 'Formula 1',
    description: 'Max Verstappen, Red Bull, FIA updates.',
  },
  {
    id: 'dutch_politics',
    title: 'Dutch Politics',
    description: 'The Cabinet, Tweede Kamer, new laws.',
  },
  {
    id: 'technology',
    title: 'Technology',
    description: 'AI, Gadgets, Cyber Security.',
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'AEX, ASML, Housing market.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()

  const handleSwipe = async (card: CardData, direction: 'left' | 'right') => {
    // In a real app, send this to your Supabase backend to set preference weight
    const weight = direction === 'right' ? 3.0 : -1.0
    console.log(`Saved preference for ${card.id}: weight ${weight}`)
    
    // Example: await fetch('/api/preferences', { method: 'POST', body: JSON.stringify({ tag: card.id, weight }) })
  }

  const handleComplete = () => {
    // Redirect to the main feed once onboarding is done
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background-light p-4 pt-20">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-neutral-textLight">
          Tune your Vibe
        </h1>
        <p className="text-neutral-textDark">
          Swipe right if you care, left if you don't.
        </p>
      </div>

      <SwipeStack
        cards={ONBOARDING_TOPICS}
        onSwipe={handleSwipe}
        onComplete={handleComplete}
      />
    </div>
  )
}
