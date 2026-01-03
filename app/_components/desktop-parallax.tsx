"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { allPhotosQuery } from "@/sanity/lib/queries";

interface Photo {
  asset: {
    _id: string;
    url: string;
  };
  alt?: string;
}

interface Category {
  photos: Photo[];
}

const DesktopParallaxClient = ({ photos }: { photos: Photo[] }) => {
  // Take first 15 photos and split into 3 rows of 5
  const firstRow = photos.slice(0, 5);
  const secondRow = photos.slice(5, 10);
  const thirdRow = photos.slice(10, 15);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 30%", "end start"],
  });

  const springConfig = { stiffness: 150, damping: 30, bounce: 10 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig,
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig,
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig,
  );

  return (
    <div
      ref={ref}
      className="h-[120vh] xl:h-[160vh]  overflow-hidden antialiased relative flex flex-col self-auto [perspective:2000px] [transform-style:preserve-3d] bg-black -mt-96 -z-10"
    >
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        {/* First Row - Always visible */}
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
          {firstRow.map((photo, idx) => (
            <PhotoCard
              photo={photo}
              translate={translateX}
              key={`${photo.asset._id}-${idx}`}
            />
          ))}
        </motion.div>

        {/* Second Row - Always visible */}
        <motion.div className="flex flex-row mb-2 sm:mb-3 md:mb-4 lg:mb-6 space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
          {secondRow.map((photo, idx) => (
            <PhotoCard
              photo={photo}
              translate={translateXReverse}
              key={`${photo.asset._id}-${idx}`}
            />
          ))}
        </motion.div>

        {/* Third Row - Only visible on full desktop (xl and above) */}
        <motion.div className="hidden xl:flex flex-row-reverse space-x-reverse space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
          {thirdRow.map((photo, idx) => (
            <PhotoCard
              photo={photo}
              translate={translateX}
              key={`${photo.asset._id}-${idx}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const PhotoCard = ({
  photo,
  translate,
}: {
  photo: Photo;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={photo.asset._id}
      className="group/photo h-32 w-48 sm:h-40 sm:w-64 md:h-48 md:w-80 lg:h-56 lg:w-96 xl:h-64 xl:w-[30rem] relative shrink-0"
    >
      <div className="block group-hover/photo:shadow-2xl cursor-default">
        <Image
          src={photo.asset.url}
          height={600}
          width={600}
          className="object-cover object-center absolute h-full w-full inset-0 rounded-lg"
          alt={photo.alt || "Photography"}
        />
      </div>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/photo:opacity-60 bg-black pointer-events-none rounded-lg transition-opacity duration-300"></div>
    </motion.div>
  );
};

export default function DesktopParallax() {
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function getAllPhotos() {
      try {
        const categories: Category[] = await client.fetch(allPhotosQuery);
        const allPhotos = categories.flatMap(
          (category) => category.photos || [],
        );
        setPhotos(allPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    }

    getAllPhotos();
  }, []);

  if (loading || photos.length === 0) {
    return null;
  }

  return <DesktopParallaxClient photos={photos} />;
}
