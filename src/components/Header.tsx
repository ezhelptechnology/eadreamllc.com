'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '#services' },
    { name: 'Menu', href: '#menu' },
    { name: 'AAU Prep', href: '/aau-meal-prep' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-6'
        }`}
      style={{
        borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none',
      }}
    >
      <div className="container flex items-center justify-between h-full relative">
        {/* 1. Logo Section (Left) */}
        <Link href="/" className="flex items-center gap-4 relative z-10 group">
          <div className="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-full p-2.5 shadow-xl shadow-primary/10 border border-primary/5 group-hover:scale-110 transition-transform duration-500">
            <Image
              src="/logo.png"
              alt="Etheleen & Alma's Dream Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xl xl:text-2xl font-bold font-serif leading-tight tracking-tight text-primary">
              Etheleen &amp; Alma&apos;s
            </span>
            <span className="text-xs xl:text-sm font-bold tracking-[0.3em] text-accent uppercase opacity-90">
              Dream, LLC
            </span>
          </div>
        </Link>

        {/* 2. Navigation (Center) */}
        <nav className="hidden lg:flex items-center justify-center flex-1 gap-4 xl:gap-8 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[12px] xl:text-[13px] font-bold uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-all relative group whitespace-nowrap"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* 3. Phone & CTA (Right) */}
        <div className="flex items-center gap-4 relative z-10">
          <a href="tel:6023184925" className="hidden lg:flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors">
            <Phone size={16} />
            <span>(602) 318-4925</span>
          </a>
          <Link
            href="#quote"
            className="hidden md:flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-full text-xs font-bold uppercase tracking-widest hover:shadow-2xl hover:shadow-accent/30 hover:scale-105 transition-all duration-300"
          >
            Get a Quote
          </Link>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-primary p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-glass-border overflow-hidden"
          >
            <div className="container py-8 flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-semibold uppercase tracking-widest hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="tel:6023184925"
                className="flex items-center gap-2 text-sm font-medium text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone size={16} />
                (602) 318-4925
              </a>
              <button className="btn-primary w-full max-w-xs mt-4">
                Get a Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
