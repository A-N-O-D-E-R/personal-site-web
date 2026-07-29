import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useQuery } from '@tanstack/react-query'
import { getBlogPosts } from '../services/blog'
import StarField from '../components/three/StarField'
import { useTranslation } from '../i18n/useTranslation'

export default function Blog() {
  const { t } = useTranslation()
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['blog'],
    queryFn: getBlogPosts,
    staleTime: 1000 * 60 * 15
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white/70">{t('blog.loading')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white/70">
          {t('blog.error')}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div className="fixed inset-0 pointer-events-none">
        <Canvas gl={{ alpha: false }} style={{ background: '#000000' }}>
          <Suspense fallback={null}>
            <StarField />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-white">{t('nav.blog')}</h1>

        {posts.length === 0 ? (
          <div className="text-white/70">{t('blog.noPosts')}</div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <article key={post.link} className="bg-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-3xl p-6 hover:border-white/30 transition" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <h2 className="text-2xl font-light text-white mb-2 group-hover:text-blue-400 transition">
                    {post.title}
                  </h2>
                  <time className="text-sm text-white/50 block mb-3">
                    {new Date(post.pubDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <p className="text-white/70 leading-relaxed font-light">{post.description}</p>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
