import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMenuOpen } from "../../store/uiSlice";
import { siteConfig } from "../../data/site";
import { profile } from "../../data/profile";
import { GlowKey } from "../ui/GlowKey";
import { gsap } from "../../lib/gsap";
import { stopLenis, startLenis } from "../../lib/lenis";

export function MenuOverlay() {
  const dispatch = useDispatch();
  const location = useLocation();
  const menuOpen = useSelector((state) => state.ui.menuOpen);
  const overlayRef = useRef(null);
  const linksContainerRef = useRef(null);

  // Pause smooth scroll when menu is active
  useEffect(() => {
    if (menuOpen) {
      stopLenis();
      document.body.style.overflow = "hidden";
    } else {
      startLenis();
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && menuOpen) {
        dispatch(setMenuOpen(false));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, dispatch]);

  // Animate menu open and close
  useEffect(() => {
    if (!overlayRef.current) return;

    if (menuOpen) {
      gsap.to(overlayRef.current, {
        clipPath: "circle(150% at calc(100% - 50px) 45px)",
        duration: 0.75,
        ease: "power4.inOut",
      });

      if (linksContainerRef.current) {
        gsap.fromTo(
          linksContainerRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            delay: 0.25,
            ease: "power3.out",
          },
        );
      }
    } else {
      gsap.to(overlayRef.current, {
        clipPath: "circle(0% at calc(100% - 50px) 45px)",
        duration: 0.6,
        ease: "power4.inOut",
      });
    }
  }, [menuOpen]);

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-45 bg-bg/95 backdrop-blur-2xl flex flex-col justify-between p-8 sm:p-16 md:p-24 transition-opacity ${
        menuOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      style={{ clipPath: "circle(0% at calc(100% - 50px) 45px)" }}
    >
      {/* Top Header Information */}
      <div className="flex items-center justify-between border-b border-line pb-6">
        <div className="font-mono text-xs uppercase tracking-widest text-fg-muted">
          NAVIGATION MENU
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-fg-muted">
          <span>PRESS</span>
          <GlowKey onClick={() => dispatch(setMenuOpen(false))}>ESC</GlowKey>
          <span>TO CLOSE</span>
        </div>
      </div>

      {/* Main Big Links */}
      <nav
        ref={linksContainerRef}
        className="flex flex-col gap-4 sm:gap-6 my-auto"
      >
        {siteConfig.navLinks.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => dispatch(setMenuOpen(false))}
              className="group flex items-baseline gap-4 sm:gap-8 font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-fg transition-all duration-300 hover:text-accent hover:translate-x-4"
            >
              <span className="font-mono text-xs sm:text-sm font-normal text-fg-dim tracking-widest group-hover:text-accent">
                {item.index}
              </span>
              <span
                className={
                  isActive ? "text-accent underline underline-offset-8" : ""
                }
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-line text-xs font-mono text-fg-muted">
        <div>
          <span className="text-fg-dim block mb-1">DIRECT INQUIRIES</span>
          <a
            href={`mailto:${profile.contact.email}`}
            className="text-fg hover:text-accent transition-colors"
          >
            {profile.contact.email}
          </a>
        </div>
        <div>
          <span className="text-fg-dim block mb-1">
            SOURCE CODE & REPOSITORIES
          </span>
          <a
            href={profile.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg hover:text-accent transition-colors"
          >
            github.com/{profile.contact.githubUsername}
          </a>
        </div>
        <div className="md:text-right">
          <span className="text-fg-dim block mb-1">LOCATION</span>
          <span className="text-fg">{profile.location}</span>
        </div>
      </div>
    </div>
  );
}
