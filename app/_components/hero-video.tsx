"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import VideoPreloader from "./video-preloader";
import { HeroVideoData } from "../lib/sanity-queries";
import { Volume2, VolumeX } from "lucide-react";

interface HeroVideoProps {
  videoData: HeroVideoData;
}

export default function HeroVideo({ videoData }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(videoData.muted);

  // Cache video using localStorage key
  const getCacheKey = useCallback(() => {
    return `hero-video-${videoData.video?.asset?._id || "default"}`;
  }, [videoData.video?.asset?._id]);

  // Check if video is cached
  const isVideoCached = useCallback(() => {
    try {
      const cacheKey = getCacheKey();
      return localStorage.getItem(cacheKey) === "cached";
    } catch {
      return false;
    }
  }, [getCacheKey]);

  // Mark video as cached
  const markVideoCached = useCallback(() => {
    try {
      const cacheKey = getCacheKey();
      localStorage.setItem(cacheKey, "cached");
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [getCacheKey]);

  // Handle video loading progress
  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const buffered = video.buffered;
      if (buffered.length > 0 && video.duration) {
        const loadedPercentage = Math.min(
          (buffered.end(buffered.length - 1) / video.duration) * 100,
          100,
        );
        setLoadingProgress(loadedPercentage);

        // If nearly fully loaded, consider it complete
        if (loadedPercentage >= 95) {
          setIsVideoLoaded(true);
          markVideoCached();
        }
      }
    } catch (error) {
      console.warn("Error calculating video progress:", error);
    }
  }, [markVideoCached]);

  // Handle video ready to play
  const handleCanPlay = useCallback(() => {
    setIsVideoLoaded(true);
    setLoadingProgress(100);
    markVideoCached();
  }, [markVideoCached]);

  // Handle video errors
  const handleVideoError = useCallback(() => {
    console.error("Video failed to load");
    setVideoError(true);
    setShowPreloader(false);
  }, []);

  // Handle preloader animation complete
  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);

    // Animate video in
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 1.05 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        },
      );
    }

    // Start video playback
    const video = videoRef.current;
    if (video && videoData.autoplay) {
      video.play().catch(console.warn);
    }
  }, [videoData.autoplay]);

  // Setup video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoData.video?.asset?.url) return;

    // If video is cached, skip detailed progress tracking
    if (isVideoCached()) {
      setLoadingProgress(100);
      setIsVideoLoaded(true);
      return;
    }

    // Add event listeners
    video.addEventListener("progress", handleProgress);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("canplaythrough", handleCanPlay);
    video.addEventListener("error", handleVideoError);

    // Preload the video
    video.load();

    return () => {
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("canplaythrough", handleCanPlay);
      video.removeEventListener("error", handleVideoError);
    };
  }, [
    videoData.video?.asset?.url,
    isVideoCached,
    handleProgress,
    handleCanPlay,
    handleVideoError,
  ]);

  // Handle video not available
  if (!videoData.video?.asset?.url) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-fjalla-one text-2xl mb-4">Video not available</h2>
          <p className="font-libre-baskerville text-foreground/60">
            Please upload a hero video in the CMS.
          </p>
        </div>
      </div>
    );
  }

  // Handle video error - show poster image if available
  if (videoError) {
    if (videoData.poster?.asset?.url) {
      return (
        <div className="relative h-screen w-full overflow-hidden">
          <Image
            src={videoData.poster.asset.url}
            alt={videoData.title || "Showreel poster"}
            fill
            className="object-cover"
          />

          {/* Optional overlay */}
          <div className="absolute inset-0 bg-black/10 z-10" />

          {/* Optional title overlay */}
          {videoData.title && (
            <div className="absolute bottom-8 left-8 z-20">
              <h1 className="font-fjalla-one text-white text-4xl md:text-6xl">
                {videoData.title}
              </h1>
            </div>
          )}
        </div>
      );
    }

    // Fallback if no poster image
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-fjalla-one text-2xl mb-4">
            Unable to load video
          </h2>
          <p className="font-libre-baskerville text-foreground/60">
            There was an error loading the showreel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Video Preloader */}
      {showPreloader && (
        <VideoPreloader
          progress={loadingProgress}
          isComplete={isVideoLoaded}
          onAnimationComplete={handlePreloaderComplete}
        />
      )}

      {/* Hero Video */}
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden opacity-0"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster={videoData.poster?.asset?.url}
          autoPlay={videoData.autoplay}
          loop={videoData.loop}
          muted={isMuted}
          playsInline
          preload="auto"
        >
          <source
            src={videoData.video.asset.url}
            type={videoData.video.asset.mimeType || "video/mp4"}
          />
          Your browser does not support the video tag.
        </video>

        {/* Optional overlay for future content */}
        <div className="absolute inset-0 bg-black/10 z-10" />

        <button
          type="button"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="sm:w-16 sm:h-16 w-12 h-12 absolute bottom-8 right-8 z-20 cursor-pointer flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border-none shadow-lg transition hover:bg-white/30"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="text-white" />
          ) : (
            <Volume2 className="text-white" />
          )}
        </button>
      </div>
    </>
  );
}
