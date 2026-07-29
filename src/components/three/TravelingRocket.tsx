import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import { latLonToSphere } from '../../utils/coords'

type Props = {
  globeRef: React.RefObject<Group>
}

export default function TravelingRocket({ globeRef }: Props) {
  const rocketRef = useRef<Group>(null)
  const [launchTime, setLaunchTime] = useState<number | null>(null)
  const [launchKourouWorld, setLaunchKourouWorld] = useState<Vector3 | null>(null)

  const frenchGuyana = useMemo(() => {
    // Kourou, French Guiana coordinates
    return new Vector3(...latLonToSphere(5.1679, -52.6503, 1.5))
  }, [])

  useFrame(({ clock }) => {
    if (rocketRef.current && globeRef.current) {
      const t = clock.getElapsedTime()

      // Calculate moon position in world space
      const moonDistance = 2.5
      const moonSpeed = 0.1
      const moonAngle = t * moonSpeed
      const moonPosWorld = new Vector3(
        Math.cos(moonAngle) * moonDistance,
        0,
        Math.sin(moonAngle) * moonDistance
      )

      // Convert moon world position to globe local space
      const moonPosLocal = moonPosWorld.clone()
      globeRef.current.worldToLocal(moonPosLocal)

      // Check launch window
      const kourouAngle = Math.atan2(frenchGuyana.z, frenchGuyana.x)
      const globeRotation = globeRef.current.rotation.y
      const kourouWorldAngle = kourouAngle + globeRotation
      const angleDiff = Math.abs(((moonAngle - kourouWorldAngle + Math.PI) % (Math.PI * 2)) - Math.PI)

      const launchWindow = Math.PI / 3
      const canLaunch = angleDiff < launchWindow

      if (canLaunch && launchTime === null) {
        setLaunchTime(t)
        setLaunchKourouWorld(frenchGuyana.clone())
      }

      if (launchTime !== null && launchKourouWorld) {
        const timeSinceLaunch = t - launchTime
        const duration = 15

        if (timeSinceLaunch > duration) {
          setLaunchTime(null)
          setLaunchKourouWorld(null)
        } else {
          const progress = Math.min(timeSinceLaunch / duration, 1)

          // Calculate target moon position in local space at arrival
          const arrivalTime = launchTime + duration
          const arrivalMoonAngle = arrivalTime * moonSpeed
          const targetMoonWorld = new Vector3(
            Math.cos(arrivalMoonAngle) * moonDistance,
            0,
            Math.sin(arrivalMoonAngle) * moonDistance
          )

          // Convert to local space using globe rotation at launch time
          const launchGlobeRotation = globeRef.current.rotation.y - (t - launchTime) * 0.001 * Math.max(0.1, Math.min(1, (5 - 2) / 8))
          const targetLocal = targetMoonWorld.clone()
          targetLocal.applyAxisAngle(new Vector3(0, 1, 0), -launchGlobeRotation)

          const currentPos = new Vector3()
          currentPos.lerpVectors(launchKourouWorld, targetLocal, progress)

          rocketRef.current.position.copy(currentPos)

          const lookTarget = targetLocal.clone()
          rocketRef.current.lookAt(lookTarget)
        }
      } else {
        rocketRef.current.position.copy(frenchGuyana)
        rocketRef.current.lookAt(moonPosLocal)
      }
    }
  })

  return (
    <group ref={rocketRef} scale={0.3}>
      {/* Rocket body */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rocket nose cone */}
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.05, 0.1, 16]} />
        <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Rocket fins */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[-0.12, side * 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.08, 0.001, 0.08]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Engine glow */}
      <pointLight position={[-0.2, 0, 0]} intensity={0.5} color="#f97316" distance={1} />
      <mesh position={[-0.18, 0, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
    </group>
  )
}
