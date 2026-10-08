# ⚡ Ashok Kumar — Creative Developer & AI Portfolio

> **Awwwards-Grade Personal Portfolio Website for Ashok Kumar**  
> *Turning ideas into real digital experiences.*

An award-level, motion-driven portfolio engineered with **React 19, Vite, Tailwind CSS, GSAP, Lenis, Three.js, Matter.js, and Redux Toolkit**.

---

## 🌟 Key Highlights & Engineering Features

- **🎯 Minimal Editorial Aesthetics:** Obsidian dark default (`#0A0A0B`) with electric green (`#39E600`) aura bloom and crisp light theme. Zero fluff or filler text.
- **🪢 FeralUI PullCord Theme Switcher:** Ceiling pull-cord with simulated Verlet rope physics and smooth circular clip-path wipe revealing the opposite theme.
- **👤 2.5D WebGL Depth Hero Scene:** Cutout portrait of Ashok Kumar with interactive depth-map parallax, cursor-proximity glitch displacement, and subtle aura backglow.
- **🃏 Dual Project Presentation Modes:**
  - **Stack Mode:** Smooth scroll-stacked deck where cards pile, scale down (`scale(0.92)`), and fade with depth.
  - **Horizontal Mode:** Pinned horizontal scroll mapped to vertical travel with velocity-based image skew.
  - **Fluid Flip Transitions:** Seamless layout morphing between modes using GSAP Flip.
- **⚛️ Matter.js Rigid-Body Tech Physics:** Fullscreen physics stage where tech stack badges float in zero gravity, fall upon trigger, and scatter dynamically from cursor and touch force.
- **🔤 Interactive Big Name Typography:** Giant outlined `ASHOK KUMAR` spanning container width with cursor-following fluid gradient fill and wiggle micro-interactions.
- **🕹️ Interactive Lab Showcase:** 8 experimental micro-demos (Particle Portrait, Kinetic Typography, Physics Playground, AI Node Field, Audio Visualizer, 3D Interactive, Cursor Effects, Generative Art).
- **📂 All 8 Comprehensive Projects Detailed:**
  1. **Snap2Bill** — AI Billing, Computer Vision POS & Social Commerce ([GitHub](https://github.com/ashoka-2/snap2bill))
  2. **Parsu AI** — Multi-Model Autonomous AI Workspace & Social Command Center ([Live Demo](https://parsuai.vercel.app/) • [GitHub](https://github.com/ashoka-2/FullStack))
  3. **codeSpace** — AI Cloud Sandbox & Kubernetes IDE ([GitHub](https://github.com/ashoka-2/Capstone))
  4. **ScapeGoat** — AI Multi-Category Store & Intelligent Discovery ([GitHub](https://github.com/ashoka-2/Scapegoat))
  5. **chatMe** — Real-Time WebSocket Messenger & Social Hub ([GitHub](https://github.com/ashoka-2/FullStack))
  6. **Moodify** — Music Visualization & Mood-Based Audio Recommendations ([GitHub](https://github.com/ashoka-2/FullStack))
  7. **BattleArena** — AI-vs-AI Algorithmic Evaluation & Reasoning Arena ([GitHub](https://github.com/ashoka-2/FullStack))
  8. **MoviePlatform** — Streaming Discovery, Cinema Search & Personalized Feeds ([GitHub](https://github.com/ashoka-2/FullStack))

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | React 19, Vite 8, React Router v7 |
| **Styling & System** | Tailwind CSS v4, Custom CSS Tokens, Continuous Squircles, SVG Gooey Filter |
| **Motion & Scroll** | GSAP 3 (ScrollTrigger, Flip, SplitText, ScrambleText, Observer, Draggable), Lenis |
| **3D & Canvas** | Three.js, WebGL custom shaders, HTML5 Canvas 2D |
| **Physics Simulation**| Matter.js (Rigid-body collisions, gravity, cursor impulse) |
| **State Management** | Redux Toolkit (Theme, Menu, Cursor, View Modes) |
| **Icons & Fonts** | Iconify (`logos`, `simple-icons`), Lucide, JetBrains Mono, Bricolage Grotesque, Instrument Serif |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `20.x` or higher
- npm

### Installation & Launch

```bash
# Clone or navigate to the portfolio directory
cd d:/ASHOK

# Install dependencies (if not already installed)
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎨 Single-Source-of-Truth Content Management

All site data is decoupled from the UI layer and managed in `src/data/`:
- `src/data/profile.js` — Personal identity, roles, education, statement, workflow loop, contact.
- `src/data/projects.js` — Comprehensive specs, tech stacks, links, and galleries for all 8 projects.
- `src/data/tech.js` — Categorized technology badges and Iconify mappings.
- `src/data/lab.js` — Interactive laboratory experiments and code snippets.
- `src/data/site.js` — Navigation items, routes, social links, and SEO configuration.

---

<div align="center">
  <sub>Designed & Developed with precision for Ashok Kumar.</sub>
</div>
