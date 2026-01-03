"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useMedia } from "react-use";

interface Photo {
  asset: {
    _id: string;
    url: string;
  };
  alt?: string;
}

const InfiniteMovingImages = ({
  items,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  items: Photo[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  const getDirection = useCallback(() => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  }, [direction]);

  const getSpeed = useCallback(() => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "220s");
      }
    }
  }, [speed]);

  const addAnimation = useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }, [getDirection, getSpeed]);

  useEffect(() => {
    addAnimation();
  }, [addAnimation]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((photo, idx) => (
          <li
            className="relative sm:w-[300px] w-[200px] h-[150px] shrink-0 rounded-2xl overflow-hidden border border-slate-700"
            key={`${photo.asset._id}-${idx}`}
          >
            <Image
              src={photo.asset.url}
              alt={photo.alt || "Photography"}
              fill
              className="object-cover"
              sizes="200px"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export function MobileInfiniteScrollClient({ photos }: { photos: Photo[] }) {
  // Split photos into two arrays for the two rows
  const midpoint = Math.ceil(photos.length / 2);
  const firstRowPhotos = photos.slice(0, midpoint);
  const secondRowPhotos = photos.slice(midpoint);
  const isMobile = useMedia("(max-width: 576px)", false);

  return (
    <div className="w-full bg-black py-8">
      {/* First row - Left to Right */}
      <InfiniteMovingImages
        items={firstRowPhotos}
        direction="right"
        speed="slow"
        className="mb-4"
      />

      {/* Second row - Right to Left */}
      <InfiniteMovingImages
        items={secondRowPhotos}
        direction="left"
        speed="slow"
      />

      {!isMobile && (
        <InfiniteMovingImages
          items={firstRowPhotos}
          direction="right"
          speed="slow"
        />
      )}
    </div>
  );
}
