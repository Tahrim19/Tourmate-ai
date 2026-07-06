import { useRef } from 'react';

export default function SpotlightCard({ children, className = "", spotlightColor = "rgba(17, 122, 101, 0.12)" }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden bg-bg-card rounded-2xl border border-[#252525] group transition-all duration-300 before:absolute before:inset-0 before:z-0 before:opacity-0 before:group-hover:opacity-100 before:pointer-events-none before:transition-opacity before:duration-500 before:bg-[radial-gradient(800px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),${spotlightColor},transparent_45%)] ${className}`}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
