import { Points, PointMaterial } from '@react-three/drei'
import { useMemo } from 'react'

export default function StarField() {
  const positions = useMemo(() => {
    const arr = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3
      arr[i3] = (Math.random() - 0.5) * 20
      arr[i3 + 1] = (Math.random() - 0.5) * 20
      arr[i3 + 2] = (Math.random() - 0.5) * 20
    }
    return arr
  }, [])

  return (
    <Points positions={positions}>
      <PointMaterial size={0.01} color="white" transparent opacity={1} />
    </Points>
  )
}
