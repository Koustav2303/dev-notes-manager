import { useRef, useState } from 'react';

const HolographicCard = ({ children, isFlipped, backContent }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  // Base 3D transform math based on hover and flip state
  const getTransform = () => {
    if (isFlipped) {
      // When flipped, disable mouse tilt and just show the back
      return 'perspective(1000px) rotateY(180deg)';
    }
    
    if (isHovering && cardRef.current) {
      // Apply mouse tilt when hovering on the front
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((mousePosition.y - centerY) / centerY) * -4;
      const rotateY = ((mousePosition.x - centerX) / centerX) * 4;
      return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    // Default resting state
    return 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        transform: getTransform(),
        transformStyle: 'preserve-3d',
        transition: isHovering && !isFlipped ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="relative group w-full h-[340px] z-10 cursor-default"
    >
      {/* --- FRONT OF CARD --- */}
      <div 
        className="absolute inset-0 w-full h-full rounded-2xl bg-slate-900/60 backdrop-blur-md flex flex-col border border-slate-700/60 group-hover:border-transparent overflow-hidden"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {/* Spotlight Effect */}
        <div 
          className="absolute inset-0 z-0 rounded-2xl pointer-events-none transition-opacity duration-500"
          style={{
            opacity: isHovering && !isFlipped ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.15), transparent 40%)`
          }}
        />
        <div className="relative z-10 flex flex-col h-full">{children}</div>
      </div>

      {/* --- BACK OF CARD (THE SANDBOX) --- */}
      <div 
        className="absolute inset-0 w-full h-full rounded-2xl bg-slate-900/95 backdrop-blur-xl flex flex-col border-2 border-emerald-500/50 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]"
        style={{ 
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)' // This is crucial so it's not mirrored when flipped!
        }}
      >
        {backContent}
      </div>
    </div>
  );
};

export default HolographicCard;