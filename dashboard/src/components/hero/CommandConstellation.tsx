import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Group, Mesh } from 'three'
import { useReducedMotion } from '../../utils/useReducedMotion'

const branchColors = ['#45b97c', '#3987e5', '#d95926']

function buildBranches(compact: boolean) {
  const branchCount = compact ? 4 : 6
  const pointCount = compact ? 5 : 8
  return Array.from({ length: branchCount }, (_, branchIndex) => {
    const angle = (Math.PI * 2 * branchIndex) / branchCount - Math.PI / 5
    return Array.from({ length: pointCount }, (_, pointIndex) => {
      const distance = 0.48 + pointIndex * 0.31
      const bend = Math.sin(pointIndex * 0.82 + branchIndex) * 0.16
      return [
        Math.cos(angle + bend * 0.18) * distance,
        Math.sin(angle + bend * 0.18) * distance * 0.72,
        Math.sin(branchIndex * 1.7 + pointIndex * 0.74) * 0.24,
      ] as [number, number, number]
    })
  })
}

function Network({ active, reducedMotion, compact }: { active: boolean; reducedMotion: boolean; compact: boolean }) {
  const group = useRef<Group>(null)
  const indicator = useRef<Mesh>(null)
  const branches = useMemo(() => buildBranches(compact), [compact])

  useFrame(({ clock, pointer }) => {
    if (!active || reducedMotion || !group.current) return
    const time = clock.getElapsedTime()
    group.current.rotation.y += (pointer.x * 0.045 - group.current.rotation.y) * 0.025
    group.current.rotation.x += (-pointer.y * 0.035 - group.current.rotation.x) * 0.025
    group.current.position.y = Math.sin(time * 0.42) * 0.035

    if (indicator.current) {
      const path = branches[1]
      const phase = (time * 0.34) % (path.length - 1)
      const index = Math.floor(phase)
      const mix = phase - index
      const start = path[index]
      const end = path[index + 1]
      indicator.current.position.set(
        start[0] + (end[0] - start[0]) * mix,
        start[1] + (end[1] - start[1]) * mix,
        start[2] + (end[2] - start[2]) * mix,
      )
    }
  })

  return (
    <group ref={group}>
      <mesh position={[-0.15, 0.02, 0.05]}>
        <icosahedronGeometry args={[0.23, 1]} />
        <meshStandardMaterial color="#65d29a" roughness={0.72} metalness={0.08} />
      </mesh>
      <mesh position={[0.34, 0.12, -0.08]}>
        <octahedronGeometry args={[0.31, 0]} />
        <meshBasicMaterial color="#183f2e" wireframe />
      </mesh>

      {branches.map((points, branchIndex) => (
        <group key={branchIndex}>
          <Line points={[[0.05, 0.06, 0], ...points]} color={branchColors[branchIndex % branchColors.length]} lineWidth={0.72} transparent opacity={0.48} />
          {points.map((point, pointIndex) => (
            <mesh position={point} key={pointIndex}>
              <dodecahedronGeometry args={[pointIndex % 3 === 0 ? 0.055 : 0.035, 0]} />
              <meshBasicMaterial color={branchColors[branchIndex % branchColors.length]} transparent opacity={pointIndex % 3 === 0 ? 0.84 : 0.42} />
            </mesh>
          ))}
        </group>
      ))}

      <mesh ref={indicator}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshBasicMaterial color="#f1f7f3" />
      </mesh>
    </group>
  )
}

export function CommandConstellation() {
  const host = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const [compact, setCompact] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const updateCompact = () => setCompact(window.innerWidth < 720)
    updateCompact()
    window.addEventListener('resize', updateCompact)

    const visibility = () => setActive(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', visibility)

    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting && document.visibilityState === 'visible'), { threshold: 0.08 })
    if (host.current) observer.observe(host.current)

    return () => {
      window.removeEventListener('resize', updateCompact)
      document.removeEventListener('visibilitychange', visibility)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="constellation" ref={host} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        dpr={[1, 1.5]}
        frameloop={active && !reducedMotion ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.35} />
        <directionalLight position={[2, 3, 4]} intensity={2.4} color="#a8dfbd" />
        <Network active={active} reducedMotion={reducedMotion} compact={compact} />
      </Canvas>
      <span className="node-label node-label--brain">Daniël · Brain</span>
      <span className="node-label node-label--company">MagisData</span>
      <div className="constellation-key"><span><i className="key-green" />Sales</span><span><i className="key-blue" />Website</span><span><i className="key-orange" />Uitvoering</span></div>
    </div>
  )
}
