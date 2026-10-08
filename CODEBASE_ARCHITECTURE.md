# Codebase Architecture — Ashok Kumar Portfolio

## High-Level Architectural Overview

The portfolio is engineered as an award-level creative developer showcase adhering to modern Awwwards / Site of the Day standards.

```
d:/ASHOK/
├── docs/
│   ├── PLAN.md                 # Architecture, tokens, animation & asset map
│   ├── REFERENCE_NOTES.md      # Awwwards & FeralUI reverse-engineering notes
│   ├── ASSETS.md               # Asset pipeline, hero kit & mockups map
│   └── CONTENT_GUIDE.md        # Single-source data documentation
├── public/
│   ├── favicon.svg             # Minimalist AK brand icon
│   ├── models/
│   │   └── ashok.glb           # Single canonical 3D avatar GLB model (8 MB)
│   ├── assets/
│   │   ├── portrait/           # Cutout fallback & branding assets
│   │   └── branding/           # Vector ashok-logo.svg & ashok-logo.png
│   └── images/
│       ├── projects/           # 16 tailored dark/light mockups
│       └── lab/                # 8 interactive lab preview covers
├── src/
│   ├── features/
│   │   └── avatar/             # 3D Avatar System (One model, one system)
│   │       ├── AvatarCanvas.jsx # WebGL canvas wrapper with #av
│   │       ├── AvatarScene.js  # Three.js r186 scene, studio lighting, materials, viewport buffer sync, scroll director
│   │       ├── avatarConfig.js # Mathematical shot calibrations, poses, emotes, and tuning
│   │       ├── rig.js          # Procedural bone hierarchy, A-pose, breathing, scroll lean, gaze tracking
│   │       └── interactions.js # Face click (angry), body click (wave), double-click (wink), UI hover gaze
│   ├── components/
│   │   ├── ui/                 # Button, Tag, GlowKey, SectionLabel, Divider, GithubIcon
│   │   ├── layout/             # Navbar (with IST clock), MenuOverlay (fullscreen), Footer, PageShell
│   │   ├── effects/            # PullCord, PageTransition, Cursor, Grain, GooeyFilter, Preloader
│   │   ├── hero/               # HeroAvatar (300vh runway + fallback portrait)
│   │   ├── sections/           # Hero, Intro, ProjectsSection, LabSection, TechPhysics (Matter.js), BigName
│   │   └── projects/           # ProjectCard, ProjectStack, ProjectHorizontal
│   ├── data/
│   │   ├── profile.js          # Biography, statements, education, workflow loop, contact
│   │   ├── projects.js         # Full technical specifications for all 8 projects
│   │   ├── tech.js             # Categorized tech badges with Iconify identifiers
│   │   ├── lab.js              # 8 interactive experimental prototypes
│   │   └── site.js             # Site navigation, routes, and feature flags
│   ├── hooks/
│   │   ├── useTheme.js         # Redux-backed theme switcher
│   │   ├── useLenis.js         # Smooth scroll integration
│   │   ├── useMouse.js         # Normalized cursor coordinate tracker
│   │   └── useMediaQuery.js    # Breakpoints & touch environment detection
│   ├── lib/
│   │   ├── gsap.js             # GSAP plugin registration
│   │   ├── lenis.js            # Smooth scroll instance controller
│   │   ├── easings.js          # Kinetic animation curves
│   │   └── utils.js            # Formatting, classnames, IST time calculator
│   ├── pages/
│   │   ├── Home.jsx            # Multi-section narrative experience
│   │   ├── Projects.jsx        # Category-filtered project archive
│   │   ├── ProjectDetail.jsx   # Dedicated deep dive for all 8 projects
│   │   ├── Lab.jsx             # Interactive sandbox stage with modal launcher
│   │   ├── About.jsx           # Philosophical lifecycle, education, skills
│   │   ├── Contact.jsx         # 1-click clipboard email & dispatch form
│   │   └── NotFound.jsx        # 404 navigation recovery
│   ├── store/
│   │   ├── index.js            # Redux store configuration
│   │   └── uiSlice.js          # Global UI state (theme, menu, view mode, cursor)
│   ├── styles/
│   │   └── index.css           # CSS variables, squircle radii, Tailwind v4 theme mapping
│   ├── App.jsx                 # Router & Redux Provider root
│   ├── main.jsx                # DOM mounting entrypoint
│   └── routes.jsx              # Route table
├── README.md                   # Project overview & running instructions
└── package.json
```
