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

    const W = container.clientWidth;
    const H = container.clientHeight;
    // Responsive radius for large standalone logos
    const R = Math.max(34, Math.min(46, W * 0.038));

    const engine = Engine.create({
      gravity: { x: 0, y: 0 }, // zero gravity until user interaction
    });
    engineRef.current = engine;

    // Walls: Floor and side boundaries (no ceiling so tossed items arc naturally)
    const floor = Bodies.rectangle(W / 2, H + 50, W * 2, 100, { isStatic: true });
    const leftWall = Bodies.rectangle(-50, H / 2, 100, H * 4, { isStatic: true });
    const rightWall = Bodies.rectangle(W + 50, H / 2, 100, H * 4, { isStatic: true });
    World.add(engine.world, [floor, leftWall, rightWall]);

    // Initial grid distribution
    const per = Math.max(4, Math.floor((W - 80) / (R * 2.5)));
    const items = [];

    techStack.forEach((tech, i) => {
      const x = 60 + (i % per) * (R * 2.5) + R;
      const y = 90 + Math.floor(i / per) * (R * 2.4) + R;

      const body = Bodies.circle(x, y, R, {
        restitution: 0.55,
        friction: 0.2,
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

    // Mouse drag constraint
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

    // Proximity repulsion force exactly from reference HTML physics
    const handleMouseMove = (e) => {
      if (!startedRef.current) return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      items.forEach((it) => {
        const dx = it.body.position.x - mx;
        const dy = it.body.position.y - my;
        const d = Math.hypot(dx, dy);

        if (d < 150 && d > 1 && !mc.body) {
          const f = (1 - d / 150) * 0.0012 * it.body.mass * 10;
          Body.applyForce(it.body, it.body.position, {
            x: (dx / d) * f,
            y: (dy / d) * f,
          });
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

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
        items.forEach((it) => {
          const el = document.getElementById(`tech-chip-${it.id}`);
          if (el) {
            const p = it.body.position;
            el.style.transform = `translate(${p.x - it.R}px, ${p.y - it.R}px) rotate(${it.body.angle}rad)`;
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
      onMouseEnter={triggerDrop}
      onTouchStart={triggerDrop}
      className="w-full relative py-20 select-none overflow-hidden border-t border-line"
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
