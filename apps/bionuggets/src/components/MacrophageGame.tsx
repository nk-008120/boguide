import { useEffect, useRef, useState } from 'react'

export default function MacrophageGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState(localStorage.getItem('bioHighScore') ? parseInt(localStorage.getItem('bioHighScore')!) : 0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const macrophage = { x: canvas.width / 2, y: canvas.height / 2, radius: 15, vx: 0, vy: 0, speed: 5 }
    const bacteria: any[] = []
    let gameRunning = true
    let currentScore = 0
    const keys: { [key: string]: boolean } = {}

    window.addEventListener('keydown', (e) => {
      keys[e.key] = true
    })

    window.addEventListener('keyup', (e) => {
      keys[e.key] = false
    })

    const spawnBacteria = () => {
      const angle = Math.random() * Math.PI * 2
      const distance = 150
      bacteria.push({
        x: macrophage.x + Math.cos(angle) * distance,
        y: macrophage.y + Math.sin(angle) * distance,
        radius: 8,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      })
    }

    for (let i = 0; i < 5; i++) spawnBacteria()

    const gameLoop = () => {
      if (!gameRunning) return

      macrophage.vx = 0
      macrophage.vy = 0

      if (keys['ArrowUp'] || keys['w']) macrophage.vy = -macrophage.speed
      if (keys['ArrowDown'] || keys['s']) macrophage.vy = macrophage.speed
      if (keys['ArrowLeft'] || keys['a']) macrophage.vx = -macrophage.speed
      if (keys['ArrowRight'] || keys['d']) macrophage.vx = macrophage.speed

      macrophage.x += macrophage.vx
      macrophage.y += macrophage.vy

      macrophage.x = Math.max(macrophage.radius, Math.min(canvas.width - macrophage.radius, macrophage.x))
      macrophage.y = Math.max(macrophage.radius, Math.min(canvas.height - macrophage.radius, macrophage.y))

      bacteria.forEach((b, index) => {
        b.x += b.vx
        b.y += b.vy

        if (b.x - b.radius < 0 || b.x + b.radius > canvas.width) b.vx *= -1
        if (b.y - b.radius < 0 || b.y + b.radius > canvas.height) b.vy *= -1

        const dx = b.x - macrophage.x
        const dy = b.y - macrophage.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < macrophage.radius + b.radius) {
          bacteria.splice(index, 1)
          currentScore++
          setScore(currentScore)

          if (currentScore > highScore) {
            setHighScore(currentScore)
            localStorage.setItem('bioHighScore', currentScore.toString())
          }

          if (bacteria.length < 5 + Math.floor(currentScore / 5)) {
            spawnBacteria()
          }
        }
      })

      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      bacteria.forEach((b) => {
        ctx.fillStyle = '#ff6b6b'
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = '#ff6b6b'
        ctx.lineWidth = 2
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2
          const spikeLength = 5
          ctx.beginPath()
          ctx.moveTo(b.x + Math.cos(angle) * b.radius, b.y + Math.sin(angle) * b.radius)
          ctx.lineTo(b.x + Math.cos(angle) * (b.radius + spikeLength), b.y + Math.sin(angle) * (b.radius + spikeLength))
          ctx.stroke()
        }
      })

      ctx.fillStyle = '#0D7A7A'
      ctx.beginPath()
      ctx.arc(macrophage.x, macrophage.y, macrophage.radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#0D7A7A'
      ctx.font = 'bold 20px Arial'
      ctx.fillText(`Score: ${currentScore}`, 10, 30)
      ctx.fillText(`High: ${highScore}`, 10, 60)

      requestAnimationFrame(gameLoop)
    }

    gameLoop()
  }, [highScore])

  const resetGame = () => {
    setScore(0)
    setGameOver(false)
    window.location.reload()
  }

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="game-canvas"
      />
      {gameOver && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h3>Game Over!</h3>
            <p>Final Score: {score}</p>
            <p>High Score: {highScore}</p>
            <button onClick={resetGame} className="btn btn-primary">
              Play Again
            </button>
          </div>
        </div>
      )}
      <div className="game-controls">
        <p>⬆️ Arrow Keys or WASD to move</p>
        <p>📱 Touch & swipe on mobile</p>
      </div>
    </div>
  )
}
