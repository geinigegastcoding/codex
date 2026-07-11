'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArticleCard } from '@/components/animations/ArticleCard'
import { CleanSlate } from '@/components/shared/CleanSlate'
import { Article, UserPreference, sortArticlesByScore } from '@/lib/heuristic/score'
import { motion, AnimatePresence } from 'framer-motion'

export function HomeFeed() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeed() {
      const supabase = createClient()
      
      // 1. Get user session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // 2. Fetch User Preferences
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', session.user.id)
      
      const userPreferences = (prefs as UserPreference[]) || []

      // 3. Fetch recent articles (last 48 hours) that the user hasn't read
      // For MVP, we'll fetch latest 100 and sort in memory
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      const { data: recentArticles } = await supabase
        .from('articles')
        .select('*')
        .gte('published_at', twoDaysAgo)
        .limit(100)
      
      if (recentArticles) {
        // Fetch interactions to filter out read/saved
        const { data: interactions } = await supabase
          .from('user_interactions')
          .select('article_id')
          .eq('user_id', session.user.id)
          .eq('is_read', true)
        
        const readArticleIds = new Set(interactions?.map(i => (i as { article_id: string }).article_id))
        const unreadArticles = (recentArticles as any[]).filter(a => !readArticleIds.has(a.id)) as Article[]
        
        // Score and sort
        const sorted = sortArticlesByScore(unreadArticles, userPreferences)
        
        // Cap at 20
        setArticles(sorted.slice(0, 20))
      }
      
      setLoading(false)
    }
    
    fetchFeed()
  }, [])

  const handleSwipe = async (article: Article, direction: 'left' | 'right') => {
    // Optimistically remove from feed
    setArticles(prev => prev.filter(a => a.id !== article.id))
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase
        .from('user_interactions')
        .upsert({
          user_id: user.id,
          article_id: article.id,
          is_read: true,
          is_saved: direction === 'right'
        })
    }
  }

  if (loading) {
    return (
      <div className="flex h-[500px] w-full max-w-[340px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-tulip border-t-transparent"></div>
        <p className="text-sm text-neutral-textDark font-medium">Curating your Vibe...</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return <CleanSlate />
  }

  return (
    <div className="relative flex h-[550px] w-full max-w-sm items-center justify-center pt-8">
      <AnimatePresence>
        {articles.map((article, index) => {
          const isTop = index === articles.length - 1
          return (
            <ArticleCard
              key={article.id}
              article={article}
              isTop={isTop}
              index={index}
              totalActive={articles.length}
              onSwipe={handleSwipe}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}
