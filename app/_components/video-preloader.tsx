"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

interface VideoPreloaderProps {
  progress: number;
  isComplete: boolean;
  onAnimationComplete: () => void;
}

interface LogoData {
  _id: string;
  logoImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  altText: string;
  fallbackText: string;
}

export default function VideoPreloader({
  progress,
  isComplete,
  onAnimationComplete,
}: VideoPreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Animate progress number
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        textContent: Math.round(progress),
        duration: 0.5,
        ease: "power2.out",
        snap: { textContent: 1 },
      });
    }
  }, [progress]);

  useEffect(() => {
    if (isComplete && preloaderRef.current) {
      // Reveal animation - slide up and off screen
      const tl = gsap.timeline({
        onComplete: onAnimationComplete,
      });

      tl.to(preloaderRef.current, {
        y: "-100%",
        duration: 1.2,
        ease: "power2.inOut",
      });
    }
  }, [isComplete, onAnimationComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <div className="text-center">
        {/* Logo - bigger than the loader */}
        <div className="mb-16 flex justify-center">
          <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={256}
              height={256}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Loading percentage */}
        <div className="mb-8">
          <span
            ref={progressRef}
            className="font-fjalla-one text-5xl md:text-6xl text-white"
          >
            0
          </span>
          <span className="font-fjalla-one text-5xl md:text-6xl text-white">
            %
          </span>
        </div>

        {/* Loading text */}
        <div className="font-libre-baskerville text-sm md:text-base text-white/60 tracking-wider uppercase">
          Loading Showreel
        </div>

        {/* Progress bar (optional visual indicator) */}
        <div className="mt-8 w-64 h-px bg-white/20 mx-auto">
          <div
            className="h-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
