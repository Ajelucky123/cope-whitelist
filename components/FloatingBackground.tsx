'use client'

import { useEffect } from 'react'

export default function FloatingBackground() {
  useEffect(() => {
    const floatingContainer = document.getElementById('floating-background')
    if (!floatingContainer) return

    const numCharacters = 8
    const minSize = 80
    const maxSize = 150

    for (let i = 0; i < numCharacters; i++) {
      const character = document.createElement('div')
      character.className = 'floating-character'

      const img = document.createElement('img')
      img.src = '/images/image.png'
      img.alt = 'Floating COPE'
      character.appendChild(img)

      const size = Math.random() * (maxSize - minSize) + minSize
      character.style.width = `${size}px`
      character.style.height = `${size}px`

      const startX = Math.random() * 100
      const startY = Math.random() * 100
      character.style.left = `${startX}%`
      character.style.top = `${startY}%`

      const rotation = Math.random() * 360
      character.style.transform = `rotate(${rotation}deg)`

      const duration = Math.random() * 15 + 15
      const delay = Math.random() * 5

      const animationName = `float-${i}`
      const moveX1 = (Math.random() * 300 - 150).toFixed(2)
      const moveY1 = (Math.random() * 300 - 150).toFixed(2)
      const moveX2 = (Math.random() * 300 - 150).toFixed(2)
      const moveY2 = (Math.random() * 300 - 150).toFixed(2)
      const moveX3 = (Math.random() * 300 - 150).toFixed(2)
      const moveY3 = (Math.random() * 300 - 150).toFixed(2)
      const rot1 = (rotation + Math.random() * 180).toFixed(2)
      const rot2 = (rotation + Math.random() * 360).toFixed(2)
      const rot3 = (rotation + Math.random() * 180).toFixed(2)

      const keyframes = `
        @keyframes ${animationName} {
          0% { transform: translate(0, 0) rotate(${rotation}deg); }
          25% { transform: translate(${moveX1}px, ${moveY1}px) rotate(${rot1}deg); }
          50% { transform: translate(${moveX2}px, ${moveY2}px) rotate(${rot2}deg); }
          75% { transform: translate(${moveX3}px, ${moveY3}px) rotate(${rot3}deg); }
          100% { transform: translate(0, 0) rotate(${rotation}deg); }
        }
      `

      const style = document.createElement('style')
      style.textContent = keyframes
      document.head.appendChild(style)

      character.style.animation = `${animationName} ${duration}s ease-in-out infinite`
      character.style.animationDelay = `${delay}s`

      floatingContainer.appendChild(character)
    }
  }, [])

  return <div id="floating-background" className="floating-background"></div>
}

