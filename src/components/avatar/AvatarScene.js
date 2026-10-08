import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from '../../lib/gsap';
import { SHOTS, EMOTES } from './avatarConfig';
import { buildRig, toAPose, updateRig } from './rig';

/**
 * AvatarScene
 * Master WebGL canvas controller for Ashok's interactive 3D avatar.
 */
export class AvatarScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.w = canvas.clientWidth || window.innerWidth;
    this.h = canvas.clientHeight || window.innerHeight;

    // 1. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    const maxDpr = window.innerWidth < 768 ? 1.5 : 2.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.setSize(this.w, this.h, false);

    // 2. Scene & Environment
    this.scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnvTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = roomEnvTexture;
    this.scene.environmentIntensity = 0.55;

    // 3. Camera
    this.camera = new THREE.PerspectiveCamera(26, this.w / this.h, 0.05, 50);

    // 4. Lighting Rig
    this.setupLights();

    // 5. Contact Shadow Plane under feet
    this.setupContactShadow();

    // 6. Master Rig Data (Controlled exclusively by Director / Scroll / GSAP)
    this.rig = {
      ...SHOTS.face,
      shiftX: 0,
      rotY: 0,
      pose: { idle: 1, present: 0, think: 0, wave: 0 },
    };

    this.pointer = new THREE.Vector2(0, 0);       // Pointer NDC (-1 to 1)
    this.smoothPointer = new THREE.Vector2(0, 0);
    this.scrollVel = 0;                           // Smoothed scroll speed from Lenis
    this.morphMeshes = [];
    this.morph = {};
    this.morphGoal = {};

    this.lastTime = performance.now();
    this.isDisposed = false;

    // 7. Load 3D Model
    this.ready = this.load();

    // 8. Bind tick and register with GSAP's central RAF ticker
    this.tick = this.tick.bind(this);
    gsap.ticker.add(this.tick);
  }

  setupLights() {
    // Soft Key Light (front-right above)
    this.keyLight = new THREE.DirectionalLight(0xfff8f0, 1.6);
    this.keyLight.position.set(2.5, 3.5, 3.0);
    this.scene.add(this.keyLight);

    // Cool Accent Rim Light (behind-left)
    this.rimLight = new THREE.DirectionalLight(0x38b6f5, 2.4);
    this.rimLight.position.set(-3.0, 2.5, -2.5);
    this.scene.add(this.rimLight);

    // Soft Ambient Fill Light
    this.hemiLight = new THREE.HemisphereLight(0xdce8f5, 0x14141d, 0.6);
    this.scene.add(this.hemiLight);

    // Balanced White Ambient Light (guarantees clear illumination across all angles)
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(this.ambientLight);
  }

  setupContactShadow() {
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.22)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.06)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });

    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = 0.002;
    this.scene.add(this.shadowMesh);
  }

  load() {
    console.log('[AvatarScene] Loading 3D model from /assets/portrait/model.glb...');
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      const modelUrl = '/assets/portrait/model.glb';

      loader.load(
        modelUrl,
        (gltf) => {
          if (this.isDisposed) return;
          console.log('[AvatarScene] 3D Model loaded successfully!', gltf.scene);
          this.root = gltf.scene;
          this.scene.add(this.root);
          window.__avatarScene = this;

          // Apply material sorting & alpha fixes
          this.fixMaterials();

          // Build bone map and lower T-pose to relaxed A-pose
          this.bones = buildRig(this.root);
          this.rest = toAPose(this.bones);
          console.log('[AvatarScene] Rig successfully configured with A-pose! Bones count:', Object.keys(this.bones).length);

          // Calibrate exact face eye-height at runtime
          if (this.bones.LeftEye && this.bones.RightEye) {
            const lPos = this.bones.LeftEye.getWorldPosition(new THREE.Vector3());
            const rPos = this.bones.RightEye.getWorldPosition(new THREE.Vector3());
            const eyeY = (lPos.y + rPos.y) / 2;
            console.log('[AvatarScene] Calibrated Eye Height:', eyeY);
            if (eyeY > 1.2 && eyeY < 2.2) {
              SHOTS.face.lookY = eyeY;
              SHOTS.face.camY = eyeY + 0.02;
            }
          }

          // Initial theme calibration
          const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
          this.setTheme(isDark);

          // Notify preloader that 3D assets are loaded
          window.dispatchEvent(new CustomEvent('avatar:progress', { detail: 1.0 }));
          resolve(this);
        },
        (e) => {
          const ratio = e.total ? e.loaded / e.total : 0.6;
          window.dispatchEvent(new CustomEvent('avatar:progress', { detail: ratio }));
        },
        (err) => {
          console.error('[AvatarScene] Error loading from /assets/portrait/model.glb, trying fallback /model.glb:', err);
          loader.load(
            '/model.glb',
            (fallbackGltf) => {
              if (this.isDisposed) return;
              console.log('[AvatarScene] Fallback /model.glb loaded successfully!');
              this.root = fallbackGltf.scene;
              this.scene.add(this.root);
              window.__avatarScene = this;
              this.fixMaterials();
              this.bones = buildRig(this.root);
              this.rest = toAPose(this.bones);
              window.dispatchEvent(new CustomEvent('avatar:progress', { detail: 1.0 }));
              resolve(this);
            },
            undefined,
            (fallbackErr) => {
              console.error('[AvatarScene] Both /assets/portrait/model.glb and /model.glb failed:', fallbackErr);
              reject(fallbackErr);
            }
          );
        }
      );
    });
  }

  fixMaterials() {
    this.morphMeshes = [];
    this.root.traverse((o) => {
      if (!o.isMesh) return;

      // Disable frustum culling on skinned meshes so bounds never disappear when posed
      o.frustumCulled = false;

      // Index meshes with morph target dictionaries
      if (o.morphTargetDictionary) {
        this.morphMeshes.push(o);
      }

      const m = o.material;
      if (!m) return;

      // Haircut alpha test fix (crisp cutout, eliminates alpha-blend sorting artifacts)
      if (/haircut/i.test(o.name)) {
        m.transparent = false;
        m.alphaTest = 0.45;
        m.depthWrite = true;
        m.side = THREE.DoubleSide;
        m.roughness = 0.85;
      }

      // Glasses & Cornea depth/render order fix
      if (/glasses|cornea/i.test(o.name)) {
        m.transparent = true;
        m.depthWrite = false;
        o.renderOrder = 3;
      }

      // Eyelashes cutout
      if (/eyelash/i.test(o.name)) {
        m.alphaTest = 0.5;
        m.transparent = false;
        m.depthWrite = true;
      }

      // Skin & Outfit materials
      if (/head|body|teeth|outfit/i.test(o.name)) {
        m.roughness = Math.max(m.roughness, 0.45);
      }
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

  emote(name, duration = 1.8) {
    const targets = EMOTES[name];
    if (!targets) return;

    // Set goal influences
    for (const key in targets) {
      this.morphGoal[key] = targets[key];
    }

    // Schedule smooth reset back to neutral
    gsap.delayedCall(duration, () => {
      for (const key in targets) {
        this.morphGoal[key] = 0;
      }
    });
  }

  wave() {
    // Wave animation sequence using GSAP
    gsap.killTweensOf(this.rig.pose);
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.to(this.rig.pose, { wave: 1, duration: 0.35 })
      .to(this.rig.pose, { wave: 1, duration: 1.6 })
      .to(this.rig.pose, { wave: 0, duration: 0.45 });

    // Accompany wave with a warm friendly smile
    this.emote('smile', 2.2);
  }

  setTheme(isDark) {
    if (!this.rimLight || !this.hemiLight) return;
    gsap.to(this.scene, {
      environmentIntensity: isDark ? 0.48 : 0.68,
      duration: 0.6,
    });
    gsap.to(this.rimLight, {
      intensity: isDark ? 2.3 : 1.3,
      color: isDark ? '#38b6f5' : '#0369a1',
      duration: 0.6,
    });
    gsap.to(this.hemiLight, {
      intensity: isDark ? 0.45 : 0.65,
      duration: 0.6,
    });
    if (this.shadowMesh) {
      gsap.to(this.shadowMesh.material, {
        opacity: isDark ? 0.75 : 0.45,
        duration: 0.6,
      });
    }
  }

  resize() {
    if (!this.canvas || !this.renderer) return;
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    const maxDpr = this.w < 768 ? 1.5 : 2.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.setSize(this.w, this.h, false);

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
  }

  tick(time, deltaTime) {
    if (this.isDisposed || document.hidden) return;

    // Cap delta time to 50ms for smooth simulation during frame skips
    const dt = Math.min((deltaTime || 16.67) / 1000, 0.05);
    const elapsed = time / 1000;

    // Apply rig parameters to camera & root
    const r = this.rig;
    const w = this.w;
    const h = this.h;

    // Dynamic FOV kick from scroll velocity
    const fovKick = THREE.MathUtils.clamp(this.scrollVel / 2500, -1, 1) * 2;
    this.camera.fov = r.fov + fovKick;
    this.camera.position.set(0, r.camY, r.camZ);
    this.camera.lookAt(0, r.lookY, 0);

    // Horizontal placement via setViewOffset (keeps natural perspective without model distortion)
    this.camera.setViewOffset(w, h, -r.shiftX * w * 0.28, 0, w, h);
    this.camera.updateProjectionMatrix();

    if (this.root) {
      // Subtle rotation reaction from scroll speed + director rotY
      this.root.rotation.y = r.rotY + this.scrollVel * 0.00004;
    }

    // Run procedural bone rig and morph updates
    updateRig(this, dt, elapsed);

    // Render 3D frame
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.isDisposed = true;
    gsap.ticker.remove(this.tick);

    if (this.root) {
      this.root.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) {
            o.material.forEach((m) => m.dispose());
          } else {
            o.material.dispose();
          }
        }
      });
      this.scene.remove(this.root);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
