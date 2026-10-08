// Polyfill WebGL methods to protect against null dereferences in headless/software environments
if (typeof window !== 'undefined') {
  const patchGL = (proto) => {
    if (!proto) return;
    if (proto.getShaderPrecisionFormat) {
      const origPrec = proto.getShaderPrecisionFormat;
      proto.getShaderPrecisionFormat = function (shaderType, precisionType) {
        try {
          const res = origPrec.call(this, shaderType, precisionType);
          if (res && typeof res.precision === 'number') return res;
        } catch {}
        return { rangeMin: 1, rangeMax: 1, precision: 23 };
      };
    }
    if (proto.getParameter) {
      const origParam = proto.getParameter;
      proto.getParameter = function (param) {
        try {
          const res = origParam.call(this, param);
          if (res !== null && res !== undefined) return res;
        } catch {}
        if (param === this.VERSION) return 'WebGL 2.0 (OpenGL ES 3.0 Chromium)';
        if (param === this.SCISSOR_BOX || param === this.VIEWPORT) return new Int32Array([0, 0, 1440, 900]);
        if (param === this.MAX_COMBINED_TEXTURE_IMAGE_UNITS) return 16;
        return null;
      };
    }
  };
  if (typeof WebGLRenderingContext !== 'undefined') patchGL(WebGLRenderingContext.prototype);
  if (typeof WebGL2RenderingContext !== 'undefined') patchGL(WebGL2RenderingContext.prototype);
}

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { MODEL_URL, getShots, TUNING, EMOTES, SECTION_STOPS } from './avatarConfig';
import { buildRig, toAPose, updateRig } from './rig';

/**
 * AvatarScene
 * Master WebGL canvas controller for Ashok's interactive 3D avatar.
 * Manages Three.js renderer, lighting rig, GLTF loading, procedural bone rig,
 * facial morph targets, scroll director, and rendering lifecycle.
 */
