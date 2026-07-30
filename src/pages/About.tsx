import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sparkles } from '@react-three/drei'
import { useQuery } from '@tanstack/react-query'
import StarField from '../components/three/StarField'
import SkillConstellation from '../components/three/SkillConstellation'
import FloatingParticles from '../components/three/FloatingParticles'
import { getProjects } from '../services/projects'
import { getExperiences } from '../services/experiences'
import { useTranslation } from '../i18n/useTranslation'
import data from '../data/const.json'
import { FaGithub, FaDocker, FaLinkedin } from 'react-icons/fa'
import { SiApache } from 'react-icons/si'
import { MdEmail } from 'react-icons/md'

export default function About() {
  const { t } = useTranslation()
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })
  const { data: experiences = [] } = useQuery({
    queryKey: ['experiences'],
    queryFn: getExperiences
  })

  const skills = useMemo(() => {
    const allSkills = new Set<string>()
    projects.forEach(p => p.tech.forEach(t => allSkills.add(t)))
    experiences.forEach(e => e.tech?.forEach(t => allSkills.add(t)))
    return Array.from(allSkills).sort()
  }, [projects, experiences])

  const socialLinks = [
    { name: 'GitHub', url: `https://github.com/${data['github-profile']}`, Icon: FaGithub },
    { name: 'Docker Hub', url: `https://hub.docker.com/u/${data["docker-profile"]}`, Icon: FaDocker },
    { name: 'Maven Central', url: `https://mvnrepository.com/artifact/io.github.${data["github-profile"].toLowerCase()}`, Icon: SiApache },
    { name: 'LinkedIn', url: `https://linkedin.com/in/${data["linkdin-profile"]}`, Icon: FaLinkedin },
    { name: 'Email', url: `mailto:${data["email"]}`, Icon: MdEmail }
  ]
  const websites = [
    { name: 'Portfolio v1', url: 'https://old-portfolio.example.com' },
    { name: 'Blog', url: 'https://blog.example.com' },
    { name: 'Side Project', url: 'https://project.example.com' }
  ]

  const [view3D, setView3D] = useState(false)

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
        <h1 className="text-4xl font-bold mb-8 text-white">{t('about.title')}</h1>

        <section className="mb-12">
          <p className="text-lg text-white/70 leading-relaxed font-light">
            {t('about.description')}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">{t('about.connect')}</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            {socialLinks.map(link => {
              const Icon = link.Icon
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/[0.02] backdrop-blur-2xl border border-white/20 p-4 rounded-2xl hover:border-white/30 transition text-white/80 font-medium flex items-center justify-center"
                  style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
                  title={link.name}
                >
                  <Icon className="w-6 h-6" />
                </a>
              )
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">{t('about.websites')}</h2>
          <div className="space-y-3">
            {websites.map(site => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/[0.02] backdrop-blur-2xl border border-white/20 p-4 rounded-2xl hover:border-white/30 transition"
                style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white/80 font-medium">{site.name}</span>
                  <span className="text-white/50 text-sm">→</span>
                </div>
                <div className="text-white/50 text-sm mt-1">{site.url}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{t('about.skills')}</h2>
            <button
              onClick={() => setView3D(!view3D)}
              className="px-4 py-2 bg-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-2xl hover:border-white/30 transition text-white/80 text-sm font-medium"
              style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
            >
              {view3D ? t('about.gridView') : t('about.constellation3D')}
            </button>
          </div>

          {view3D ? (
            <div className="h-[500px] bg-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <OrbitControls enablePan={false} minDistance={5} maxDistance={12} enableDamping dampingFactor={0.05} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
                <Suspense fallback={null}>
                  <FloatingParticles />
                  <Sparkles count={50} scale={10} size={2} speed={0.3} opacity={0.3} color="#60a5fa" />
                  <SkillConstellation skills={skills} />
                </Suspense>
              </Canvas>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map(skill => (
                <div key={skill} className="bg-white/[0.02] backdrop-blur-2xl border border-white/20 p-4 rounded-2xl text-center hover:border-white/30 transition text-white/80" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
                  {skill}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <a
            href={`${import.meta.env.BASE_URL}cv`}
            className="inline-block bg-white/20 hover:bg-white/30 px-6 py-3 rounded-2xl transition text-white border border-white/30 font-medium"
          >
            {t('about.downloadCV')}
          </a>
        </section>
      </div>
    </div>
  )
}
