import React from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';
import { siteConfig } from '../../data/site';
import { scrollTo } from '../../lib/lenis';
import { ArrowUp, Mail } from 'lucide-react';
import { GithubIcon } from '../ui/GithubIcon';
import { GlowKey } from '../ui/GlowKey';

export function Footer() {
  const handleScrollTop = () => {
    scrollTo(0, { duration: 1.5 });
  };

  return (
    <footer className="w-full bg-bg-surface border-t border-line mt-24 py-16 sm:py-24 px-6 sm:px-12 md:px-20 text-fg select-none">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16">
        {/* Top: Large Call to Action Statement & Big Mailto Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-line">
          <div>
            <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-3">
              HAVE AN IDEA OR VISION?
            </span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-fg">
              Let's create something memorable.
            </h2>
          </div>
          <div>
            <a
              href={`mailto:${profile.contact.email}`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-accent-on font-display font-semibold text-lg hover:shadow-[0_0_30px_rgba(57,230,0,0.5)] transition-all duration-300 hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              <span>{profile.contact.email}</span>
            </a>
          </div>
        </div>

        {/* Middle Navigation & Info Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs">
          <div>
            <span className="text-fg-dim block mb-3 uppercase tracking-wider">PAGES</span>
            <ul className="flex flex-col gap-2">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-fg-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-fg-dim block mb-3 uppercase tracking-wider">PROJECTS</span>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/projects/snap2bill" className="text-fg-muted hover:text-accent transition-colors">
                  Snap2Bill
                </Link>
              </li>
              <li>
                <Link to="/projects/parsu" className="text-fg-muted hover:text-accent transition-colors">
                  Parsu AI
                </Link>
              </li>
              <li>
                <Link to="/projects/codespace" className="text-fg-muted hover:text-accent transition-colors">
                  codeSpace
                </Link>
              </li>
              <li>
                <Link to="/projects/scapegoat" className="text-fg-muted hover:text-accent transition-colors">
                  ScapeGoat
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-fg-dim block mb-3 uppercase tracking-wider">CONNECT</span>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  GitHub ({profile.contact.githubUsername})
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="text-fg-muted hover:text-accent transition-colors"
                >
                  Email ({profile.contact.email})
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-between items-start md:items-end">
            <div>
              <span className="text-fg-dim block mb-1 uppercase tracking-wider">BASE</span>
              <span className="text-fg font-medium">{profile.location}</span>
            </div>
            <button
              onClick={handleScrollTop}
              aria-label="Scroll back to top"
              className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full border border-line text-fg-muted hover:text-accent hover:border-accent transition-all group"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-1" />
            </button>
          </div>
        </div>

        {/* Bottom Baseline */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-line text-[11px] font-mono text-fg-dim">
          <div>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>PRESS</span>
            <GlowKey>ESC</GlowKey>
            <span>FOR FULLSCREEN MENU</span>
          </div>
          <div>
            BUILT WITH REACT 19 & GSAP
          </div>
        </div>
      </div>
    </footer>
  );
}
