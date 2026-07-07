import { useEffect, useRef } from 'react'

interface Node { x: number; y: number; vx: number; vy: number; radius: number }
interface Packet { fromIdx: number; toIdx: number; progress: number; speed: number }

const NODE_COUNT      = 28
const CONNECTION_DIST = 200
const PACKET_RATE     = 0.012

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Init canvas size
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    // Init nodes after canvas size is set
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      vx:     (Math.random() - 0.5) * 0.4,
      vy:     (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 1.5,
    }))

    const packets: Packet[] = []

    // Resize — reposition nodes proportionally
    const onResize = () => {
      const prevW = canvas.width
      const prevH = canvas.height
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      const scaleX = prevW > 0 ? canvas.width  / prevW : 1
      const scaleY = prevH > 0 ? canvas.height / prevH : 1
      for (const node of nodes) {
        node.x = Math.max(0, Math.min(canvas.width,  node.x * scaleX))
        node.y = Math.max(0, Math.min(canvas.height, node.y * scaleY))
      }
    }

    const onMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }

    window.addEventListener('resize',    onResize)
    window.addEventListener('mousemove', onMouseMove)

    const getConnected = (): [number, number][] => {
      const pairs: [number, number][] = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          if (dx * dx + dy * dy < CONNECTION_DIST * CONNECTION_DIST) pairs.push([i, j])
        }
      }
      return pairs
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mouse = mouseRef.current
      const pairs = getConnected()

      for (const [i, j] of pairs) {
        const dx   = nodes[i].x - nodes[j].x
        const dy   = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        ctx.beginPath()
        ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / CONNECTION_DIST) * 0.25})`
        ctx.lineWidth = 0.8
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.stroke()
      }

      for (const pkt of packets) {
        const from = nodes[pkt.fromIdx]
        const to   = nodes[pkt.toIdx]
        ctx.beginPath()
        ctx.arc(
          from.x + (to.x - from.x) * pkt.progress,
          from.y + (to.y - from.y) * pkt.progress,
          2.5, 0, Math.PI * 2
        )
        ctx.fillStyle = 'rgba(16,185,129,0.9)'
        ctx.fill()
      }

      for (const node of nodes) {
        const dx   = node.x - mouse.x
        const dy   = node.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,212,255,${dist < 120 ? 0.9 : 0.5})`
        ctx.fill()
      }
    }

    const update = () => {
      const { width: w, height: h } = canvas
      const mouse = mouseRef.current

      for (const node of nodes) {
        const dx   = node.x - mouse.x
        const dy   = node.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100 * 0.3
          node.vx += (dx / dist) * force
          node.vy += (dy / dist) * force
        }
        node.vx *= 0.99
        node.vy *= 0.99
        node.x  += node.vx
        node.y  += node.vy
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1
        node.x = Math.max(0, Math.min(w, node.x))
        node.y = Math.max(0, Math.min(h, node.y))
      }

      if (Math.random() < PACKET_RATE && nodes.length > 1) {
        const fromIdx = Math.floor(Math.random() * nodes.length)
        const toIdx   = (fromIdx + 1 + Math.floor(Math.random() * (nodes.length - 1))) % nodes.length
        packets.push({ fromIdx, toIdx, progress: 0, speed: 0.005 + Math.random() * 0.008 })
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        packets[i].progress += packets[i].speed
        if (packets[i].progress >= 1) packets.splice(i, 1)
      }
    }

    const loop = () => { update(); draw(); rafRef.current = requestAnimationFrame(loop) }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize',    onResize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none no-print"
      style={{ zIndex: 0, opacity: 0.7 }}
    />
  )
}
