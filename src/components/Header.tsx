'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail } from 'lucide-react';

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
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="relative w-12 h-12 md:w-14 md:h-14">
            <Image
              src="/logo.png"
              alt="Etheleen & Alma's Dream Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xl font-bold font-serif leading-none tracking-tight text-primary">
              Etheleen &amp; Alma&apos;s
            </span>
            <span className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
              Dream, LLC
            </span>
          </div>
        </Link>

        {/* 2. Navigation (Center - Absolute centered) */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-bold uppercase tracking-[0.15em] text-foreground/80 hover:text-primary transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* 3. CTA & Mobile Toggle (Right) */}
        <div className="flex items-center gap-4 relative z-10">
          <Link href="/admin" className="hidden lg:block text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors mr-2">
            Admin
          </Link>
          <Link href="#quote" className="hidden md:flex btn-primary items-center gap-2 text-xs font-bold px-6 py-3">
            <Mail size={14} />
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
              <Link
                href="/admin"
                className="text-sm font-medium text-primary/70"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Access
              </Link>
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
