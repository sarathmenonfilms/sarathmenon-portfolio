"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useWindowSize } from "rooks";
import Logo from "./Logo";
import Button from "./Button";
import NavLinks from "./NavLinks";

const Header = () => {
  const { innerWidth: inner } = useWindowSize();
  const [isClient, setIsClient] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [initialStyles, setInitialStyles] = useState({
    width: inner && inner > 425 ? 50 : 40,
    height: inner && inner > 425 ? 50 : 40,
    top: "0px",
    right: "0px",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (inner) {
      setInitialStyles({
        width: inner > 425 ? 50 : 40,
        height: inner > 425 ? 50 : 40,
        top: "0px",
        right: "0px",
      });
    }
  }, [inner]);

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        // At top of page, always show navbar
        setShowNavbar(true);
      } else {
        // Check scroll direction
        if (currentScrollY < lastScrollY) {
          // Scrolling up - show navbar
          setShowNavbar(true);
        } else if (currentScrollY > lastScrollY) {
          // Scrolling down - hide navbar
          setShowNavbar(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const menuVariants = {
    open: {
      width: inner && inner > 768 ? 480 : 250,
      height: inner && inner > 768 ? 370 : 270,
      top: inner && inner > 768 ? "-10px" : "-5px",
      right: inner && inner > 768 ? "-10px" : "-5px",
      transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as const },
    },
    closed: initialStyles,
  };

  const headerVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <>
      {isClient && (
        <>
          <motion.header
            className="h-[calc(40px+2.4rem)] md:h-[calc(40px+2.4rem)] sm:h-[calc(40px+1.8rem)] xs:h-[calc(40px+1.2rem)] w-full px-7 md:px-14 sm:px-10 xs:px-7 flex items-center justify-between fixed top-0 z-20 bg-black/80 backdrop-blur-sm font-bold text-white"
            variants={headerVariants}
            animate={showNavbar ? "visible" : "hidden"}
            initial="visible"
          >
            <Link href={"/"}>
              <div className="w-24 h-20 md:w-24 md:h-20 sm:w-20 sm:h-14">
                <Logo />
              </div>
            </Link>

            <Link href={"/"}>
              <div className="flex flex-col justify-center items-center gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-lg md:text-xl sm:text-base xs:text-sm font-bold whitespace-nowrap">
                  SARATH MENON
                </div>
                <div className="text-sm md:text-base sm:text-xs xs:text-xs">
                  ARTIST | FILMMAKER
                </div>
              </div>
            </Link>
          </motion.header>

          <motion.div
            className="fixed top-4 right-4 md:top-4 md:right-4 sm:top-4 sm:right-5 z-20"
            variants={headerVariants}
            animate={showNavbar ? "visible" : "hidden"}
            initial="visible"
          >
            <motion.div
              style={initialStyles}
              variants={menuVariants}
              animate={isActive ? "open" : "closed"}
              className="relative bg-white rounded-2xl flex justify-center items-center"
              initial="closed"
            >
              <AnimatePresence>
                {isActive && <NavLinks setIsActive={setIsActive} />}
              </AnimatePresence>
            </motion.div>
            <Button setIsActive={setIsActive} isActive={isActive} />
          </motion.div>
        </>
      )}
    </>
  );
};

export default Header;
