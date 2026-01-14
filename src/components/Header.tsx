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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'bg-transparent py-6'
      }`}
      style={{
        borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none',
      }}
    >
      <div className="container flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
            <Image 
              src="/logo.jpg" 
              alt="Etheleen & Alma's Dream Logo" 
              fill
              className="object-cover"
            />
          </div>
          <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-primary' : 'text-primary'}`}>
            Etheleen & Alma's <span className="italic text-accent">Dream</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-semibold uppercase tracking-wider hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/admin" className="text-xs text-primary/60 hover:text-primary transition-colors">
            Admin
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Mail size={16} />
            Book Now
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
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
