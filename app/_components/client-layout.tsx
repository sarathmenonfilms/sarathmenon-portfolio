"use client";

import type { LenisOptions } from "lenis";
import { ReactLenis } from "lenis/react";
import { useMedia } from "react-use";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMedia("(max-width: 768px)", false);

  const scrollSettings: LenisOptions = isMobile
    ? {
        duration: 1,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
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
        orientation: "vertical",
        gestureOrientation: "vertical",
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: true,
      };

  return (
    <ReactLenis root options={scrollSettings}>
      {/* <Navbar /> */}
      {children}
    </ReactLenis>
  );
};

export default ClientLayout;
