import React, { useRef, useEffect, useState } from 'react';
import { AvatarScene } from './AvatarScene';
import { buildDirector } from './director';
import { initInteractions } from './interactions';

/**
 * AvatarCanvas
 * Mounted ONCE at the Home page level to host the full-screen 3D WebGL avatar.
 * Survives across all home sections, staying pinned at z-10 while sections scroll over/under it.
 */
export function AvatarCanvas({ className = '' }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanupDirector = () => {};
    let cleanupInteractions = () => {};

    try {
      // 1. Initialize WebGL Scene
      const scene = new AvatarScene(canvas);
      sceneRef.current = scene;

      // 2. Once 3D assets are loaded, bind director timeline and interactions
      scene.ready
        .then(() => {
          cleanupDirector = buildDirector(scene);
          cleanupInteractions = initInteractions(scene);
        })
        .catch((err) => {
          console.error('[AvatarCanvas] Failed to initialize avatar scene:', err);
          setHasError(true);
        });

      // 3. Resize handling
      const handleResize = () => {
        scene.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cleanupDirector();
        cleanupInteractions();
        scene.dispose();
        sceneRef.current = null;
      };
    } catch (err) {
      console.error('[AvatarCanvas] WebGL context initialization error:', err);
      setHasError(true);
    }
  }, []);

  if (hasError) {
    // Graceful fallback: legacy static poster
    return (
      <div className="fixed inset-0 pointer-events-none z-10 flex items-end justify-center">
        <img
          src="/assets/portrait/hero-portrait-main.png"
          alt="Ashok Kumar"
          className="max-h-[85vh] object-contain opacity-80"
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-10 ${className}`}
      aria-hidden="true"
    />
  );
}

export default AvatarCanvas;
