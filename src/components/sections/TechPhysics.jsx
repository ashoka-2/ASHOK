import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { techStack } from '../../data/tech';
import { Icon } from '@iconify/react';
import { SectionLabel } from '../ui/SectionLabel';

export function TechPhysics() {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const itemsRef = useRef([]);
  const mcRef = useRef(null);
  const startedRef = useRef(false);
  const [elements, setElements] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { Engine, World, Bodies, Body, Mouse, MouseConstraint } = Matter;

    const updateDimensionsAndWalls = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      if (!W || !H) return { W: 800, H: 600, R: 38 };

      const isMobile = W < 640;
      const isTablet = W >= 640 && W < 1024;

      let R;
      if (isMobile) {
        R = Math.max(21, Math.min(25, Math.floor(W * 0.058)));
      } else if (isTablet) {
        R = Math.max(28, Math.min(34, Math.floor(W * 0.04)));
      } else {
        R = Math.max(38, Math.min(46, Math.floor(W * 0.035)));
      }

      return { W, H, R, isMobile, isTablet };
    };

    const { W, H, R, isMobile, isTablet } = updateDimensionsAndWalls();

    const engine = Engine.create({
      gravity: { x: 0, y: 0 }, // zero gravity until user interaction
    });
    engineRef.current = engine;

    // Walls: 4 thick boundary walls positioned 8px inside container bounds so bodies never penetrate or clip
    const wallThick = 150;
    const floor = Bodies.rectangle(W / 2, H + wallThick / 2 - 8, W * 3, wallThick, { isStatic: true });
    const ceiling = Bodies.rectangle(W / 2, -wallThick / 2 + 8, W * 3, wallThick, { isStatic: true });
    const leftWall = Bodies.rectangle(-wallThick / 2 + 8, H / 2, wallThick, H * 3, { isStatic: true });
    const rightWall = Bodies.rectangle(W + wallThick / 2 - 8, H / 2, wallThick, H * 3, { isStatic: true });
    World.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // Initial grid distribution: neatly distributed inside the upper portion of the container
    const gapX = isMobile ? R * 2.25 : R * 2.4;
    const gapY = isMobile ? R * 2.25 : R * 2.35;
    const minCols = isMobile ? 6 : (isTablet ? 8 : 9);
    const maxCols = Math.max(minCols, Math.floor((W - 32) / gapX));
    const cols = Math.min(maxCols, isMobile ? 6 : (isTablet ? 9 : 12));
    const totalGridW = (cols - 1) * gapX;
    const startX = Math.max(R + 12, (W - totalGridW) / 2);
    const startY = isMobile ? 32 + R : (isTablet ? 42 + R : 56 + R);

    const items = [];

    techStack.forEach((tech, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * gapX;
      const y = startY + row * gapY;

      const body = Bodies.circle(x, y, R, {
        restitution: 0.5,
        friction: 0.25,
        frictionAir: 0.02,
        density: 0.002,
      });

      World.add(engine.world, body);
      items.push({
        ...tech,
        body,
        R,
      });
    });

    itemsRef.current = items;
    setElements(items);

    // Mouse & Touch drag constraint
    const mouse = Mouse.create(container);
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.15,
        render: { visible: false },
      },
    });
    mcRef.current = mc;
    World.add(engine.world, mc);

    // Proximity repulsion force exactly from reference HTML physics (supports mouse & touch)
    const handlePointerRepulsion = (clientX, clientY) => {
      if (!startedRef.current) return;
      const rect = container.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const repRadius = isMobile ? 110 : 150;

      items.forEach((it) => {
        const dx = it.body.position.x - mx;
        const dy = it.body.position.y - my;
        const d = Math.hypot(dx, dy);

        if (d < repRadius && d > 1 && !mc.body) {
          const f = (1 - d / repRadius) * (isMobile ? 0.0009 : 0.0012) * it.body.mass * 10;
          Body.applyForce(it.body, it.body.position, {
            x: (dx / d) * f,
            y: (dy / d) * f,
          });
        }
      });
    };

    const handleMouseMove = (e) => {
      handlePointerRepulsion(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handlePointerRepulsion(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle Window Resize dynamically
    const handleResize = () => {
      const curW = container.clientWidth;
      const curH = container.clientHeight;
      if (!curW || !curH) return;

      Body.setPosition(floor, { x: curW / 2, y: curH + wallThick / 2 - 8 });
      Body.setPosition(ceiling, { x: curW / 2, y: -wallThick / 2 + 8 });
      Body.setPosition(leftWall, { x: -wallThick / 2 + 8, y: curH / 2 });
      Body.setPosition(rightWall, { x: curW + wallThick / 2 - 8, y: curH / 2 });

      // Keep bodies safely inside new boundaries
      items.forEach((it) => {
        const px = Math.max(it.R + 8, Math.min(curW - it.R - 8, it.body.position.x));
        const py = Math.max(it.R + 8, Math.min(curH - it.R - 8, it.body.position.y));
        Body.setPosition(it.body, { x: px, y: py });
      });
    };

    window.addEventListener('resize', handleResize);

    // Visibility observer & 60fps physics simulation loop
    let animId;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const loop = () => {
      if (isVisible) {
        Engine.update(engine, 1000 / 60);

        const currentW = container.clientWidth;
        const currentH = container.clientHeight;

        items.forEach((it) => {
          const p = it.body.position;
          let clampedX = p.x;
          let clampedY = p.y;
          let needsClamp = false;

          const minX = it.R + 8;
          const maxX = currentW - it.R - 8;
          const minY = it.R + 8;
          const maxY = currentH - it.R - 8;

          if (p.x < minX) {
            clampedX = minX;
            needsClamp = true;
            if (it.body.velocity.x < 0) {
              Body.setVelocity(it.body, { x: -it.body.velocity.x * 0.4, y: it.body.velocity.y });
            }
          } else if (p.x > maxX) {
            clampedX = maxX;
            needsClamp = true;
            if (it.body.velocity.x > 0) {
              Body.setVelocity(it.body, { x: -it.body.velocity.x * 0.4, y: it.body.velocity.y });
            }
          }

          if (p.y < minY) {
            clampedY = minY;
            needsClamp = true;
            if (it.body.velocity.y < 0) {
              Body.setVelocity(it.body, { x: it.body.velocity.x, y: -it.body.velocity.y * 0.4 });
            }
          } else if (p.y > maxY) {
            clampedY = maxY;
            needsClamp = true;
            if (it.body.velocity.y > 0) {
              Body.setVelocity(it.body, { x: it.body.velocity.x * 0.8, y: -it.body.velocity.y * 0.2 });
            }
          }

          if (needsClamp) {
            Body.setPosition(it.body, { x: clampedX, y: clampedY });
          }

          const el = document.getElementById(`tech-chip-${it.id}`);
          if (el) {
            el.style.transform = `translate(${clampedX - it.R}px, ${clampedY - it.R}px) rotate(${it.body.angle}rad)`;
          }
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  const triggerDrop = () => {
    if (startedRef.current || !engineRef.current) return;
    startedRef.current = true;
    setHasStarted(true);
    engineRef.current.gravity.y = 1;

    // Scatter impulse on initial drop
    itemsRef.current.forEach((it) => {
      Matter.Body.setVelocity(it.body, {
        x: (Math.random() - 0.5) * 4,
        y: 0,
      });
    });
  };

  return (
    <section
      data-avatar-shot="full"
      data-avatar-side="left"
      data-avatar-pose="present"
      onMouseEnter={triggerDrop}
      onTouchStart={triggerDrop}
      className="w-full relative py-20 select-none overflow-hidden border-t border-line z-20"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <SectionLabel number="03" label="TECH PHYSICS ENGINE" />
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-fg">
            Interactive rigid-body stack.
          </h2>
        </div>
        <div className="font-mono text-xs text-fg-muted flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span>{hasStarted ? "GRAVITY: ACTIVE // THROW TO SCATTER" : "HOVER OR TAP TO ACTIVATE GRAVITY"}</span>
        </div>
      </div>

      {/* Physics Interactive Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[580px] sm:h-[660px] bg-bg-surface/20 border-y border-line overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {elements.map((item) => (
          <div
            key={item.id}
            id={`tech-chip-${item.id}`}
            title={item.label}
            className="absolute top-0 left-0 flex items-center justify-center select-none pointer-events-none transition-transform hover:scale-125"
            style={{
              width: item.R * 2,
              height: item.R * 2,
              willChange: 'transform',
            }}
          >
            {/* Standalone Large Logo Icon — No Box, Pure Logo with Brand Glow */}
            <Icon
              icon={item.icon}
              className="w-[84%] h-[84%] pointer-events-none transition-transform duration-300"
              style={{
                color: item.color,
                filter: `drop-shadow(0 6px 14px ${item.color}45) drop-shadow(0 2px 4px rgba(0,0,0,0.35))`,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default TechPhysics;
