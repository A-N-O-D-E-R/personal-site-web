import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import { Group } from 'three'

export default function Moon() {
  const groupRef = useRef<Group>(null)
  const moonTexture = useTexture(`${import.meta.env.BASE_URL}/textures/moon.jpg`)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime()
      const distance = 2.5
      const speed = 0.1
      groupRef.current.position.x = Math.cos(t * speed) * distance
      groupRef.current.position.z = Math.sin(t * speed) * distance
      groupRef.current.rotation.y = t * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <Sphere args={[0.2, 32, 32]}>
        <meshStandardMaterial
          map={moonTexture}
          roughness={1}
          metalness={0}
          color="#555555"
        />
      </Sphere>
    </group>
  )
}
