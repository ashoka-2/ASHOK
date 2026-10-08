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
│   ├── assets/
│   │   ├── portrait/           # Single source of truth: main cutout, developer morph, depth, displacement, interaction, aura
│   │   └── branding/           # Vector ashok-logo.svg & ashok-logo.png
│   └── images/
│       ├── projects/           # 16 tailored dark/light mockups
│       └── lab/                # 8 interactive lab preview covers
├── src/
│   ├── components/
│   │   ├── ui/                 # Button, Tag, GlowKey, SectionLabel, Divider, GithubIcon
│   │   ├── layout/             # Navbar (with IST clock), MenuOverlay (fullscreen), Footer, PageShell
│   │   ├── effects/            # PullCord (blurred wave theme switch), PageTransition, Cursor, Grain, GooeyFilter, Preloader
│   │   ├── three/              # HeroDepthScene (WebGL fragment shader 2.5D depth + glitch developer morph)
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