export class AvatarScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.isDisposed = false;
    this.isPaused = false;
    if (typeof window !== 'undefined') {
      window.__avatarScene = this;
    }

    // 1. Reduced Motion Detection with live listener
    this.mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.isReducedMotion = this.mediaQueryMotion.matches;
    this.handleMotionChange = (e) => {
      this.isReducedMotion = e.matches;
    };
    if (this.mediaQueryMotion.addEventListener) {
      this.mediaQueryMotion.addEventListener('change', this.handleMotionChange);
    }

    // 2. WebGL Renderer Initialization
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    const maxDpr = this.w < 800 ? 1.5 : 2.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.setSize(this.w, this.h, false);

    // 3. Scene & Holder Group
    this.scene = new THREE.Scene();
    this.holder = new THREE.Group();
    this.scene.add(this.holder);

    // 4. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(26, this.w / this.h, 0.05, 60);

    // 5. Procedural Studio Environment
    this.setupEnvironment();

    // 6. Lighting Rig (scaled by Math.PI for Three.js r155+ physically-based lights)
    this.setupLights();

    // 7. Contact Shadow & Feet Accent Glow
    this.setupShadowAndGlow();

    // 8. Dimensions & Camera Shot Calibration
    this.eyeY = 1.68;
    this.modelHeight = 1.82;
    this.shots = getShots(this.w / this.h, this.eyeY, this.modelHeight);

    // Master director state
    this.cur = {
      lhv: this.shots.face.lhv,
      cy: this.shots.face.cy,
      fov: this.shots.face.fov,
      sx: 0,
      ry: 0,
      o: 1,
      present: 0,
      wave: 0,
      side: 1,
    };
    this.tgt = Object.assign({}, this.cur);
    this.rig = this.cur;
    this.isSeeded = false;
    this.directorStops = [];

    // Animation & interaction properties
    this.intro = { o: 1, ry: 0 };
    this.look = { x: 0, y: 0 };
    this.pointer = { x: 0, y: 0 };
    this.gaze = null;
    this.scrollVel = 0;
    this.lastScrollY = window.scrollY;
    this.ovWave = 0;
    this.wavingTl = null;
    this.angryTl = null;
    this.angryAmount = 0;
    this.headMesh = null;
    this.headMaterial = null;
    this.origHeadColor = null;

    // Morph target influences
    this.morphMeshes = [];
    this.morphNow = {};
    this.morphGoal = {};
    this.blinkAt = 2.0;
    this.blinkT = -1;
    this.blinkDbl = false;

    // Time tracking
    this.lastTime = performance.now();
    this.tNow = 0;
    this.lastMoveTime = -99;

    // 9. Debounced director rebuild listener
    this.resizeDebounceTimer = null;
    this.handleScrollTriggerRefresh = () => this.buildDirector();
    if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.addEventListener) {
      ScrollTrigger.addEventListener('refresh', this.handleScrollTriggerRefresh);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.buildDirector());
    }

    // 10. Load 3D Avatar Model
    this.ready = this.load();

    // 11. Bind tick to GSAP ticker
    this.tick = this.tick.bind(this);
    gsap.ticker.add(this.tick);
  }

  setupEnvironment() {
    const envScene = new THREE.Scene();
    const sphereGeo = new THREE.SphereGeometry(20, 32, 16);
    const pos = sphereGeo.attributes.position;
    const colors = [];

    const lerp = (a, b, t) => a + (b - a) * t;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) / 20;
      const v = y > 0 ? lerp(0.35, 0.90, y) : lerp(0.35, 0.08, -y);
      colors.push(v * 0.85, v * 0.90, v);
    }
    sphereGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    envScene.add(
      new THREE.Mesh(
        sphereGeo,
        new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })
      )
    );

    const addPanel = (w, h, x, y, z, k, col) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(col).multiplyScalar(k),
          side: THREE.DoubleSide,
        })
      );
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      envScene.add(m);
    };

    addPanel(6, 4, 5, 4, 7, 6.0, 0xfff1e0);   // Warm key bounce
    addPanel(4, 6, -7, 2, -4, 4.0, 0xbfd6ff); // Cool rim bounce
    addPanel(8, 3, 0, 9, 2, 3.0, 0xffffff);   // Soft overhead
    addPanel(5, 5, -6, 1, 6, 1.6, 0xe8f0ff);  // Side fill

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(envScene, 0.03).texture;
    this.scene.environment = this.envTexture;
    pmrem.dispose();
  }

  setupLights() {
    // Three.js r186 uses physically correct lights; intensities multiplied by Math.PI
    this.keyLight = new THREE.DirectionalLight(0xfff4ea, 1.1 * Math.PI);
    this.keyLight.position.set(2, 3, 4);
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(0x38b6f5, 1.8 * Math.PI);
    this.rimLight.position.set(-3, 2, -3);
    this.scene.add(this.rimLight);

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 0.35 * Math.PI);
    this.scene.add(this.hemiLight);
  }

  setupShadowAndGlow() {
    const makeRadialTexture = (inner, outer) => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, inner);
      g.addColorStop(1, outer);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    };

    this.shadowTexture = makeRadialTexture('rgba(0,0,0,0.85)', 'rgba(0,0,0,0)');
    const shadowMat = new THREE.MeshBasicMaterial({
      map: this.shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.35,
    });
    this.shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = 0.003;
    this.holder.add(this.shadowMesh);

    this.glowTexture = makeRadialTexture('rgba(255,255,255,0.9)', 'rgba(255,255,255,0)');
    const glowMat = new THREE.MeshBasicMaterial({
      map: this.glowTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0x38b6f5,
      opacity: 0.35,
    });
    this.glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), glowMat);
    this.glowMesh.rotation.x = -Math.PI / 2;
    this.glowMesh.position.y = 0.002;
    this.holder.add(this.glowMesh);
  }

  load() {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();

      loader.load(
        MODEL_URL,
        (gltf) => {
          if (this.isDisposed) return;
          this.root = gltf.scene;
          this.holder.add(this.root);
          window.__avatarScene = this;

          // 1. Process materials & morph targets
          this.fixMaterials();

          // 2. Map skeleton & orientation
          this.bones = buildRig(this.root);

          // Verify avatar faces the camera (+Z)
          if (this.bones.LeftToeBase && this.bones.LeftFoot) {
            const a = new THREE.Vector3();
            const b = new THREE.Vector3();
            this.bones.LeftFoot.getWorldPosition(a);
            this.bones.LeftToeBase.getWorldPosition(b);
            if (b.z < a.z) {
              this.root.rotation.y = Math.PI;
              this.holder.updateMatrixWorld(true);
            }
          }

          // 3. Relax T-pose to natural A-pose
          this.rest = toAPose(this.bones, this.holder);

          // 4. Measure exact eye height and top of head
          if (this.bones.LeftEye && this.bones.RightEye) {
            const a = new THREE.Vector3();
            const b = new THREE.Vector3();
            this.bones.LeftEye.getWorldPosition(a);
            this.bones.RightEye.getWorldPosition(b);
            this.eyeY = this.holder.worldToLocal(a.add(b).multiplyScalar(0.5)).y;
          }

          if (this.bones.HeadTop_End) {
            const a = new THREE.Vector3();
            this.bones.HeadTop_End.getWorldPosition(a);
            this.modelHeight = this.holder.worldToLocal(a).y || 1.82;
          }

          // Recalculate shots with measured dimensions
          this.shots = getShots(this.w / this.h, this.eyeY, this.modelHeight);

          // Build scroll director stops
          this.buildDirector();

          // Seed initial target immediately at face close-up
          this.sample(window.scrollY || 0, this.tgt);
          Object.assign(this.cur, this.tgt);
          this.isSeeded = true;

          // 5. Update theme colors
          this.updateTheme();

          // 6. Signal ready state and add .av class to html
          document.documentElement.classList.add('av');
          window.dispatchEvent(new CustomEvent('avatar:ready', { detail: this }));
          window.dispatchEvent(new CustomEvent('avatar:progress', { detail: 1.0 }));

          resolve(this);
        },
        (e) => {
          const ratio = e.total ? e.loaded / e.total : 0.6;
          window.dispatchEvent(new CustomEvent('avatar:progress', { detail: ratio }));
        },
        (err) => {
          document.documentElement.classList.remove('av');
          reject(err);
        }
      );
    });
  }

  playIntro() {
    if (this.isDisposed) return;
    this.intro.ry = -0.6;
    gsap.fromTo(this.intro, { o: 0.1, ry: -0.6 }, { o: 1, ry: 0, duration: 1.2, ease: 'power2.out' });
    setTimeout(() => this.emote('smile', 1.8), 500);
  }

  buildDirector() {
    const vh = window.innerHeight;
    const mob = window.innerWidth < 800;
    const T = this.shots;
    if (!T) return;

    const S = (shot, sd, pose, ry, o) => {
      const d = T[shot] || T.face;
      return {
        lhv: d.lhv,
        cy: d.cy,
        fov: d.fov,
        sx: mob ? 0 : sd,
        ry: mob ? ry * 0.4 : ry,
        o: o ?? 1,
        present: pose === 'present' ? 1 : 0,
        wave: pose === 'wave' ? 1 : 0,
        side: sd >= 0 ? 1 : -1,
      };
    };

    // Locate real hero pin end from ScrollTrigger or fallback height
    let pinEnd = vh * 1.5;
    if (typeof ScrollTrigger !== 'undefined') {
      const heroPin = ScrollTrigger.getAll().find(
        (s) => s.vars && s.vars.pin && (s.trigger?.id === 'hero' || s.trigger?.id === 'top')
      );
      if (heroPin && heroPin.end) {
        pinEnd = heroPin.end - (heroPin.start || 0);
      } else {
        const heroEl = document.getElementById('hero');
        if (heroEl) pinEnd = Math.max(vh * 1.5, heroEl.offsetHeight - vh);
      }
    }

    // 1. Hero 3-Beat Runway
    this.directorStops = [
      { y: 0, w: 1, s: S('face', 0, 'idle', 0, 1) },
      { y: pinEnd * 0.45, w: pinEnd * 0.45, s: S('bust', 0, 'idle', 0, 1) },
      { y: pinEnd, w: pinEnd * 0.55, s: S('full', 0, 'present', 0, 1) },
    ];

    // 2. Subsequent Home Page Sections
    SECTION_STOPS.forEach(({ sel, shot, side, pose, ry }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const prev = this.directorStops[this.directorStops.length - 1];
      const rect = el.getBoundingClientRect();
      let y = rect.top + window.scrollY - vh * 0.4;
      y = Math.max(y, prev.y + 24);
      this.directorStops.push({
        y,
        w: Math.min(vh * 0.85, y - prev.y),
        s: S(shot, side, pose, ry, mob ? 0.35 : 1),
      });
    });
  }

  sample(sy, out) {
    const list = this.directorStops;
    if (!list || list.length === 0) return;
    let k = list.findIndex((o) => sy <= o.y);
    if (k <= 0) {
      const stop = list[k < 0 ? list.length - 1 : 0];
      if (stop && stop.s) Object.assign(out, stop.s);
      return;
    }
    const a = list[k - 1]?.s;
    const b = list[k];
    if (!a || !b || !b.s) return;

    const rawT = (sy - (b.y - b.w)) / Math.max(1, b.w);
    const clampedT = Math.min(1, Math.max(0, rawT));
    const t = clampedT * clampedT * (3 - 2 * clampedT);

    const KEYS = ['lhv', 'cy', 'fov', 'sx', 'ry', 'o', 'present', 'wave'];
    const lerp = (v0, v1, p) => v0 + (v1 - v0) * p;
    for (let i = 0; i < KEYS.length; i++) {
      const key = KEYS[i];
      const va = a[key] ?? 0;
      const vb = b.s[key] ?? 0;
      out[key] = lerp(va, vb, t);
    }
    out.side = t > 0.5 ? (b.s?.side ?? 1) : (a?.side ?? 1);
  }

  fixMaterials() {
    this.morphMeshes = [];
    const maxAniso = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());

    this.root.traverse((o) => {
      if (!o.isMesh) return;
      o.frustumCulled = false;

      if (o.morphTargetDictionary) {
        this.morphMeshes.push(o);
      }

      const m = o.material;
      if (!m) return;

      const id = (o.name + ' ' + (m.name || '')).toLowerCase();

      // Cache AvatarHead material for angry facial red tint
      if (o.name === 'AvatarHead') {
        this.headMesh = o;
        this.headMaterial = m;
        this.origHeadColor = m.color.clone();
      }

      // Pre-upload textures to GPU
      ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'].forEach((k) => {
        if (m[k]) {
          m[k].anisotropy = maxAniso;
          this.renderer.initTexture(m[k]);
        }
      });

      // Hair alpha cutout fix
      if (/hair/.test(id)) {
        m.transparent = false;
        m.alphaTest = 0.38;
        m.alphaToCoverage = true;
        m.depthWrite = true;
        m.side = THREE.DoubleSide;
        m.needsUpdate = true;
      } else if (/glass|cornea/.test(id)) {
        m.transparent = true;
        m.depthWrite = false;
        o.renderOrder = 3;
      }

      m.envMapIntensity = 0.55;
    });
  }

  setMorph(name, value) {
    for (let i = 0; i < this.morphMeshes.length; i++) {
      const mesh = this.morphMeshes[i];
      const idx = mesh.morphTargetDictionary[name];
      if (idx !== undefined && mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[idx] = value;
      }
    }
  }

  emote(name, seconds = 1.8) {
    const targets = EMOTES[name];
    if (!targets) return;

    this.morphGoal = Object.assign({}, targets);
    clearTimeout(this.emoTimer);
    this.emoTimer = setTimeout(() => {
      this.morphGoal = {};
    }, seconds * 1000);

    // Angry special body reaction: red tint on face & head shake
    if (name === 'angry') {
      if (this.angryTl) this.angryTl.kill();
      this.angryTl = gsap.timeline();

      this.angryTl.to(this, { angryAmount: 1, duration: 0.35, ease: 'power2.out' })
        .to(this, { angryAmount: 0, duration: 1.8, ease: 'power2.inOut' }, '+=0.2');

      if (this.headMaterial && this.origHeadColor) {
        const angryColor = this.origHeadColor.clone().lerp(new THREE.Color('#ff9a8a'), 0.22);
        gsap.to(this.headMaterial.color, {
          r: angryColor.r,
          g: angryColor.g,
          b: angryColor.b,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(this.headMaterial.color, {
              r: this.origHeadColor.r,
              g: this.origHeadColor.g,
              b: this.origHeadColor.b,
              duration: 1.8,
              ease: 'power2.inOut',
            });
          },
        });
      }
    }
  }

  wave() {
    if (this.wavingTl) this.wavingTl.kill();
    this.wavingTl = gsap.timeline()
      .to(this, { ovWave: 1, duration: 0.55, ease: 'power3.out' })
      .to(this, { ovWave: 0, duration: 0.80, ease: 'power2.inOut' }, '+=2.0');

    this.emote('smile', 3.0);
  }

  lookAtElement(el, seconds = 1.5) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = THREE.MathUtils.clamp((r.left + r.width / 2) / window.innerWidth * 2 - 1, -1, 1);
    const ny = THREE.MathUtils.clamp(-((r.top + r.height / 2) / window.innerHeight * 2 - 1), -1, 1);
    this.gaze = { x: nx, y: ny, until: this.tNow + seconds };
  }

  updateTheme(duration = 0.5) {
    const isDark = document.documentElement.dataset.theme !== 'light';
    const cs = getComputedStyle(document.documentElement);
    const accentHex = (cs.getPropertyValue('--accent') || '#38b6f5').trim();
    const acColor = new THREE.Color(accentHex);

    gsap.to(this.rimLight.color, { r: acColor.r, g: acColor.g, b: acColor.b, duration });
    gsap.to(this.glowMesh.material.color, { r: acColor.r, g: acColor.g, b: acColor.b, duration });

    gsap.to(this.rimLight, { intensity: (isDark ? 1.8 : 1.1) * Math.PI, duration });
    gsap.to(this.keyLight, { intensity: (isDark ? 1.1 : 1.35) * Math.PI, duration });
    gsap.to(this.hemiLight, { intensity: (isDark ? 0.30 : 0.55) * Math.PI, duration });

    gsap.to(this.glowMesh.material, { opacity: isDark ? 0.40 : 0.15, duration });
    gsap.to(this.shadowMesh.material, { opacity: isDark ? 0.35 : 0.25, duration });

    this.renderer.toneMappingExposure = isDark ? 1.0 : 1.05;
  }

  setTheme(isDark) {
    this.updateTheme();
  }

  resize() {
    if (!this.canvas || !this.renderer) return;
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    const maxDpr = this.w < 800 ? 1.5 : 2.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.setSize(this.w, this.h, false);

    this.shots = getShots(this.w / this.h, this.eyeY, this.modelHeight);

    // 120ms debounced director rebuild
    clearTimeout(this.resizeDebounceTimer);
    this.resizeDebounceTimer = setTimeout(() => {
      this.buildDirector();
    }, 120);

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
  }

  tick(time, deltaTime) {
    if (this.isDisposed || document.hidden || this.isPaused) return;

    // Check if route is not home page
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, w < 800 ? 1.5 : 2.0);
    const expW = Math.floor(w * dpr);
    const expH = Math.floor(h * dpr);
    if (this.canvas.width !== expW || this.canvas.height !== expH || this.w !== w || this.h !== h) {
      this.resize();
    }

    const dt = Math.min((deltaTime || 16.67) / 1000, 0.05);
    const K = (speed) => 1 - Math.exp(-speed * dt);
    this.tNow += dt;
    const t = this.tNow;

    // Scroll velocity smoothing
    const sy = window.scrollY;
    this.scrollVel += ((sy - this.lastScrollY) / Math.max(dt, 0.001) - this.scrollVel) * K(6);
    this.lastScrollY = sy;
    const v = this.isReducedMotion ? 0 : THREE.MathUtils.clamp(this.scrollVel / 2500, -1, 1);

    // Sample scroll director
    this.sample(sy, this.tgt);
    if (!this.isSeeded) {
      Object.assign(this.cur, this.tgt);
      this.isSeeded = true;
    }

    const KEYS = ['lhv', 'cy', 'fov', 'sx', 'ry', 'o', 'present', 'wave'];
    for (let i = 0; i < KEYS.length; i++) {
      const key = KEYS[i];
      this.cur[key] += (this.tgt[key] - this.cur[key]) * K(this.isReducedMotion ? 40 : 5.5);
    }
    this.cur.side = this.tgt.side;

    // Gaze target selection (interactive hover / idle sway)
    let tx = this.pointer.x;
    let ty = this.pointer.y;
    if (this.gaze && t < this.gaze.until) {
      tx = this.gaze.x;
      ty = this.gaze.y;
    } else if (t - this.lastMoveTime > 5) {
      tx = Math.sin(t * 0.35) * 0.30;
      ty = Math.sin(t * 0.27) * 0.12;
    }

    this.look.x += (tx - this.look.x) * K(this.isReducedMotion ? 20 : 5);
    this.look.y += (ty - this.look.y) * K(this.isReducedMotion ? 20 : 5);

    // Camera Framing (Derived mathematically from visible vertical height hv in metres)
    const hv = Math.exp(this.cur.lhv);
    const fov = this.cur.fov + v * 1.6;
    const d = hv / 2 / Math.tan(THREE.MathUtils.degToRad(fov / 2));
    const cy = this.cur.cy;

    this.camera.fov = fov;
    this.camera.aspect = w / h;
    this.camera.position.set(
      this.look.x * 0.07 * hv,
      cy - this.look.y * 0.035 * hv,
      d
    );
    this.camera.lookAt(0, cy, 0);

    // Horizontal placement via setViewOffset (faithful to reference ashok-portfolio-3d.html)
    this.camera.setViewOffset(
      w,
      h,
      -this.cur.sx * w * TUNING.viewShift,
      0,
      w,
      h
    );

    // Holder rotation (facing direction + intro tilt + scroll reaction + subtle head follow)
    this.holder.rotation.y = this.cur.ry + this.intro.ry + v * 0.20 + this.look.x * 0.10;

    // Run procedural bone rig
    updateRig(this, dt, t);

    // Natural Blinking
    let bl = 0;
    if (this.blinkT < 0 && t > this.blinkAt) {
      this.blinkT = 0;
    }
    if (this.blinkT >= 0) {
      this.blinkT += dt;
      const p = this.blinkT / 0.14;
      if (p >= 1) {
        this.blinkT = -1;
        if (!this.blinkDbl && Math.random() < 0.14) {
          this.blinkDbl = true;
          this.blinkAt = t + 0.12;
        } else {
          this.blinkDbl = false;
          this.blinkAt = t + 2.4 + Math.random() * 3.6;
        }
      } else {
        bl = Math.sin(p * Math.PI);
      }
    }

    // Face morph targets smoothing
    const amb = 0.10 + (this.isReducedMotion ? 0 : 0.05 * Math.sin(t * 0.5));
    const G = Object.assign({}, this.morphGoal);
    G.mouthSmileLeft = Math.max(G.mouthSmileLeft || 0, amb);
    G.mouthSmileRight = Math.max(G.mouthSmileRight || 0, amb);
    G.browInnerUp = (G.browInnerUp || 0) + (this.isReducedMotion ? 0 : 0.05 * (Math.sin(t * 0.7) + 1));
    G.eyeBlinkLeft = Math.max(G.eyeBlinkLeft || 0, bl);
    G.eyeBlinkRight = Math.max(G.eyeBlinkRight || 0, bl);

    for (const name in G) {
      if (!(name in this.morphNow)) this.morphNow[name] = 0;
    }
    for (const name in this.morphNow) {
      const g = G[name] || 0;
      const fast = name.indexOf('Blink') >= 0 ? 40 : 9;
      const nv = this.morphNow[name] + (g - this.morphNow[name]) * K(fast);
      if (Math.abs(nv - this.morphNow[name]) > 1e-4 || (g === 0 && nv !== 0)) {
        this.morphNow[name] = Math.abs(nv) < 1e-3 && g === 0 ? 0 : nv;
        this.setMorph(name, this.morphNow[name]);
      }
    }

    // Sync canvas style opacity with intro progress and scroll visibility
    const op = this.intro.o * Math.min(1, Math.max(0, this.cur.o));
    this.canvas.style.opacity = op.toFixed(3);

    // Skip GPU draw if canvas is completely transparent
    if (op < 0.002) return;

    // Render 3D Frame
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.isDisposed = true;
    gsap.ticker.remove(this.tick);

    if (this.wavingTl) this.wavingTl.kill();
    if (this.angryTl) this.angryTl.kill();
    clearTimeout(this.emoTimer);
    clearTimeout(this.resizeDebounceTimer);

    if (this.mediaQueryMotion && this.mediaQueryMotion.removeEventListener) {
      this.mediaQueryMotion.removeEventListener('change', this.handleMotionChange);
    }
    if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.removeEventListener) {
      ScrollTrigger.removeEventListener('refresh', this.handleScrollTriggerRefresh);
    }

    // Remove .av class
    document.documentElement.classList.remove('av');

    // Dispose scene meshes and textures
    if (this.root) {
      this.root.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'].forEach((k) => {
              if (m[k]) m[k].dispose();
            });
            m.dispose();
          });
        }
      });
      this.holder.remove(this.root);
    }

    if (this.shadowTexture) this.shadowTexture.dispose();
    if (this.glowTexture) this.glowTexture.dispose();
    if (this.envTexture) this.envTexture.dispose();

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
