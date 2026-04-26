'use client'

import { useState, useEffect } from 'react'

const IMAGE_SETS = [
  [
    'https://picsum.photos/seed/a1/400/600',
    'https://picsum.photos/seed/a2/400/400',
    'https://picsum.photos/seed/a3/400/500',
    'https://picsum.photos/seed/a4/400/350',
    'https://picsum.photos/seed/a5/400/600',
    'https://picsum.photos/seed/a6/400/400',
    'https://picsum.photos/seed/a7/400/550',
    'https://picsum.photos/seed/a8/400/400',
    'https://picsum.photos/seed/a9/400/600',
    'https://picsum.photos/seed/a10/400/350',
    'https://picsum.photos/seed/a11/400/500',
    'https://picsum.photos/seed/a12/400/450',
    'https://picsum.photos/seed/a13/400/600',
    'https://picsum.photos/seed/a14/400/350',
    'https://picsum.photos/seed/a15/400/500',
    'https://picsum.photos/seed/a16/400/400',
  ],
  [
    'https://picsum.photos/seed/b1/400/500',
    'https://picsum.photos/seed/b2/400/600',
    'https://picsum.photos/seed/b3/400/400',
    'https://picsum.photos/seed/b4/400/550',
    'https://picsum.photos/seed/b5/400/400',
    'https://picsum.photos/seed/b6/400/600',
    'https://picsum.photos/seed/b7/400/350',
    'https://picsum.photos/seed/b8/400/500',
    'https://picsum.photos/seed/b9/400/450',
    'https://picsum.photos/seed/b10/400/600',
    'https://picsum.photos/seed/b11/400/400',
    'https://picsum.photos/seed/b12/400/500',
    'https://picsum.photos/seed/b13/400/350',
    'https://picsum.photos/seed/b14/400/600',
    'https://picsum.photos/seed/b15/400/400',
    'https://picsum.photos/seed/b16/400/550',
  ],
  [
    'https://picsum.photos/seed/c1/400/600',
    'https://picsum.photos/seed/c2/400/350',
    'https://picsum.photos/seed/c3/400/500',
    'https://picsum.photos/seed/c4/400/600',
    'https://picsum.photos/seed/c5/400/400',
    'https://picsum.photos/seed/c6/400/550',
    'https://picsum.photos/seed/c7/400/600',
    'https://picsum.photos/seed/c8/400/350',
    'https://picsum.photos/seed/c9/400/500',
    'https://picsum.photos/seed/c10/400/400',
    'https://picsum.photos/seed/c11/400/600',
    'https://picsum.photos/seed/c12/400/350',
    'https://picsum.photos/seed/c13/400/500',
    'https://picsum.photos/seed/c14/400/450',
    'https://picsum.photos/seed/c15/400/600',
    'https://picsum.photos/seed/c16/400/400',
  ],
]

export default function BackgroundGrid({ animate = false }: { animate?: boolean }) {
  const [currentSet, setCurrentSet] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!animate) return
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrentSet(prev => (prev + 1) % IMAGE_SETS.length)
        setFading(false)
      }, 800)
    }, 5000)
    return () => clearInterval(interval)
  }, [animate])

  const images = IMAGE_SETS[currentSet]

  return (
    <div
      className="absolute inset-x-0 top-0 -bottom-[8%] grid grid-cols-4 gap-2 p-2 grid-drift"
      style={{ opacity: fading ? 0.1 : 0.38, transition: 'opacity 0.8s ease' }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative rounded-xl overflow-hidden min-h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ transition: 'opacity 0.8s ease' }}
          />
        </div>
      ))}
    </div>
  )
}
