import { Project } from '../types'
import { useTranslation } from '../i18n/useTranslation'

export default function ProjectCard({ project }: { project: Project }) {
  const { t } = useTranslation()

  // Asymmetric rotation patterns
  const rotationPatterns = [
    'hover:rotate-1',
    'hover:-rotate-1',
    'hover:rotate-2',
    'hover:-rotate-2',
  ]
  const rotation = rotationPatterns[Math.abs(project.id.charCodeAt(0)) % rotationPatterns.length]

  return (
    <div className="relative group">
      <div className={`relative bg-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:border-white/30 transition-all hover:scale-105 ${rotation}`} style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />

        <div className="relative p-6">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover rounded-2xl mb-4"
              loading="lazy"
            />
          )}

          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-light tracking-tight text-white">{project.title}</h3>
            {project.stars !== undefined && (
              <div className="flex items-center gap-1 text-yellow-400/90">
                <span className="text-sm">★</span>
                <span className="text-sm font-medium">{project.stars}</span>
              </div>
            )}
          </div>

          <p className="text-white/60 mb-4 text-sm leading-relaxed font-light">{project.description}</p>

          <div className="flex gap-2 flex-wrap mb-4">
            {project.tech.slice(0, 2).map(tech => (
              <span key={tech} className="text-xs font-medium bg-white/10 text-white/80 px-3 py-1.5 rounded-full border border-white/10">
                {tech}
              </span>
            ))}
            {project.tech.length > 2 && (
              <span className="text-xs font-medium bg-white/5 text-white/60 px-3 py-1.5 rounded-full border border-white/10">
                {t('projects.moreTag', { count: project.tech.length - 2 })}
              </span>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-white/10">
            {project.latestRelease && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">{t('projects.latestRelease')}</span>
                <a
                  href={project.latestRelease.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400/90 hover:text-green-300 transition font-medium"
                >
                  {project.latestRelease.version}
                </a>
              </div>
            )}

            <div className="flex gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400/90 hover:text-blue-300 transition font-medium"
                >
                  {t('projects.github')} →
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400/90 hover:text-blue-300 transition font-medium"
                >
                  {t('projects.demo')} →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
