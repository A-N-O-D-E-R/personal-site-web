import { useRef, useMemo, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Text, Line, Sphere } from '@react-three/drei'
import { Group, Vector3 } from 'three'

type Props = {
  skills: string[]
}

// HR-focused domain clustering
const categorizeSkill = (skill: string): string => {
  const domains: Record<string, string[]> = {
    embedded: ['c++', 'c', 'arduino', 'embedded', 'iot', 'raspberry', 'firmware', 'microcontroller'],
    mobile: ['react-native', 'flutter', 'ios', 'android', 'swift', 'kotlin', 'mobile'],
    web: ['react', 'vue', 'angular', 'svelte', 'next', 'html', 'css', 'sass', 'tailwind', 'frontend', 'ui', 'ux'],
    backend: ['node', 'express', 'nestjs', 'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails', 'api', 'server'],
    data: ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'data', 'database', 'etl', 'bigquery', 'spark'],
    devops: ['docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab', 'ci/cd', 'pipeline', 'deployment'],
    cloud: ['aws', 'azure', 'gcp', 'cloud', 'lambda', 's3', 'ec2', 'cloudformation'],
    it: ['linux', 'windows', 'networking', 'system', 'admin', 'server', 'infrastructure'],
    ai: ['tensorflow', 'pytorch', 'machine learning', 'ml', 'deep learning', 'ai', 'nlp', 'opencv', 'neural'],
    language: ['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'php', 'ruby']
  }

  const lowerSkill = skill.toLowerCase()
  for (const [domain, keywords] of Object.entries(domains)) {
    if (keywords.some(keyword => lowerSkill.includes(keyword))) {
      return domain
    }
  }
  return 'other'
}

const domainColors: Record<string, string> = {
  embedded: '#8b5cf6',   // Purple
  mobile: '#ec4899',     // Pink
  web: '#3b82f6',        // Blue
  backend: '#10b981',    // Green
  data: '#f59e0b',       // Orange
  devops: '#ef4444',     // Red
  cloud: '#06b6d4',      // Cyan
  it: '#64748b',         // Gray
  ai: '#14b8a6',         // Teal
  language: '#f97316',   // Deep orange
  other: '#6b7280'       // Neutral gray
}

// Define logical domain connections (career paths)
const domainConnections: Record<string, string[]> = {
  embedded: ['mobile'],
  mobile: ['web', 'backend'],
  web: ['backend', 'language'],
  backend: ['data', 'devops', 'language'],
  data: ['ai', 'backend'],
  devops: ['cloud', 'it'],
  cloud: ['devops', 'backend'],
  it: ['devops'],
  ai: ['data', 'language'],
  language: ['web', 'backend', 'mobile']
}

export default function SkillConstellation({ skills }: Props) {
  const groupRef = useRef<Group>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const nodes = useMemo(() => {
    const categorized = skills.map(skill => ({
      skill,
      domain: categorizeSkill(skill)
    }))

    // Group by domain
    const domainGroups: Record<string, any[]> = {}
    categorized.forEach(item => {
      if (!domainGroups[item.domain]) domainGroups[item.domain] = []
      domainGroups[item.domain].push(item)
    })

    // Position domains in logical flow: embedded → mobile → web → backend → data/ai, with devops/cloud/it on side
    const domainPositions: Record<string, [number, number]> = {
      embedded: [-4, 2],
      mobile: [-2, 3],
      web: [0, 4],
      backend: [2, 3],
      data: [4, 2],
      ai: [4, -1],
      devops: [2, -3],
      cloud: [0, -4],
      it: [-2, -3],
      language: [-4, -1]
    }

    const result: any[] = []

    Object.entries(domainGroups).forEach(([domain, items]) => {
      const centerPos = domainPositions[domain] || [0, 0]

      items.forEach((item, itemIndex) => {
        const angle = (itemIndex / items.length) * Math.PI * 2
        const spread = 0.6
        const x = centerPos[0] + Math.cos(angle) * spread
        const z = centerPos[1] + Math.sin(angle) * spread
        const y = (Math.random() - 0.5) * 0.8

        result.push({
          skill: item.skill,
          domain: item.domain,
          position: new Vector3(x, y, z),
          color: domainColors[item.domain]
        })
      })
    })

    return result
  }, [skills])

  const connections = useMemo(() => {
    const lines: Array<{ points: [Vector3, Vector3], color: string, opacity: number }> = []
    const domainCenters: Record<string, Vector3> = {}

    // Calculate domain centers
    nodes.forEach(node => {
      if (!domainCenters[node.domain]) {
        domainCenters[node.domain] = new Vector3()
      }
    })

    Object.keys(domainCenters).forEach(domain => {
      const domainNodes = nodes.filter(n => n.domain === domain)
      const center = new Vector3()
      domainNodes.forEach(n => center.add(n.position))
      center.divideScalar(domainNodes.length)
      domainCenters[domain] = center
    })

    // Connect within same domain
    nodes.forEach((node, i) => {
      const sameDomain = nodes
        .filter((n, idx) => idx !== i && n.domain === node.domain)
        .sort((a, b) => node.position.distanceTo(a.position) - node.position.distanceTo(b.position))
        .slice(0, 2)

      sameDomain.forEach(target => {
        lines.push({
          points: [node.position, target.position],
          color: node.color,
          opacity: 0.3
        })
      })
    })

    // Connect between related domains (logical career paths)
    Object.entries(domainConnections).forEach(([fromDomain, toDomains]) => {
      if (!domainCenters[fromDomain]) return

      toDomains.forEach(toDomain => {
        if (!domainCenters[toDomain]) return

        // Find closest nodes between domains
        const fromNodes = nodes.filter(n => n.domain === fromDomain)
        const toNodes = nodes.filter(n => n.domain === toDomain)

        if (fromNodes.length > 0 && toNodes.length > 0) {
          // Connect one representative node from each domain
          const fromNode = fromNodes[0]
          const toNode = toNodes.reduce((closest, node) =>
            fromNode.position.distanceTo(node.position) < fromNode.position.distanceTo(closest.position)
              ? node : closest
          )

          lines.push({
            points: [fromNode.position, toNode.position],
            color: '#ffffff',
            opacity: 0.08
          })
        }
      })
    })

    return lines
  }, [nodes])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {connections.map((connection, i) => (
        <Line
          key={i}
          points={connection.points}
          color={connection.color}
          opacity={connection.opacity}
          transparent
          lineWidth={connection.color === '#ffffff' ? 1 : 2}
        />
      ))}

      {nodes.map((node, i) => {
        const isHovered = hoveredIndex === i
        const scale = isHovered ? 1.5 : 1

        return (
          <group key={i} position={node.position}>
            <Sphere
              args={[0.08 * scale, 16, 16]}
              onPointerEnter={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation()
                setHoveredIndex(i)
              }}
              onPointerLeave={() => setHoveredIndex(null)}
            >
              <meshStandardMaterial
                color={isHovered ? node.color : node.color}
                emissive={node.color}
                emissiveIntensity={isHovered ? 1.2 : 0.6}
                transparent
                opacity={isHovered ? 1 : 0.9}
              />
            </Sphere>

            {isHovered && (
              <Sphere args={[0.15, 16, 16]}>
                <meshBasicMaterial
                  color={node.color}
                  transparent
                  opacity={0.15}
                />
              </Sphere>
            )}

            <Text
              position={[0, -0.3, 0]}
              fontSize={isHovered ? 0.18 : 0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#000000"
            >
              {node.skill}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
