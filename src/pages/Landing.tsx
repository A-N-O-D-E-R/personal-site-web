import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import StarField from '../components/three/StarField'
import SolarSystem from '../components/three/SolarSystem'
import { useTranslation } from '../i18n/useTranslation'
import data from '../data/const.json'

export default function Landing() {
  const { t } = useTranslation()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      <div className="fixed inset-0" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <Canvas
          gl={{ alpha: false, antialias: true }}
          style={{ background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)' }}
        >
          <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={60} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
          />
          <Suspense fallback={null}>
            <StarField />
            <SolarSystem />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10">
        <div className="h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <h1 className="text-7xl md:text-9xl font-thin tracking-tighter mb-6 text-white animate-fade-in">
              {data.firstname} {data.lastname.toUpperCase()}
            </h1>
            <p className="text-2xl md:text-3xl text-white/60 font-extralight mb-12 tracking-wide">
              Building things with code
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/experience"
                className="group px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full hover:border-white/30 hover:bg-white/10 transition-all text-white/80 font-light tracking-wide"
                style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform">
                  {t('nav.experience')} →
                </span>
              </a>
              <a
                href="/projects"
                className="group px-8 py-4 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all text-white font-light tracking-wide"
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform">
                  {t('nav.projects')} →
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-thin text-white mb-12">
              Explore the Universe
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Full-Stack', desc: 'Building scalable web applications from frontend to backend', icon: '🌍' },
                { title: '3D Graphics', desc: 'Creating immersive experiences with Three.js and WebGL', icon: '🪐' },
                { title: 'Cloud & DevOps', desc: 'Deploying systems with modern infrastructure', icon: '☁️' }
              ].map((item) => (
                <div
                  key={item.title}
                  className="group p-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-white/30 hover:bg-white/[0.05] transition-all"
                  style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="text-xl font-light text-white mb-3">{item.title}</h3>
                  <p className="text-white/60 text-sm font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
