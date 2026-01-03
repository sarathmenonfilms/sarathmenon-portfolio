'use client'

import { usePathname } from 'next/navigation'
import { useMedia } from 'react-use'
import { ReactLenis } from 'lenis/react'
import type { LenisOptions } from 'lenis'
import Header from './navbar/Header'
import ScrollProgress from './scroll-progress/scroll-progress'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')
  const isMobile = useMedia('(max-width: 768px)', false)

  const scrollSettings: LenisOptions = isMobile
    ? {
        duration: 1,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        touchMultiplier: 1,
        infinite: false,
        lerp: 0.5,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: true,
      }
    : {
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: true,
      }

  if (isStudioRoute) {
    return <>{children}</>
  }

  return (
    <ReactLenis root options={scrollSettings}>
      <Header />
      <ScrollProgress />
      {children}
    </ReactLenis>
  )
}