import { gsap, ScrollTrigger } from '../../lib/gsap';

/**
 * initHeroAnimations
 * Handles the SplitText-style intro reveal of the giant outlined name,
 * the 300vh runway scroll scrub, and the scroll cue fade-out.
 */
export function initHeroAnimations({
  heroRef,
  titleRef,
  metaRef,
  scrollCueRef,
}) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Entrance Animation
  const letters = titleRef?.current?.querySelectorAll('.hero-letter');
  const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (!prefersReducedMotion && letters && letters.length > 0) {
    entranceTl
      .fromTo(
        letters,
        { y: 70, opacity: 0, rotateX: -25 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.035,
          ease: 'expo.out',
        }
      )
      .fromTo(
        metaRef?.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        scrollCueRef?.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );
  }

  // 2. Scroll Scrub Parallax (pinned / scrubbed over 300vh runway)
  if (heroRef?.current && titleRef?.current) {
    const scrubTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=150%',
        scrub: 0.8,
      },
    });

    scrubTl
      .to(titleRef.current, {
        yPercent: -22,
        scale: 1.10,
        opacity: 0,
        ease: 'power1.inOut',
      }, 0)
      .to(metaRef?.current, {
        opacity: 0,
        y: -30,
        ease: 'power1.inOut',
      }, 0)
      .to(scrollCueRef?.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.out',
      }, 0);
  }

  return () => {
    entranceTl.kill();
  };
}
