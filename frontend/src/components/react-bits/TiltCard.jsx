import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function TiltCard({ children, className = "", maxTilt = 10 }) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinate from center (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    // Calculate tilt
    setRotateY(relativeX * maxTilt * 2); // horizontal tilt
    setRotateX(-relativeY * maxTilt * 2); // vertical tilt
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
