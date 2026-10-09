import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from '../../store/uiSlice';
import { formatTimeIST } from '../../lib/utils';
import { profile } from '../../data/profile';
import { gsap } from '../../lib/gsap';

export function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const menuOpen = useSelector((state) => state.ui.menuOpen);
  const [timeStr, setTimeStr] = useState(formatTimeIST());
  const navRef = useRef(null);
  const lastScrollY = useRef(0);

  // Update live Kerala time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(formatTimeIST());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current || menuOpen) return;
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down -> hide navbar
        gsap.to(navRef.current, { y: -100, duration: 0.35, ease: 'power2.out' });
      } else {
        // Scrolling up -> show navbar
        gsap.to(navRef.current, { y: 0, duration: 0.35, ease: 'power2.out' });
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 w-full z-40 transition-all duration-300 pointer-events-auto"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-6 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2 font-display text-lg sm:text-xl font-bold tracking-tight text-fg transition-opacity hover:opacity-80"
          aria-label="Home"
        >
          <span className="w-2 h-2 rounded-full bg-accent transition-transform group-hover:scale-150" />
          <span>{profile.shortName}</span>
          <span className="hidden sm:inline-block font-mono text-xs font-normal text-fg-dim tracking-wider ml-1">
            / PORTFOLIO
          </span>
        </Link>

        {/* Center: Live Kerala IST Time (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5 font-mono text-xs text-fg-muted tracking-widest px-4 py-1.5 rounded-full bg-bg-surface/50 border border-line backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>KERALA, IN</span>
          <span className="text-fg-dim">•</span>
          <span className="text-fg font-medium">{timeStr} IST</span>
        </div>

        {/* Right: STRICT SINGLE MENU ICON ON ALL SCREEN SIZES */}
        <button
          onClick={() => dispatch(toggleMenu())}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          className="relative z-50 flex items-center justify-center w-11 h-11 rounded-full bg-bg-surface/80 border border-line backdrop-blur-md text-fg hover:border-accent hover:text-accent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="w-5 h-4 relative flex flex-col justify-between items-center">
            <span
              className={`w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${
                menuOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${
                menuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''
              }`}
            />
          </div>
        </button>
      </div>
    </header>
  );
}

