import { useRef, forwardRef } from 'react'
import { Sphere, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

type Props = {
  children?: React.ReactNode
}

const Globe = forwardRef<Group, Props>(({ children }, forwardedRef) => {
  const internalRef = useRef<Group>(null)
  const ref = (forwardedRef as any) || internalRef
  const reducedMotion = usePrefersReducedMotion()
  const texture = useTexture('/world.jpg')
  const { camera } = useThree()

  useFrame(() => {
    if (ref.current && !reducedMotion) {
      const dist = camera.position.length()
      const speedFactor = Math.max(0.1, Math.min(1, (dist - 2) / 8))
      ref.current.rotation.y += 0.001 * speedFactor
    }
  })

  return (
    <group ref={ref}>
      <Sphere args={[1.5, 64, 64]}>
        <meshStandardMaterial
          map={texture}
          toneMapped={false}
        />
      </Sphere>
      {children}
    </group>
  )
})

Globe.displayName = 'Globe'

export default Globe
