import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Toast = ({ message, link, type = 'success', onClose }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    // Slide in from bottom
    gsap.fromTo(toastRef.current, 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
    );

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      gsap.to(toastRef.current, {
        y: 100, opacity: 0, duration: 0.4, ease: "power2.in",
        onComplete: onClose
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200]">
      <div ref={toastRef} className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100' : 'bg-red-500/20 border-red-500/50 text-red-100'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {type === 'success' ? '✓' : '✕'}
        </div>
        <div>
          <p className="font-bold text-sm">{message}</p>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline mt-1 block">
              View live on GitHub &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;