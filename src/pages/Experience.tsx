import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Vector3 } from 'three'
import Globe from '../components/three/Globe'
import Marker from '../components/three/Marker'
import StarField from '../components/three/StarField'
import Moon from '../components/three/Moon'
import TravelingRocket from '../components/three/TravelingRocket'
import ExperiencePanel from '../components/ExperiencePanel'
import Timeline from '../components/Timeline'
import { getExperiences } from '../services/experiences'
import { latLonToSphere } from '../utils/coords'
import { useTranslation } from '../i18n/useTranslation'

function Sun() {
  const sunTexture = useTexture('/textures/sun_lava.jpg')

  return (
    <mesh position={[50, 20, 30]}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive="#FDB813"
        emissiveMap={sunTexture}
        emissiveIntensity={1.5}
        toneMapped={false}
      />
    </mesh>
  )
}

export default function Experience() {
  const { t } = useTranslation()
  const { data: experiences = [] } = useQuery({
    queryKey: ['experiences'],
    queryFn: getExperiences
  })
  const [selected, setSelected] = useState<number | null>(null)
  const [webglSupported, setWebglSupported] = useState(true)
  const [filteredExperiences, setFilteredExperiences] = useState(experiences)
  const controlsRef = useRef<any>(null)
  const globeRef = useRef<any>(null)

  const focusOnExperience = (index: number) => {
    setSelected(index)
    const exp = experiences[index]
    if (exp && (exp.lat || exp.lon) && controlsRef.current) {
      const pos = new Vector3(...latLonToSphere(exp.lat!, exp.lon!))
      const offset = pos.clone().normalize().multiplyScalar(3)

      controlsRef.current.target.copy(pos)
      controlsRef.current.object.position.copy(pos.clone().add(offset))
      controlsRef.current.update()
    }
  }

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    setWebglSupported(!!gl)
  }, [])

  if (!webglSupported) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('experience.webglNotAvailable')}</h2>
          <p className="text-gray-400">{t('experience.useModernBrowser')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen relative">
      <Canvas gl={{ alpha: false }} style={{ background: '#000000' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls ref={controlsRef} enablePan={false} minDistance={2} maxDistance={15} enableDamping dampingFactor={0.1} />
        <ambientLight intensity={0.3} />

        {/* Sun */}
        <Sun />
        <pointLight position={[50, 20, 30]} intensity={3} distance={100} color="#FDB813" />
        <directionalLight position={[50, 20, 30]} intensity={2} color="#FFF5E1" castShadow />
        <Suspense fallback={null}>
          <StarField />
          <Globe ref={globeRef}>
            {filteredExperiences.map((exp) => {
              const originalIndex = experiences.indexOf(exp)
              return (
                <Marker
                  key={exp.id}
                  position={exp.lat && exp.lon ? latLonToSphere(exp.lat, exp.lon) : exp.coords}
                  color={exp.type === 'work' ? '#3b82f6' : '#f97316'}
                  onClick={() => focusOnExperience(originalIndex)}
                  isSelected={selected === originalIndex}
                />
              )
            })}
            <TravelingRocket globeRef={globeRef} />
          </Globe>
          <Moon />
        </Suspense>
      </Canvas>
      <Timeline
        experiences={experiences}
        selectedIndex={selected}
        onSelect={focusOnExperience}
        onFilterChange={setFilteredExperiences}
      />
      {selected !== null && (
        <ExperiencePanel
          experience={experiences[selected]}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
