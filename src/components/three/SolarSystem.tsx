import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import { Group, Mesh } from 'three'
import { Rocket, Satellite } from './SpaceObjects'

export default function SolarSystem() {
  const systemRef = useRef<Group>(null)
  const sunRef = useRef<Mesh>(null)

  // Load textures
  const earthTexture = useTexture(`${import.meta.env.BASE_URL}/textures/planets/earth_atmos_2048.jpg`)
  const sunTexture = useTexture(`${import.meta.env.BASE_URL}/textures/sun_lava.jpg`)
    const planets = [
    { radius: 0.3, distance: 2, speed: 0.5, color: '#8b8680', name: 'Mercury' },
    { radius: 0.4, distance: 3.5, speed: 0.3, color: '#e8cda2', name: 'Venus' },
    { radius: 0.35, distance: 5, speed: 0.2, texture: earthTexture, name: 'Earth' },
    { radius: 0.3, distance: 6.5, speed: 0.15, color: '#c1440e', name: 'Mars' }
  ]

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (sunRef.current) {
      sunRef.current.rotation.y = t * 0.1
    }

    if (systemRef.current) {
      systemRef.current.children.forEach((child) => {
        if (child.name.startsWith('planet-')) {
          const planetData = planets[parseInt(child.name.split('-')[1])]
          const angle = t * planetData.speed
          child.position.x = Math.cos(angle) * planetData.distance
          child.position.z = Math.sin(angle) * planetData.distance
          child.rotation.y = t * 0.5
        }
      })
    }
  })

  return (
    <group ref={systemRef}>
      {/* Sun */}
      <Sphere ref={sunRef} args={[0.8, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          map={sunTexture}
          emissive="#f59e0b"
          emissiveMap={sunTexture}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </Sphere>

      {/* Sun glow */}
      <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.15}
        />
      </Sphere>

      {/* Planets */}
      {planets.map((planet, i) => (
        <group key={i} name={`planet-${i}`}>
          <Sphere args={[planet.radius, 32, 32]}>
            <meshStandardMaterial
              map={'texture' in planet ? planet.texture : undefined}
              color={'color' in planet ? planet.color : undefined}
              roughness={0.8}
              metalness={0.1}
            />
          </Sphere>
          {/* Planet atmosphere glow */}
          <Sphere args={[planet.radius * 1.05, 16, 16]}>
            <meshBasicMaterial
              color={i === 2 ? '#60a5fa' : '#ffffff'}
              transparent
              opacity={i === 2 ? 0.15 : 0.05}
            />
          </Sphere>
        </group>
      ))}

      {/* Orbit rings */}
      {planets.map((planet) => (
        <mesh key={`orbit-${planet.name}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.distance - 0.01, planet.distance + 0.01, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
          />
        </mesh>
      ))}

      {/* Lighting */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#fbbf24" distance={20} />
      <ambientLight intensity={0.1} />

      {/* Space objects */}
      <Rocket />
      <Satellite />
    </group>
  )
}
