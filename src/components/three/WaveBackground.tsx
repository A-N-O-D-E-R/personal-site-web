import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import { Mesh, ShaderMaterial } from 'three'

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;

    vec3 pos = position;
    float elevation = sin(pos.x * 2.0 + uTime) * 0.3;
    elevation += sin(pos.y * 3.0 + uTime * 0.5) * 0.2;

    pos.z = elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    float strength = (vElevation + 0.5) * 0.5;
    vec3 color1 = vec3(0.231, 0.510, 0.965); // #3b82f6
    vec3 color2 = vec3(0.545, 0.361, 0.965); // #8b5cf6
    vec3 finalColor = mix(color1, color2, strength);

    gl_FragColor = vec4(finalColor, 0.1);
  }
`

export default function WaveBackground() {
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as ShaderMaterial
      material.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <Plane ref={meshRef} args={[10, 10, 32, 32]} position={[0, 0, -5]}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 }
        }}
        transparent
      />
    </Plane>
  )
}
