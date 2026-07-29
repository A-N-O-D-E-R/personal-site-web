import { Sphere, Cylinder } from '@react-three/drei'
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { Vector3, Quaternion } from 'three'
import { useMemo, useRef, useState } from 'react'

type Props = {
  position: [number, number, number]
  color: string
  onClick: () => void
  isSelected?: boolean
}

export default function Marker({ position, color, onClick, isSelected = false }: Props) {
  const groupRef = useRef<any>(null)
  const { camera } = useThree()
  const [scale, setScale] = useState(1)

  const { pinPos, rotation, normal } = useMemo(() => {
    const pos = new Vector3(...position)
    const normal = pos.clone().normalize()

    const up = new Vector3(0, 1, 0)
    const quaternion = new Quaternion().setFromUnitVectors(up, normal)

    const pinHeight = 0.2
    const pinOffset = normal.clone().multiplyScalar(pinHeight / 2)

    return {
      pinPos: pinOffset.toArray() as [number, number, number],
      rotation: quaternion,
      normal: pos.toArray() as [number, number, number]
    }
  }, [position])

  useFrame(() => {
    if (groupRef.current) {
      const dist = camera.position.distanceTo(groupRef.current.position)
      const newScale = Math.max(0.3, Math.min(1, dist / 5))
      setScale(newScale)
    }
  })

  return (
    <group
      ref={groupRef}
      position={normal}
      scale={scale}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <Cylinder
        args={[0.01, 0.03, 0.2, 8]}
        position={pinPos}
        quaternion={rotation}
      >
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </Cylinder>
      <Sphere args={[0.04, 12, 12]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1.2 : 0.8} />
      </Sphere>
      {isSelected && (
        <Sphere args={[0.06, 12, 12]} position={[0, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </Sphere>
      )}
    </group>
  )
}
