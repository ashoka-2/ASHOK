export const projects = [
  {
    slug: "snap2bill",
    index: "01",
    title: "Snap2Bill",
    category: ["AI / Computer Vision", "Fintech / SaaS", "Flutter"],
    oneLiner: "AI-powered retail billing, instant product recognition from photos & social shopkeeper ecosystem.",
    overview: "Snap2Bill revolutionizes retail operations for physical shopkeepers. Combining on-device and cloud computer vision with instant POS invoicing, it enables instant item recognition directly from camera captures, automated GST calculations, inventory reconciliation, customer ledger tracking, and an Instagram-style community discovery feed for merchants.",
    role: "Lead Full Stack & Mobile Engineer",
    year: "2025 - 2026",
    status: "Completed & Active",
    features: [
      "AI camera product recognition & automatic barcode/photo classification",
      "One-click GST and non-GST compliant invoice generation with instant PDF export",
      "Instagram-style merchant product explore feed with likes, bookmarks & seller follows",
      "Real-time shopkeeper-to-customer messaging & notification infrastructure via WebSockets",
      "Full offline-first caching for seamless continuous billing during network interruptions",
      "Automated stock level depletion warnings and vendor reorder recommendations",
      "Comprehensive multi-tenant admin management portal with revenue analytics",
      "Custom machine learning dataset training workflow for new shop items"
    ],
    stack: ["Flutter", "Django", "Python", "Computer Vision", "MySQL", "SQLite", "WebSockets"],
    concepts: ["Computer Vision POS", "Real-Time Invoicing", "Retail Social Graph", "Offline Sync"],
    links: {
      github: "https://github.com/ashoka-2/snap2bill",
      live: ""
    },
    desktopImage: "/images/projects/snap2bill-desktop.svg",
    mobileImage: "/images/projects/snap2bill-mobile.svg",
    images: [
      {
        url: "/images/projects/snap2bill-desktop.svg",
        title: "Snap2Bill Retail & Wholesale Dashboard",
        caption: "Inventory reconciliation, camera item recognition stream & automated GST billing engine",
        aspect: "desktop"
      },
      {
        url: "/images/projects/snap2bill-mobile.svg",
        title: "Mobile POS Invoicing App",
        caption: "On-device camera viewfinder, barcode detection & instant WhatsApp PDF delivery",
        aspect: "mobile"
      }
    ],
    cover: {
      dark: "/images/projects/snap2bill-desktop.svg",
      light: "/images/projects/snap2bill-desktop.svg"
    },
    accent: "#10B981"
  },
  {
    slug: "parsu",
    index: "02",
    title: "Parsu AI",
    category: ["Autonomous AI Agents", "Full Stack", "Google Cloud"],
    oneLiner: "Multi-model autonomous AI workspace, live Tavily grounding & 1-click publishing across 7 social networks.",
    overview: "Parsu AI is a next-generation workspace uniting Google Gemini 3.6 Flash, Claude 3.5 Sonnet, GPT-4o, and DeepSeek R1 into a unified LangChain execution engine. Features real-time Tavily search grounding, hands-free Jarvis full-duplex voice automation, Google Workspace OAuth integration (Gmail, Calendar, Drive, YouTube), AES-256 BYOK encryption, and automated social publishing across Instagram, YouTube, X, LinkedIn, Facebook, Pinterest, and TikTok.",
    role: "Architect & Full Stack Engineer",
    year: "2025 - 2026",
    status: "Live in Production",
    features: [
      "Hot model switching across Gemini 3.6 Flash, Claude 3.5 Sonnet, GPT-4o, and DeepSeek R1 without context loss",
      "Full-duplex live hands-free voice agent with real-time speech synthesis & local intent dispatch",
      "Real-time Tavily internet search grounding with clickable URL source citations",
      "Google Workspace sync: summarize unread Gmail, schedule Google Calendar events, and access Drive",
      "Universal Social Media Publisher: 1-click AI caption generation & posting to 7 major platforms",
      "BYOK local AES-256-GCM encrypted API key management for private high-throughput workloads",
      "Interactive GSAP-sequenced live demo stage & full-screen distraction-free prompt/code studio",
      "Apple-grade telemetry dashboard tracking token quotas, traffic, and system uptime"
    ],
    stack: ["React 19", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Socket.io", "Google Cloud", "Tavily"],
    concepts: ["Multi-Model Routing", "Autonomous Tool Loops", "Social Automation", "Encrypted BYOK"],
    links: {
      github: "https://github.com/ashoka-2/FullStack",
      live: "https://parsuai.vercel.app/"
    },
    desktopImage: "/images/projects/parsu-desktop.svg",
    mobileImage: "/images/projects/parsu-mobile.svg",
    images: [
      {
        url: "/images/projects/parsu-desktop.svg",
        title: "Autonomous Agent Execution Environment",
        caption: "Unified LangChain pipeline with live Tavily web grounding and BYOK encryption",
        aspect: "desktop"
      },
      {
        url: "/images/projects/parsu-mobile.svg",
        title: "Social Command Center Mobile",
        caption: "Voice agent interface and 1-click automated social publishing to 7 platforms",
        aspect: "mobile"
      }
    ],
    cover: {
      dark: "/images/projects/parsu-desktop.svg",
      light: "/images/projects/parsu-desktop.svg"
    },
    accent: "#20B8CD"
  },
  {
    slug: "codespace",
    index: "03",
    title: "codeSpace",
    category: ["Cloud Sandboxes", "Kubernetes", "DevTools"],
    oneLiner: "AI-powered cloud sandbox & microservices IDE with isolated container runtimes & terminal streams.",
    overview: "codeSpace is an elastic, cloud-native developer sandbox platform designed to run arbitrary code environments safely inside Kubernetes. Built with isolated Docker containers, dynamic terminal web sockets, AI code orchestration, and AWS EKS microservices, it gives developers instantaneous development sandboxes accessible entirely within a high-performance browser interface.",
    role: "Cloud & Distributed Systems Engineer",
    year: "2025 - 2026",
    status: "Architecture & Sandbox Tested",
    features: [
      "Instant isolated sandbox container provisioning orchestrated via Kubernetes & Skaffold",
      "Low-latency duplex WebSocket terminal streaming providing full shell capabilities",
      "Integrated Monaco-based browser editor with multi-file workspace persistence",
      "AI orchestration microservice delivering context-aware code generation and error remediation",
      "Decoupled microservice architecture: Auth, Notification, Sandbox, and AI Orchestration",
      "AWS EKS deployment configurations with automated resource quotas and network policies",
      "Ephemeral container teardown and memory state reconciliation engine",
      "Zero-install collaborative coding workflows accessible from any modern device"
    ],
    stack: ["React", "Node.js", "Kubernetes", "Docker", "AWS EKS", "WebSockets", "Skaffold"],
    concepts: ["Cloud Native Sandboxes", "Container Orchestration", "Microservices", "Terminal Streaming"],
    links: {
      github: "https://github.com/ashoka-2/Capstone",
      live: ""
    },
    desktopImage: "/images/projects/codespace-desktop.svg",
    mobileImage: "/images/projects/codespace-mobile.svg",
    images: [
      {
        url: "/images/projects/codespace-desktop.svg",
        title: "Cloud IDE & Microservices Terminal",
        caption: "Isolated container sandbox with WebSocket shell streaming and Monaco code editor",
        aspect: "desktop"
      },
      {
        url: "/images/projects/codespace-mobile.svg",
        title: "Cluster Telemetry Console",
        caption: "Real-time AWS EKS and Kubernetes pod status monitoring",
        aspect: "mobile"
      }
    ],
    cover: {
      dark: "/images/projects/codespace-desktop.svg",
      light: "/images/projects/codespace-desktop.svg"
    },
    accent: "#8B5CF6"
  },
  {
    slug: "scapegoat",
    index: "04",
    title: "ScapeGoat",
    category: ["E-Commerce", "AI Recommendation", "Full Stack"],
    oneLiner: "Intelligent multi-category retail platform featuring AI product discovery and shopping guidance.",
    overview: "ScapeGoat is a comprehensive e-commerce platform designed around intelligent catalog discovery and contextual shopping assistance. Incorporating fluid category hierarchies, modern micro-interactions, responsive cart workflows, and automated product suggestions based on user intent.",
    role: "Lead Full Stack Developer",
    year: "2025",
    status: "Completed",
    features: [
      "Dynamic multi-level product catalog with advanced faceted search and attribute filtering",
      "Contextual AI shopping assistant guiding customers to optimal product selections",
      "Persistent cart state synchronization with real-time stock availability validation",
      "Interactive product visual galleries with smooth touch-enabled image magnification",
      "Secure customer authentication with order history, tracking, and wishlist management",
      "Optimized server-side pagination with sub-100ms response times on broad queries",
      "Fluid responsive layout engineered with custom Tailwind tokens and smooth transitions"
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "REST APIs"],
    concepts: ["Dynamic Catalogs", "Intent-Based Recommendation", "Cart Synchronization", "Modern UX"],
    links: {
      github: "https://github.com/ashoka-2/Scapegoat",
      live: "https://scapegoatt.vercel.app/"
    },
    desktopImage: "/images/projects/scapegoat-desktop.svg",
    mobileImage: "/images/projects/scapegoat-mobile.svg",
    images: [
      {
        url: "/images/projects/scapegoat-desktop.svg",
        title: "Intelligent Storefront Discovery",
        caption: "Faceted category filtering, dynamic catalog and contextual AI product suggestions",
        aspect: "desktop"
      },
      {
        url: "/images/projects/scapegoat-mobile.svg",
        title: "Mobile Shopping Assistant",
        caption: "Interactive touch catalog, instant cart drawer and smart checkout",
        aspect: "mobile"
      }
    ],
    cover: {
      dark: "/images/projects/scapegoat-desktop.svg",
      light: "/images/projects/scapegoat-desktop.svg"
    },
    accent: "#F97316"
  },
  {
    slug: "chatme",
    index: "05",
    title: "chatMe",
    category: ["Real-Time Systems", "WebSockets", "Social"],
    oneLiner: "Mobile-first instant messaging engine with presence detection & low-latency duplex channels.",
    overview: "chatMe is a lightweight, mobile-first real-time messaging application engineered with WebSockets. Built to deliver instant conversational communication with typing telemetry, online/offline presence indicators, rich message previews, and clean glassmorphic aesthetic interfaces.",
    role: "Full Stack Engineer",
    year: "2024 - 2025",
    status: "Completed",
    features: [
      "Bi-directional duplex messaging powered by optimized Socket.io channels",
      "Real-time user presence tracking with automated heartbeat detection",
      "Live typing indicators, delivery receipts, and unread count badges",
      "Mobile-optimized gesture-friendly UI with smooth touch transitions",
      "Secure conversation threads with media attachments and link previews",
      "Low-memory client state cache for continuous smooth frame rates"
    ],
    stack: ["React", "Node.js", "Express", "Socket.io", "MongoDB", "Tailwind CSS"],
    concepts: ["WebSocket Architecture", "Presence Tracking", "Event Telemetry", "Mobile-First UX"],
    links: {
      github: "https://github.com/ashoka-2/FullStack",
      live: "https://chatme-cohort.vercel.app/"
    },
    desktopImage: "/images/projects/chatme-desktop.svg",
    mobileImage: "/images/projects/chatme-mobile.svg",
    images: [
      {
        url: "/images/projects/chatme-desktop.svg",
        title: "Real-Time WebSocket Chat Interface",
        caption: "Sub-15ms duplex messaging channels, active contact list and typing telemetry",
        aspect: "desktop"
      },
      {
        url: "/images/projects/chatme-mobile.svg",
        title: "Mobile Chat Thread & Gestures",
        caption: "Fluid mobile conversations with presence indicators and quick media attach",
        aspect: "mobile"
      }
    ],
    cover: {
      dark: "/images/projects/chatme-desktop.svg",
      light: "/images/projects/chatme-desktop.svg"
    },
    accent: "#06B6D4"
  },
  {
    slug: "moodify",
    index: "06",
    title: "Moodify",
    category: ["Creative Coding", "Web Audio API", "AI Music"],
    oneLiner: "Mood-based music discovery & audio-reactive visualizer mapping sound frequencies to dynamic canvas art.",
    overview: "Moodify fuses music discovery with real-time generative computer graphics. By analyzing audio frequencies through the Web Audio API Analyzer node, Moodify generates fluid, audio-reactive visual waveforms and delivers curated auditory landscapes tailored to user emotion states.",
    role: "Creative Developer",
    year: "2024",
    status: "Completed",
    features: [
      "Live frequency spectrum analysis and waveform rendering via Web Audio API",
      "Dynamic procedural canvas visualizations synchronized to BPM and bass frequencies",
      "Emotion-to-music recommendation mapping engine with curated sonic playlists",
      "Minimalist media controls with seamless audio buffer streaming and volume ducking",
      "Interactive fluid color mesh that reacts to audio peaks and dynamics"
    ],
    stack: ["React", "Web Audio API", "HTML5 Canvas", "Node.js", "Express", "Tailwind CSS"],
    concepts: ["Frequency Analysis", "Audio Reactive Graphics", "Sensory Interface Design"],
    links: {
      github: "https://github.com/ashoka-2/FullStack",
      live: "https://moodplay-ai.vercel.app/"
    },
    desktopImage: "/images/projects/moodify-desktop.svg",
    mobileImage: "/images/projects/moodify-mobile.svg",
    images: [
      {
        url: "/images/projects/moodify-desktop.svg",
        title: "Audio-Reactive Frequency Studio",
        caption: "Live Web Audio API frequency spectrum analyzer and emotion-mapped acoustic playlists",
        aspect: "desktop"
      },
      {
        url: "/images/projects/moodify-mobile.svg",
        title: "Mobile Audio Player & Visualizer",
        caption: "Kinetic soundwave rendering and gesture-controlled audio streaming",
        aspect: "mobile"
      }
    ],
    cover: {
      dark: "/images/projects/moodify-desktop.svg",
      light: "/images/projects/moodify-desktop.svg"
    },
    accent: "#EC4899"
  },
  {
    slug: "battlearena",
    index: "07",
    title: "BattleArena",
    category: ["AI Benchmarking", "Evaluation", "Python / FastAPI"],
    oneLiner: "Automated AI-vs-AI competitive reasoning arena with automated judging & telemetry benchmarks.",
    overview: "BattleArena provides an automated evaluation playground where multiple frontier LLMs compete head-to-head on complex algorithmic puzzles, mathematical reasoning, and creative synthesis. Automated referee models evaluate logic, efficiency, and edge-case handling with side-by-side execution analysis.",
    role: "AI Systems Engineer",
    year: "2025",
    status: "Completed",
    features: [
      "Simultaneous prompt execution against multiple frontier models via async pipelines",
      "Objective automated judge evaluation scoring logical consistency, speed, and accuracy",
      "Interactive side-by-side reasoning visualizer comparing model deduction paths",
      "Live telemetry displaying tokens/sec, time-to-first-token, and cost metrics",
      "Algorithmic challenge suite spanning data structures, system design, and creative logic"
    ],
    stack: ["React", "Python", "FastAPI", "Multi-LLM APIs", "Tailwind CSS"],
    concepts: ["LLM-as-a-Judge", "Benchmarking", "Async Multi-Inference", "Telemetry"],
    links: {
      github: "https://github.com/ashoka-2/FullStack",
      live: ""
    },
    desktopImage: "/images/projects/battlearena-desktop.svg",
    mobileImage: "/images/projects/battlearena-mobile.svg",
    images: [
      {
        url: "/images/projects/battlearena-desktop.svg",
        title: "Frontier Model Benchmarking Arena",
        caption: "Parallel asynchronous evaluation, deduction path visualizer and automated judge scoring",
        aspect: "desktop"
      },
      {
        url: "/images/projects/battlearena-mobile.svg",
        title: "Mobile Evaluation Telemetry",
        caption: "Real-time token metrics, latency benchmarks and head-to-head win-rate charts",
        aspect: "mobile"
      }
    ],
    cover: {
      dark: "/images/projects/battlearena-desktop.svg",
      light: "/images/projects/battlearena-desktop.svg"
    },
    accent: "#EF4444"
  },
  {
    slug: "movieplatform",
    index: "08",
    title: "MoviePlatform",
    category: ["Web Application", "Media Streaming", "REST APIs"],
    oneLiner: "Entertainment discovery engine with trending cinema feeds, trailer embeds & personalized watchlists.",
    overview: "A sleek cinema discovery and streaming platform designed for movie lovers. Providing real-time movie trending rankings, high-definition trailer playback, genre-based navigation, deep cast filmographies, and local watchlists with a modern Netflix/Apple TV style aesthetic.",
    role: "Frontend Architect",
    year: "2024",
    status: "Completed",
    features: [
      "Live integration with TMDB API fetching trending movies, TV series, and celebrity bios",
      "Embedded YouTube trailer modal with fluid backdrop blur and custom playback controls",
      "Personalized watchlist and favorites stored in persistent browser storage",
      "Smart search with instant debounced typeahead suggestions and genre filtering",
      "Responsive hero carousel with auto-cycling high-resolution backdrop art"
    ],
    stack: ["React", "TMDB API", "Node.js", "Express", "Tailwind CSS"],
    concepts: ["Media Streaming UX", "Debounced Search", "Carousel Architectures"],
    links: {
      github: "https://github.com/ashoka-2/FullStack",
      live: ""
    },
    desktopImage: "/images/projects/movieplatform-desktop.svg",
    mobileImage: "/images/projects/movieplatform-mobile.svg",
    images: [
      {
        url: "/images/projects/movieplatform-desktop.svg",
        title: "Cinema Streaming & Discovery Hub",
        caption: "TMDB API live trending feeds, high-definition trailer playback modal and watchlists",
        aspect: "desktop"
      },
      {
        url: "/images/projects/movieplatform-mobile.svg",
        title: "Mobile Cinema Browse Experience",
        caption: "Genre-based discovery ribbons, movie poster carousel and instant bookmarking",
        aspect: "mobile"
      }
    ],
    cover: {
      dark: "/images/projects/movieplatform-desktop.svg",
      light: "/images/projects/movieplatform-desktop.svg"
    },
    accent: "#F59E0B"
  }
];
