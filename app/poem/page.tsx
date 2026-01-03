"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { allPoemsQuery } from "@/sanity/lib/queries";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import BackButton from "@/app/_components/BackButton";

interface Poem {
  _id: string;
  title: string;
  photo?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

async function getAllPoems(): Promise<Poem[]> {
  try {
    const data = await client.fetch(allPoemsQuery);
    return data;
  } catch (error) {
    console.error("Error fetching poems:", error);
    return [];
  }
}

export default function PoemPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPoems() {
      const data = await getAllPoems();
      setPoems(data);
      setLoading(false);
    }
    fetchPoems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Loading Poems...</h1>
        </div>
      </div>
    );
  }

  if (poems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">No Poems Found</h1>
          <p className="text-gray-400">Please add some poems in Sanity CMS</p>
        </div>
      </div>
    );
  }

  // Transform poems data to match StickyScroll content format
  const stickyScrollContent = poems.map((poem) => ({
    title: poem.title,
    description: (
      <div className="text-gray-300 leading-relaxed text-center">
        <PortableText
          value={poem.content}
          components={{
            block: {
              normal: ({ children }) => (
                <div className="mb-4 leading-relaxed text-base">{children}</div>
              ),
            },
            marks: {
              strong: ({ children }) => (
                <strong className="font-bold text-white">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-200">{children}</em>
              ),
            },
          }}
        />
      </div>
    ),
    content: (
      <div className="flex h-full w-full">
        {poem.photo ? (
          <div className="relative w-full h-full">
            <Image
              src={poem.photo.asset.url}
              alt={poem.photo.alt || poem.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Overlay with poem title - only on desktop */}
            <div className="hidden lg:flex absolute inset-0 bg-black/50 items-center justify-center p-4 md:p-8">
              <div className="text-center text-white">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  {poem.title}
                </h3>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black text-white">
            <div className="text-center p-4 md:p-8 max-w-lg mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-10 md:mb-6">
                {poem.title}
              </h3>
              <div className="text-gray-300 leading-relaxed text-center">
                <PortableText
                  value={poem.content}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <div className="mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                          {children}
                        </div>
                      ),
                    },
                    marks: {
                      strong: ({ children }) => (
                        <strong className="font-bold text-white">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-200">{children}</em>
                      ),
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <div className="min-h-screen bg-black pt-20 md:pt-24">
      {/* Back Button */}
      <BackButton href="/" />

      {/* Header */}
      <div className="text-center py-12 md:py-20 px-6">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-wider">
          POETRY
        </h1>
        <p className="text-gray-400 text-base md:text-lg">
          A collection of poems and thoughts
        </p>
      </div>

      {/* Sticky Scroll Component */}
      <div className="w-full">
        <StickyScroll content={stickyScrollContent} />
      </div>
    </div>
  );
}
