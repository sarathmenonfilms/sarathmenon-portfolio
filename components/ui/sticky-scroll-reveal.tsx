"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string | React.ReactNode;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Use Intersection Observer instead of scroll events for better custom scroll compatibility
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((item, index) => {
      if (item) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveCard(index);
              }
            });
          },
          {
            root: null, // Use viewport as root
            rootMargin: "-50% 0px -50% 0px", // Trigger when item is in center of viewport
            threshold: 0,
          },
        );

        observer.observe(item);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [content.length]);

  const backgroundColors = [
    "#000000", // black
    "#111111", // very dark gray
    "#1a1a1a", // dark gray
  ];

  const linearGradients = useMemo(
    () => [
      "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan to emerald
      "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink to indigo
      "linear-gradient(to bottom right, #f97316, #eab308)", // orange to yellow
    ],
    [],
  );

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard, linearGradients]);

  return (
    <div className="relative">
      <motion.div
        animate={{
          backgroundColor:
            backgroundColors[activeCard % backgroundColors.length],
        }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex justify-center relative lg:space-x-10 p-4 lg:p-10"
        ref={containerRef}
      >
        {/* Left side - Scrollable content - Hidden on mobile */}
        <div className="hidden lg:flex relative items-start justify-center px-4 w-1/2">
          <div className="max-w-2xl w-full">
            {content.map((item, index) => (
              <div
                key={item.title + index}
                className="min-h-screen flex flex-col justify-center py-20"
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
              >
                <motion.h2
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                    scale: activeCard === index ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl lg:text-5xl font-bold text-white mb-8 text-center"
                >
                  {item.title}
                </motion.h2>
                <motion.div
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-xl lg:text-2xl text-gray-300 leading-relaxed text-center"
                >
                  {item.description}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Sticky content */}
        <div className="hidden lg:block w-1/2 relative">
          <div className="sticky top-20 h-[70vh]">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ background: backgroundGradient }}
              className={cn(
                "h-full w-full rounded-xl overflow-hidden shadow-2xl",
                contentClassName,
              )}
            >
              {content[activeCard]?.content ?? null}
            </motion.div>
          </div>
        </div>

        {/* Mobile content - Simple vertical layout */}
        <div className="lg:hidden w-full">
          <div className="space-y-20">
            {content.map((item, index) => (
              <div key={item.title + index} className="w-full">
                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                  {item.title}
                </h2>

                {/* Image/Content - No overlay */}
                {item.content && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      "h-64 w-full rounded-xl overflow-hidden shadow-2xl mb-10",
                      contentClassName,
                    )}
                  >
                    {item.content}
                  </motion.div>
                )}

                {/* Poem Content */}
                <div className="text-base text-gray-300 leading-relaxed text-center px-4 mb-8">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
