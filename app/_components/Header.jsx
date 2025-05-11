"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Detect scroll to add glass effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-black/60 backdrop-blur-lg shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="p-4 flex justify-between items-center md:px-16 lg:px-24 xl:px-36 px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Logo area with animated border */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-200 rounded-full opacity-30 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
            <div className="relative bg-black rounded-full p-1.5">
              <Image 
                src="/logo.svg" 
                alt="Logo" 
                width={30} 
                height={30} 
                priority 
                className="relative"
              />
            </div>
          </div>
          
          {/* Brand name with sparkle effect */}
          <div className="relative">
            <h2 className="text-2xl font-bold text-white flex items-center">
              Flick<span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">AI</span>
              <Sparkles className="ml-1 h-4 w-4 text-gray-400" />
            </h2>
          </div>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</a>
            
            <Button 
              className="relative group overflow-hidden bg-white text-black hover:bg-gray-200 border-0 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10 flex items-center text-sm">
                Get Started
              </span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </Button>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-gray-800">
          <nav className="px-4 py-6 flex flex-col gap-6">
            
            
            <div className="flex flex-col gap-4">
              <a href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</a>
              
              <Button 
                className="relative group overflow-hidden bg-white text-black hover:bg-gray-200 border-0 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center text-sm">
                  Get Started
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;