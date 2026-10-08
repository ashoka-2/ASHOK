import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { Observer } from 'gsap/Observer';
import { Draggable } from 'gsap/Draggable';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip, Observer, Draggable);
}

export { gsap, ScrollTrigger, Flip, Observer, Draggable };
export default gsap;
