import { useRef, useState } from 'react';

const HolographicCard = ({ children }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [transformStyle, setTransformStyle] = useState('');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X relative to the card
    const y = e.clientY - rect.top;  // Mouse Y relative to the card

    setMousePosition({ x, y });

    // Calculate 3D tilt math
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4; // Max rotation of 4 degrees
    const rotateY = ((x - centerX) / centerX) * 4;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseEnter = () => setIsHovering(true);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
      className="relative group rounded-2xl bg-slate-900/60 backdrop-blur-md flex flex-col h-[340px] z-10"
    >
      {/* --- The Magical Mouse Spotlight Border --- */}
      <div 
        className="absolute inset-0 z-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.15), transparent 40%)`
        }}
      />
      
      {/* --- The Inner Highlight (Shines on the glass) --- */}
      <div 
        className="absolute inset-[1px] z-0 rounded-2xl pointer-events-none transition-opacity duration-500 bg-slate-900/90"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.04), transparent 40%)`
        }}
      />

      {/* The actual content sits on top of the effects */}
      <div className="relative z-10 flex flex-col h-full border border-slate-700/60 group-hover:border-transparent rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default HolographicCard;