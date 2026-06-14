import { useEffect, useRef, useState } from 'react'

export default function MacrophageGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [difficulty, setDifficulty] = useState('normal')
  const [gameStarted, setGameStarted] = useState(false)
  const [highScore, setHighScore] = useState(
    localStorage.getItem('bioHighScore') ? parseInt(localStorage.getItem('bioHighScore')!) : 0
  )

  useEffect(() => {
    if (!gameStarted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const macrophage = { x: canvas.width / 2, y: canvas.height / 2, radius: 15, vx: 0, vy: 0, speed: 5 }
    const bacteria: any[] = []
    const particles: any[] = []
    const powerUps: any[] = []
    let gameRunning = true
    let currentScore = 0
    let combo = 0
    let shieldActive = false
    let speedBoost = 0
    const keys: { [key: string]: boolean } = {}

    const diffSettings = {
      easy: { bacteriaCount: 3, speed: 1.5, spawnRate: 0.02 },
      normal: { bacteriaCount: 5, speed: 2, spawnRate: 0.03 },
      hard: { bacteriaCount: 8, speed: 3, spawnRate: 0.05 }
    }

    const settings = diffSettings[difficulty as keyof typeof diffSettings]

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
        vx: (Math.random() - 0.5) * settings.speed,
        vy: (Math.random() - 0.5) * settings.speed
      })
    }

    const createParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          life: 30,
          color
        })
      }
    }

    const spawnPowerUp = (x: number, y: number) => {
      if (Math.random() < 0.3) {
        const types = ['shield', 'speed']
        powerUps.push({
          x,
          y,
          type: types[Math.floor(Math.random() * types.length)],
          radius: 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        })
      }
    }

    for (let i = 0; i < settings.bacteriaCount; i++) spawnBacteria()

    const gameLoop = () => {
      if (!gameRunning) return

      macrophage.vx = 0
      macrophage.vy = 0

      if (keys['ArrowUp'] || keys['w']) macrophage.vy = -(macrophage.speed + speedBoost)
      if (keys['ArrowDown'] || keys['s']) macrophage.vy = macrophage.speed + speedBoost
      if (keys['ArrowLeft'] || keys['a']) macrophage.vx = -(macrophage.speed + speedBoost)
      if (keys['ArrowRight'] || keys['d']) macrophage.vx = macrophage.speed + speedBoost

      macrophage.x += macrophage.vx
      macrophage.y += macrophage.vy

      macrophage.x = Math.max(macrophage.radius, Math.min(canvas.width - macrophage.radius, macrophage.x))
      macrophage.y = Math.max(macrophage.radius, Math.min(canvas.height - macrophage.radius, macrophage.y))

      speedBoost = Math.max(0, speedBoost - 0.05)

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
          currentScore += 10 * (combo + 1)
          combo++
          setScore(currentScore)

          if (currentScore > highScore) {
            setHighScore(currentScore)
            localStorage.setItem('bioHighScore', currentScore.toString())
          }

          createParticles(b.x, b.y, '#ff6b6b')
          spawnPowerUp(b.x, b.y)

          if (bacteria.length < settings.bacteriaCount + Math.floor(currentScore / 50)) {
            spawnBacteria()
          }
        }
      })

      powerUps.forEach((p, index) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x - p.radius < 0 || p.x + p.radius > canvas.width) p.vx *= -1
        if (p.y - p.radius < 0 || p.y + p.radius > canvas.height) p.vy *= -1

        const dx = p.x - macrophage.x
        const dy = p.y - macrophage.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < macrophage.radius + p.radius) {
          if (p.type === 'shield') {
            shieldActive = true
            setTimeout(() => (shieldActive = false), 5000)
          } else if (p.type === 'speed') {
            speedBoost = 3
          }
          powerUps.splice(index, 1)
          createParticles(p.x, p.y, '#A8E63D')
        }
      })

      particles.forEach((p, index) => {
        p.x += p.vx
        p.y += p.vy
        p.life--
        if (p.life <= 0) particles.splice(index, 1)
      })

      bacteria.forEach((b) => {
        const dx = b.x - macrophage.x
        const dy = b.y - macrophage.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < macrophage.radius + b.radius) {
          if (!shieldActive) {
            gameRunning = false
            setGameOver(true)
          } else {
            shieldActive = false
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

      powerUps.forEach((p) => {
        ctx.fillStyle = '#A8E63D'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      particles.forEach((p) => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 30
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      })

      ctx.fillStyle = shieldActive ? '#A8E63D' : '#0D7A7A'
      ctx.beginPath()
      ctx.arc(macrophage.x, macrophage.y, macrophage.radius, 0, Math.PI * 2)
      ctx.fill()

      if (shieldActive) {
        ctx.strokeStyle = '#A8E63D'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(macrophage.x, macrophage.y, macrophage.radius + 8, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.fillStyle = '#0D7A7A'
      ctx.font = 'bold 20px Arial'
      ctx.fillText(`Score: ${currentScore}`, 10, 30)
      ctx.fillText(`Combo: ${combo}x`, 10, 60)
      ctx.fillText(`High: ${highScore}`, 10, 90)

      requestAnimationFrame(gameLoop)
    }

    gameLoop()
  }, [gameStarted, difficulty, highScore])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
    window.location.reload()
  }

  return (
    <div className="game-container">
      {!gameStarted ? (
        <div className="game-start-screen">
          <h3>🎮 Macrophage Defender</h3>
          <p>Eat bacteria and avoid collisions!</p>
          <div className="difficulty-selector">
            <label>
              <input
                type="radio"
                value="easy"
                checked={difficulty === 'easy'}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              Easy
            </label>
            <label>
              <input
                type="radio"
                value="normal"
                checked={difficulty === 'normal'}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              Normal
            </label>
            <label>
              <input
                type="radio"
                value="hard"
                checked={difficulty === 'hard'}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              Hard
            </label>
          </div>
          <button onClick={startGame} className="btn btn-primary">
            Start Game
          </button>
        </div>
      ) : (
        <>
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
            <p>🛡️ Shield (green) - Protects you for 5 seconds</p>
            <p>⚡ Speed Boost (yellow) - Move faster</p>
          </div>
        </>
      )}
    </div>
  )
}
