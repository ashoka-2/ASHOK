import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { gsap } from "../../lib/gsap";

export function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  href,
  to,
  className,
  onClick,
  icon,
  iconRight,
  ...props
}) {
  const btnRef = useRef(null);

  // Magnetic hover effect on desktop
  const handleMouseMove = (e) => {
    if (!btnRef.current || window.innerWidth < 768) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btnRef.current, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  };

  const baseStyles =
    "relative inline-flex items-center justify-center font-medium font-display tracking-tight transition-all duration-300 select-none overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  const sizeStyles = {
    sm: "text-xs px-4 py-1.5 rounded-full gap-2",
    md: "text-sm px-6 py-2.5 rounded-full gap-2.5",
    lg: "text-base px-8 py-3.5 rounded-full gap-3",
    icon: "p-3 rounded-full",
  };

  const variantStyles = {
    primary:
      "bg-accent text-accent-on font-semibold hover:shadow-[0_0_24px_rgba(57,230,0,0.4)] active:scale-95",
    secondary:
      "bg-bg-elev/80 backdrop-blur-md text-fg border border-line hover:border-accent hover:text-accent active:scale-95",
    ghost: "text-fg-muted hover:text-accent bg-transparent active:scale-95",
    icon: "bg-bg-elev/80 backdrop-blur-md text-fg border border-line hover:border-accent hover:text-accent active:scale-90",
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size] || sizeStyles.md,
    variantStyles[variant] || variantStyles.primary,
    className,
  );

  const content = (
    <>
      {icon && (
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
          {icon}
        </span>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {iconRight && (
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          {iconRight}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        ref={btnRef}
        className={combinedClasses}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        {...props}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        ref={btnRef}
        className={combinedClasses}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={btnRef}
      className={combinedClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}
