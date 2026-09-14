import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 p-3 rounded-full shadow-2xl border-2 border-slate-950 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group"
      aria-label="Scroll to top of page"
      title="Scroll to top of page"
    >
      <ArrowUp className="w-5 h-5 text-slate-950 font-black group-hover:-translate-y-1 transition-transform" />
    </button>
  );
};
