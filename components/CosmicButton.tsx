import React, { useRef, useState, useEffect, useMemo } from 'react';

interface CosmicButtonProps {
  onClick?: () => void;
  label?: string;
  cameraEnabled?: boolean;
}

export const CosmicButton: React.FC<CosmicButtonProps> = ({ 
  onClick, 
  label = "Get Started",
  cameraEnabled = false
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Initialize Camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    const manageCamera = async () => {
      if (cameraEnabled) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.warn("Camera access denied or not available:", err);
        }
      } else {
        // If camera is disabled, ensure we stop the tracks and clear src
        if (videoRef.current) {
          const currentStream = videoRef.current.srcObject as MediaStream;
          if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
          }
          videoRef.current.srcObject = null;
        }
      }
    };

    manageCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraEnabled]);

  // Handle mouse movement to update the light position coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative inline-flex items-center justify-center rounded-full outline-none transition-transform active:scale-95"
      style={{
        // Using CSS variables for performant style updates
        '--x': `${mousePosition.x}px`,
        '--y': `${mousePosition.y}px`,
      } as React.CSSProperties}
    >
      {/* 
        Layer 1: The Outer Glow (Backlight)
        This creates the diffused light behind the button 
      */}
      <div 
        className={`absolute inset-0 -z-10 rounded-full transition-opacity duration-500 ${isHovered ? 'opacity-40' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(100px circle at var(--x) var(--y), rgba(255, 255, 255, 0.4), transparent 60%)`,
          filter: 'blur(15px)'
        }}
      />

      {/* 
        Layer 2: The Border Light Container 
        This div is slightly larger or uses padding to create the border effect.
        We use a gradient mask to make the light "stick" to the border.
      */}
      <div className="relative rounded-full p-[1.5px] overflow-hidden bg-neutral-900/80 shadow-2xl ring-1 ring-white/10">
        
        {/* The Moving Light on the Border */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(120px circle at var(--x) var(--y), rgba(255, 255, 255, 0.9), transparent 40%)`
          }}
        />

        {/* 
          Layer 3: The Inner Button Body (The "Pill") 
          This sits on top of the border gradient to create the "hollow" look.
        */}
        <div className="relative py-5 px-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
          
          {/* CAMERA MIRROR LAYER */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${cameraEnabled ? 'opacity-100 blur-[2px]' : 'opacity-0'}`}>
             <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover opacity-50 scale-x-[-1] pointer-events-none filter blur-[2px] grayscale-[0.2]"
            />
          </div>

          {/* Fallback dark background when camera is off to keep it readable */}
           <div className={`absolute inset-0 bg-neutral-900 transition-opacity duration-700 ${cameraEnabled ? 'opacity-50' : 'opacity-100'}`} />

          {/* Inner Fog/Smoke Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen">
             <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 animate-float-slow blur-xl" />
          </div>

          {/* Mouse Follow Light - Inner Reflection */}
          {/* This gives the glass surface effect inside the button */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(150px circle at var(--x) var(--y), rgba(255, 255, 255, 0.15), transparent 60%)`
            }}
          />
          
          {/* Top Highlight (Glass Reflection) */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30" />

          {/* Particles */}
          <ParticleSystem />

          {/* Content: Text */}
          <span className="relative z-10 text-3xl font-normal text-white tracking-wide select-none drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300">
            {label}
          </span>
        </div>
      </div>
    </button>
  );
};

// Enhanced Particle System with more sparkles
const ParticleSystem: React.FC = () => {
  // Generate a stable set of random particles
  const particles = useMemo(() => {
    return Array.from({ length: 13 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() < 0.3 ? 'w-1 h-1' : 'w-0.5 h-0.5', // Mix of tiny and small dots
      animation: Math.random() > 0.5 ? 'animate-pulse' : 'animate-float-fast',
      delay: `${Math.random() * 2}s`,
      opacity: 0.3 + Math.random() * 0.5 // Random opacity between 0.3 and 0.8
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div 
          key={p.id}
          className={`absolute bg-white rounded-full ${p.size} ${p.animation}`}
          style={{
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            animationDelay: p.delay,
            boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)'
          }}
        />
      ))}
    </div>
  );
};