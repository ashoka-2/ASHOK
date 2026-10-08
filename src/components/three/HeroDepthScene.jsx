import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function HeroDepthScene({ isHovered = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // WebGL Renderer with clean alpha transparency
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Textures pointing to the portrait asset system
    const textureLoader = new THREE.TextureLoader();
    const mainTexture = textureLoader.load('/assets/portrait/hero-portrait-main.png');
    const hoverTexture = textureLoader.load('/assets/portrait/hero-portrait-hover.png');
    const depthTexture = textureLoader.load('/assets/portrait/hero-depth-map.png');
    const displacementTexture = textureLoader.load('/assets/portrait/hero-displacement-map.png');
    const lightTexture = textureLoader.load('/assets/portrait/hero-light-mask.png');

    // Clamp texture wrapping
    [mainTexture, hoverTexture, depthTexture, displacementTexture, lightTexture].forEach((t) => {
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
    });

    // Shader Uniforms
    const uniforms = {
      uMainTexture: { value: mainTexture },
      uHoverTexture: { value: hoverTexture },
      uDepthTexture: { value: depthTexture },
      uDisplacementTexture: { value: displacementTexture },
      uLightTexture: { value: lightTexture },
      uMouse: { value: new THREE.Vector2(0, 0) },            // Global 2.5D depth parallax
      uTargetMouse: { value: new THREE.Vector2(0, 0) },
      uCursorUV: { value: new THREE.Vector2(0.5, 0.5) },      // Local lens center
      uTargetCursorUV: { value: new THREE.Vector2(0.5, 0.5) },
      uMaskIntensity: { value: 0.0 },                         // 0.0 outside -> 1.0 inside
      uTargetMaskIntensity: { value: 0.0 },
      uRadius: { value: 0.22 },                               // Lens radius in UV space (~140px)
      uAspect: { value: width / height },                     // Geometric aspect ratio
      uTime: { value: 0.0 },
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uMainTexture;
      uniform sampler2D uHoverTexture;
      uniform sampler2D uDepthTexture;
      uniform sampler2D uDisplacementTexture;
      uniform sampler2D uLightTexture;
      uniform vec2 uMouse;
      uniform vec2 uCursorUV;
      uniform float uMaskIntensity;
      uniform float uRadius;
      uniform float uAspect;
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        // 1. Existing 2.5D Depth Parallax across the entire portrait (ALWAYS ACTIVE)
        float depth = texture2D(uDepthTexture, vUv).r;
        vec2 parallax = uMouse * (depth * 0.038);
        vec2 uv = clamp(vUv + parallax, 0.001, 0.999);

        // Sample base portrait
        vec4 baseColor = texture2D(uMainTexture, uv);

        if (baseColor.a < 0.01) {
          gl_FragColor = vec4(0.0);
          return;
        }

        // 2. Localized Cursor Interaction Lens
        // Correct horizontal distance by aspect ratio so lens is a true circle
        vec2 diff = (uv - uCursorUV);
        diff.x *= uAspect;
        float dist = length(diff);

        // Soft smoothstep falloff: 1.0 at center, 0.0 at edge
        float lensMask = smoothstep(uRadius, uRadius * 0.15, dist) * uMaskIntensity;

        // 3. Inside Cursor Lens: Local Displacement only
        float dispVal = texture2D(uDisplacementTexture, uv).r;
        vec2 localDisp = vec2(
          (dispVal - 0.5) * 0.045 * lensMask,
          sin(uv.y * 35.0 + uTime * 3.0) * 0.006 * lensMask
        );
        vec2 morphUv = clamp(uv + localDisp, 0.001, 0.999);

        // 4. Inside Cursor Lens: Sample Digital Developer Morph with subtle chromatic aberration
        float ca = 0.006 * lensMask;
        float r = texture2D(uHoverTexture, morphUv + vec2(ca, 0.0)).r;
        float g = texture2D(uHoverTexture, morphUv).g;
        float b = texture2D(uHoverTexture, morphUv - vec2(ca, 0.0)).b;
        float a = texture2D(uHoverTexture, morphUv).a;
        vec4 digitalColor = vec4(r, g, b, a);

        // 5. Embedded subtle tech particles and code matrix grid inside lens
        float grid = step(0.93, fract(morphUv.x * 50.0)) * step(0.93, fract(morphUv.y * 50.0));
        float noise = fract(sin(dot(morphUv + fract(uTime * 0.25), vec2(12.9898, 78.233))) * 43758.5453);
        vec3 particleAura = vec3(0.22, 0.90, 0.0) * (grid * 0.3 + noise * 0.12) * lensMask;

        // Interactive rim light mask inside lens
        float rim = texture2D(uLightTexture, uv).r * lensMask * 0.3;

        // 6. Final composite:
        // OUTSIDE lens (lensMask == 0): 100% original portrait + depth parallax!
        // INSIDE lens: reveals digital morph, local displacement, code & particles!
        vec4 finalColor = mix(baseColor, digitalColor, lensMask);
        finalColor.rgb += vec3(0.22, 0.90, 0.0) * rim + particleAura;
        finalColor.a = baseColor.a;

        gl_FragColor = finalColor;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse Tracking: Global 2.5D Parallax + Local Lens UV
    const handleMouseMove = (e) => {
      // 1. Global parallax mouse (-1 to 1 across window)
      const globalX = (e.clientX / window.innerWidth) * 2 - 1;
      const globalY = -((e.clientY / window.innerHeight) * 2 - 1);
      uniforms.uTargetMouse.value.set(globalX, globalY);

      // 2. Local cursor UV inside portrait container
      const rect = container.getBoundingClientRect();
      const uvX = (e.clientX - rect.left) / rect.width;
      const uvY = 1.0 - ((e.clientY - rect.top) / rect.height);

      const isInside = uvX >= 0.0 && uvX <= 1.0 && uvY >= 0.0 && uvY <= 1.0;

      if (isInside) {
        uniforms.uTargetCursorUV.value.set(uvX, uvY);
        uniforms.uTargetMaskIntensity.value = 1.0;
      } else {
        uniforms.uTargetMaskIntensity.value = 0.0;
      }
    };

    const handleMouseLeave = () => {
      uniforms.uTargetMaskIntensity.value = 0.0;
      uniforms.uTargetMouse.value.set(0, 0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let animationFrameId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      uniforms.uTime.value += delta;

      // Smooth inertia for global 2.5D depth parallax
      uniforms.uMouse.value.lerp(uniforms.uTargetMouse.value, 0.06);

      // Smooth tracking for local cursor lens UV
      uniforms.uCursorUV.value.lerp(uniforms.uTargetCursorUV.value, 0.12);

      // Smooth fade for lens intensity (enter 200-300ms, exit 400-500ms)
      const lerpSpeed = uniforms.uTargetMaskIntensity.value > 0.5 ? 0.09 : 0.05;
      uniforms.uMaskIntensity.value += (uniforms.uTargetMaskIntensity.value - uniforms.uMaskIntensity.value) * lerpSpeed;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
      uniforms.uAspect.value = newWidth / newHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-end justify-center pointer-events-none select-none overflow-hidden"
    />
  );
}

export default HeroDepthScene;
