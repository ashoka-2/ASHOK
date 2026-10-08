import React, { useRef, useEffect } from 'react';
import { AvatarScene } from './AvatarScene';
import { initInteractions } from './interactions';

// Module-level singleton instance preventing double WebGL context creation during React 19 StrictMode mounts
let activeSceneInstance = null;

/**
 * AvatarCanvas
 * Persistent React wrapper mounted ONCE at the home page level.
 * Features:
 * - Desktop layering at z-[60] with avatar side-offset to clear content
 * - Mobile layering at z-[1] under sections
 * - StrictMode singleton protection
 * - Automatic WebGL capability gating
 * - Full unmount and cleanup support
 */
export function AvatarCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Hardware concurrency and WebGL check
    const isWeakDevice =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 2;

    const hasWebGL = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        return !!(window.WebGL2RenderingContext && testCanvas.getContext('webgl2'));
      } catch {
        return false;
      }
    })();

    if (isWeakDevice || !hasWebGL) {
      document.documentElement.classList.remove('av');
      return;
    }

    let isCancelled = false;
    let cleanupInteractions = () => {};

    // 2. Initialize or reuse singleton scene
    let scene = activeSceneInstance;
    if (!scene || scene.isDisposed || scene.canvas !== canvas) {
      if (activeSceneInstance && !activeSceneInstance.isDisposed) {
        activeSceneInstance.dispose();
      }
      try {
        scene = new AvatarScene(canvas);
        activeSceneInstance = scene;
      } catch (err) {
        console.warn('[AvatarCanvas] Failed to create WebGL scene:', err);
        document.documentElement.classList.remove('av');
        return;
      }
    }

    // 3. Bind interactions upon 3D readiness
    scene.ready
      .then(() => {
        if (isCancelled || scene.isDisposed) return;
        cleanupInteractions = initInteractions(scene);

        // Preloader check: if preloader is already finished, start intro immediately
        const preloader = document.getElementById('preloader') || document.getElementById('pre');
        if (!preloader || preloader.style.display === 'none' || preloader.classList.contains('hidden')) {
          scene.playIntro();
        } else {
          // Listen for preloader completion event
          const onPreloaderComplete = () => {
            scene.playIntro();
            window.removeEventListener('preloader:complete', onPreloaderComplete);
          };
          window.addEventListener('preloader:complete', onPreloaderComplete);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('[AvatarCanvas] Scene initialization error:', err);
          document.documentElement.classList.remove('av');
        }
      });

    // 4. Resize handling
    const handleResize = () => {
      if (!isCancelled && scene && !scene.isDisposed) {
        scene.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', handleResize);
      cleanupInteractions();
      // If canvas is truly detached from the document, dispose the 3D scene
      setTimeout(() => {
        if (!document.body.contains(canvas) && activeSceneInstance) {
          activeSceneInstance.dispose();
          activeSceneInstance = null;
        }
      }, 150);
    };
  }, []);

  return (
    <canvas
      id="av"
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none select-none block max-md:z-[1] md:z-[60] ${className}`}
      style={{ display: 'block', width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}

export default AvatarCanvas;
