import { Experience } from '../types'

type Props = {
  experience: Experience
  onClose: () => void
}

export default function ExperiencePanel({ experience, onClose }: Props) {
  return (
    <div className="fixed left-8 top-8 bottom-8 w-[420px] overflow-hidden z-20">
      <div className="relative h-full bg-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent pointer-events-none" />

        <div className="relative p-8 h-full overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-all text-white/70 text-xl"
            aria-label="Close"
          >
            ×
          </button>

          <div className="mb-6">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${
              experience.type === 'work'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                : 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
            }`}>
              {experience.type.toUpperCase()}
            </div>

            <h2 className="text-3xl font-light tracking-tight text-white mb-2 leading-tight">
              {experience.title}
            </h2>
            <h3 className="text-xl font-medium text-white/80 mb-3">
              {experience.company}
            </h3>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span>{experience.location}</span>
              <span>•</span>
              <span>{experience.period}</span>
            </div>
          </div>

          <div className="h-px bg-white/10 my-6" />

          <p className="text-white/70 leading-relaxed mb-6 font-light">
            {experience.description}
          </p>

          {experience.tasks && experience.tasks.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wider">What I Worked On</h4>
              <ul className="space-y-2">
                {experience.tasks.map((task, idx) => (
                  <li key={idx} className="text-sm text-white/70 leading-relaxed flex gap-2">
                    <span className="text-blue-400/70 mt-1">→</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {experience.highlights && experience.highlights.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wider">Key Highlights</h4>
              <div className="space-y-2">
                {experience.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-yellow-400/80 flex-shrink-0 leading-relaxed">★</span>
                    <span className="text-sm text-white/70 leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {experience.tech && experience.tech.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wider">Technologies</h4>
              <div className="flex gap-2 flex-wrap">
                {experience.tech.map(t => (
                  <span
                    key={t}
                    className="text-xs font-medium bg-white/10 text-white/80 px-3 py-1.5 rounded-full border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {experience.resources && experience.resources.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wider">Resources & Links</h4>
              <div className="space-y-2">
                {experience.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-400/90 hover:text-blue-300 transition font-medium flex items-center gap-2"
                  >
                    <span>{resource.title}</span>
                    <span className="text-xs">→</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
