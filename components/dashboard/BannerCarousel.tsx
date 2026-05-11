"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  "/assets/banner/banner1.jpg",
  "/assets/banner/banner2.jpg",
  "/assets/banner/banner3.jpg",
  "/assets/banner/banner4.jpg",
  "/assets/banner/banner5.jpg",
  "/assets/banner/banner6.jpg",
  "/assets/banner/banner7.jpg",
  "/assets/banner/banner8.jpg",
  "/assets/banner/banner9.jpg",
];

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-[21/9] overflow-hidden rounded-3xl border border-border bg-secondary">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={banners[currentIndex]}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          alt={`Banner ${currentIndex + 1}`}
        />
      </AnimatePresence>
      
      {/* Indicator dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {banners.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
