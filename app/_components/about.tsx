"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { aboutQuery } from "@/sanity/lib/queries";

interface AboutData {
  _id: string;
  description: string;
}

async function getAboutData(): Promise<AboutData | null> {
  try {
    const data = await client.fetch(aboutQuery);
    return data;
  } catch (error) {
    console.error("Error fetching about data:", error);
    return null;
  }
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutData() {
      const data = await getAboutData();
      setAboutData(data);
      setLoading(false);
    }
    fetchAboutData();
  }, []);

  // Helper function to truncate text to approximately 150 words while preserving paragraph structure
  const truncateText = (
    text: string,
    wordLimit: number = 150,
  ): { truncated: string; needsTruncation: boolean } => {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return { truncated: text, needsTruncation: false };
    }

    // Find a good breaking point near the word limit, preferably at paragraph end
    const breakPoint = wordLimit;
    const truncatedWords = words.slice(0, breakPoint);
    const truncatedText = truncatedWords.join(" ");

    // Try to break at a paragraph boundary if possible
    const paragraphs = text.split("\n\n");
    let wordCount = 0;
    const truncatedParagraphs = [];

    for (const paragraph of paragraphs) {
      const paragraphWords = paragraph.split(" ").length;
      if (wordCount + paragraphWords <= wordLimit) {
        truncatedParagraphs.push(paragraph);
        wordCount += paragraphWords;
      } else {
        // If adding this paragraph would exceed limit, break here
        break;
      }
    }

    // If we have complete paragraphs within limit, use those
    if (truncatedParagraphs.length > 0 && wordCount > wordLimit * 0.7) {
      return {
        truncated: truncatedParagraphs.join("\n\n") + "...",
        needsTruncation: true,
      };
    }

    // Otherwise, use word-based truncation
    return {
      truncated: truncatedText + "...",
      needsTruncation: true,
    };
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8 tracking-wider">ABOUT</h2>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-300">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  const fullText = aboutData?.description || "Content not available";
  const { truncated, needsTruncation } = truncateText(fullText);

  return (
    <section
      id="about"
      className="lg:min-h-screen bg-black text-white py-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Fixed Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-8 tracking-wider">ABOUT</h2>
        </div>

        {/* Description Box */}
        <div className="max-w-3xl mx-auto">
          <div className="text-lg text-gray-300 leading-relaxed space-y-6">
            {/* Desktop - Show full text */}
            <div className="hidden lg:block space-y-6">
              {aboutData?.description ? (
                aboutData.description.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg text-gray-300 leading-relaxed text-left"
                  >
                    {paragraph.trim()}
                  </p>
                ))
              ) : (
                <p className="text-lg text-gray-300 leading-relaxed text-left">
                  Content not available
                </p>
              )}
            </div>

            {/* Mobile - Show truncated text with read more */}
            <div className="lg:hidden">
              {aboutData?.description ? (
                <div className="space-y-6">
                  {(isExpanded ? fullText : truncated)
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-lg text-gray-300 leading-relaxed text-left"
                      >
                        {paragraph.trim()}
                      </p>
                    ))}

                  {needsTruncation && (
                    <div className="text-center">
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white transition-all duration-300 hover:scale-105"
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-lg text-gray-300 leading-relaxed text-left">
                  Content not available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
