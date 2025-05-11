"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/60 backdrop-blur-lg shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-4 md:px-16 lg:px-24 xl:px-36">

        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-200 rounded-full opacity-30 group-hover:opacity-100 blur-sm transition-all duration-500" />
            <div className="relative bg-black rounded-full p-1.5">
              <Image src="/logo.svg" alt="Logo" width={30} height={30} priority />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            Flick
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">
              AI
            </span>
            <Sparkles className="ml-1 h-4 w-4 text-gray-400" />
          </h2>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <a
              href="/sign-in"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Log in
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
