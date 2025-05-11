"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Sparkles, Play, Zap, Film, Mic, PenTool } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationPhase, setAnimationPhase] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getParallaxStyle = (depth = 1) => {
    if (!hasMounted) return {};
    const x = (mousePosition.x / window.innerWidth - 0.5) * 20 * depth;
    const y = (mousePosition.y / window.innerHeight - 0.5) * 20 * depth;
    return { transform: `translate(${x}px, ${y}px)` };
  };

  const getRandomPosition = (index) => {
    const baseDelay = index * 2;
    const animationDuration = 20 + index * 5;
    return {
      animation: `float ${animationDuration}s ease-in-out ${baseDelay}s infinite alternate`,
    };
  };

  const floatingIcons = [
    {
      icon: <Film className="text-gray-500" size={36} />,
      style: getRandomPosition(0),
    },
    {
      icon: <Mic className="text-gray-600" size={28} />,
      style: getRandomPosition(1),
    },
    {
      icon: <PenTool className="text-gray-400" size={32} />,
      style: getRandomPosition(2),
    },
    {
      icon: <Zap className="text-gray-500" size={24} />,
      style: getRandomPosition(3),
    },
    {
      icon: <Play className="text-gray-600" size={30} />,
      style: getRandomPosition(4),
    },
    {
      icon: <Sparkles className="text-gray-400" size={26} />,
      style: getRandomPosition(5),
    },
  ];

  return (
    <>
      <div className="relative h-screen w-full overflow-hidden bg-black">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute w-full h-full bg-[radial-gradient(circle,rgba(75,75,75,0.15)_0%,rgba(0,0,0,0)_70%)]"
            style={{ ...getParallaxStyle(0.5), top: "10%", left: "30%" }}
          />
          <div
            className="absolute w-full h-full bg-[radial-gradient(circle,rgba(100,100,100,0.1)_0%,rgba(0,0,0,0)_70%)]"
            style={{ ...getParallaxStyle(0.7), top: "40%", left: "60%" }}
          />
          <div
            className="absolute w-full h-full bg-[radial-gradient(circle,rgba(50,50,50,0.1)_0%,rgba(0,0,0,0)_70%)]"
            style={{ ...getParallaxStyle(0.3), top: "70%", left: "20%" }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDQwdjQwSDB6Ii8+PHBhdGggZD0iTTQwIDBoMXYxSDB2LTFaIiBmaWxsLW9wYWNpdHk9Ii4wNSIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

        {/* Floating icons */}
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            className="absolute opacity-40"
            style={{
              top: `${10 + index * 15}%`,
              left: `${5 + index * 15}%`,
              zIndex: 5,
              ...item.style,
            }}
          >
            {item.icon}
          </div>
        ))}

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-[30px]">
          <div
            className="flex flex-col items-center justify-center gap-8 max-w-4xl"
            style={getParallaxStyle(0.2)}
          >
            <div className="px-4 py-1 mb-6 rounded-full bg-gray-900 backdrop-blur-sm border border-gray-800">
              <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-300">
                The Future of Content Creation
              </p>
            </div>

            <h1 className="font-bold text-6xl md:text-7xl text-center text-white relative">
              <span className="relative z-10 inline-block">
                AI{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-400 animate-pulse">
                  Video
                </span>{" "}
                Generator
                <Sparkles
                  className="absolute -top-8 -right-8 text-gray-500 animate-pulse"
                  size={28}
                />
              </span>
            </h1>

            <p className="mt-4 text-xl md:text-2xl text-gray-400 text-center max-w-3xl leading-relaxed">
              🎬 Create viral
              <span
                className={`font-bold mx-1 ${
                  animationPhase === 0 ? "text-white" : "text-gray-400"
                }`}
              >
                Reels
              </span>
              ,
              <span
                className={`font-bold mx-1 ${
                  animationPhase === 1 ? "text-white" : "text-gray-400"
                }`}
              >
                TikToks
              </span>{" "}
              &
              <span
                className={`font-bold mx-1 ${
                  animationPhase === 2 ? "text-white" : "text-gray-400"
                }`}
              >
                YouTube Shorts
              </span>{" "}
              in seconds! ✨{" "}
              <span
                className={`font-bold ${
                  animationPhase === 3 ? "text-white" : "text-gray-400"
                }`}
              >
                AI writes the script 📝, adds voice 🎙️, and brings your video to
                life 🎥🚀
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-10">
              <Button
                size="lg"
                variant="secondary"
                className="relative group overflow-hidden backdrop-blur-sm bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white transition-all duration-300 px-8 py-6 text-lg transform hover:-translate-y-1"
              >
                <Link href="/dashboard">
                  <span className="relative z-10 flex items-center gap-2">
                    <Film size={20} />
                    Explore
                  </span>
                </Link>
              </Button>

              <Button
                size="lg"
                className="relative group overflow-hidden bg-white text-black hover:bg-gray-200 border-0 transition-all duration-300 px-8 py-6 text-lg transform hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <Link href="/dashboard">
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap size={20} className="animate-pulse" />
                    Get Started
                  </span>
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mt-16 text-center">
              <div className="backdrop-blur-sm bg-gray-900 p-4 rounded-xl border border-gray-800">
                <p className="text-3xl font-bold text-white">10M+</p>
                <p className="text-gray-500">Videos Created</p>
              </div>
              <div className="backdrop-blur-sm bg-gray-900 p-4 rounded-xl border border-gray-800">
                <p className="text-3xl font-bold text-white">98%</p>
                <p className="text-gray-500">Satisfaction</p>
              </div>
              <div className="backdrop-blur-sm bg-gray-900 p-4 rounded-xl border border-gray-800">
                <p className="text-3xl font-bold text-white">30s</p>
                <p className="text-gray-500">Average Creation Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Float animation */}
        <style jsx>{`
          @keyframes float {
            0% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(5deg);
            }
            100% {
              transform: translateY(5px) rotate(-5deg);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Hero;
