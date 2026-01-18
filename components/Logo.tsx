import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* The Serif V - Light Gray/Silver */}
        <path 
          d="M25 35H38L48 72L58 35H71L55 80H41L25 35Z" 
          fill="#E2E8F0" 
          className="opacity-90"
        />
        {/* The Golden Arrow - Slashing upwards */}
        <path 
          d="M28 82L78 32H64V22H88V46H78V36L28 86L28 82Z" 
          fill="#D4AF37" 
          className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
        />
      </svg>
    </div>
  );
};

export default Logo;