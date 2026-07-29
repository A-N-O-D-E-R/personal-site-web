import { useState, useMemo, Suspense, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { getProjects } from '../services/projects'
import ProjectCard from '../components/ProjectCard'
import StarField from '../components/three/StarField'
import FloatingParticles from '../components/three/FloatingParticles'
import { useTranslation } from '../i18n/useTranslation'

const ITEMS_PER_LOAD = 9

export default function Projects() {
  const { t } = useTranslation()
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })
  const [techFilters, setTechFilters] = useState<Set<string>>(new Set())
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD)
  const loaderRef = useRef<HTMLDivElement>(null)

  const allTech = useMemo(() =>
    Array.from(new Set(projects.flatMap(p => p.tech))).sort(),
    [projects]
  )

  const toggleTech = (tech: string) => {
    setTechFilters(prev => {
      const next = new Set(prev)
      if (next.has(tech)) {
        next.delete(tech)
      } else {
        next.add(tech)
      }
      return next
    })
    setVisibleCount(ITEMS_PER_LOAD)
  }

  const filtered = useMemo(() => {
    if (techFilters.size === 0) return projects
    return projects.filter(p => p.tech.some(t => techFilters.has(t)))
  }, [projects, techFilters])

  const visibleProjects = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount(prev => prev + ITEMS_PER_LOAD)
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white/70">{t('projects.loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <Canvas gl={{ alpha: false }} style={{ background: '#000000' }}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <StarField />
            <FloatingParticles />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 animate-fade-in">Projects</h1>

      <div className="mb-8">
        {techFilters.size > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {Array.from(techFilters).map(tech => (
              <div
                key={tech}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white/20 text-white border border-white/30 rounded-full"
              >
                <span>{tech}</span>
                <button
                  onClick={() => toggleTech(tech)}
                  className="hover:text-white/60 transition"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => setTechFilters(new Set())}
              className="px-3 py-1.5 text-sm text-white/50 hover:text-white/80 underline"
            >
              Clear all
            </button>
          </div>
        )}

        <details className="group max-w-md">
          <summary className="px-4 py-2 bg-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-2xl cursor-pointer hover:border-white/30 transition list-none flex items-center justify-between" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
            <span className="text-sm text-white/80">{techFilters.size > 0 ? `${techFilters.size} selected` : 'Filter by technology'}</span>
            <span className="text-white/40 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 max-h-64 overflow-y-auto bg-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-2xl p-2" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
            <div className="grid grid-cols-2 gap-1">
              {allTech.map(tech => (
                <label
                  key={tech}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer group/item"
                >
                  <input
                    type="checkbox"
                    checked={techFilters.has(tech)}
                    onChange={() => toggleTech(tech)}
                    className="w-4 h-4 rounded border-white/30 bg-white/10"
                  />
                  <span className="text-sm text-white/70 group-hover/item:text-white/90">{tech}</span>
                </label>
              ))}
            </div>
          </div>
        </details>
      </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mb-8 space-y-6">
          {visibleProjects.map((project, idx) => (
            <div
              key={project.id}
              className="break-inside-avoid animate-fade-in"
              style={{ animationDelay: `${(idx % ITEMS_PER_LOAD) * 0.1}s`, animationFillMode: 'backwards' }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {hasMore && (
          <div ref={loaderRef} className="flex justify-center py-8">
            <div className="text-white/50 text-sm">Loading more projects...</div>
          </div>
        )}

        {!hasMore && filtered.length > 0 && (
          <div className="text-center text-white/50 text-sm py-8">
            All {filtered.length} projects loaded
          </div>
        )}
      </div>
    </div>
  )
}
