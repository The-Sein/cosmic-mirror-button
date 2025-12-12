import React, { useMemo, useState } from "react";
import { CosmicButton } from "./components/CosmicButton";

const Starfield: React.FC = () => {
  // Generate random stars on mount to avoid re-renders moving them
  const stars = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() > 0.8 ? "w-1 h-1" : "w-0.5 h-0.5",
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute bg-white rounded-full opacity-0 animate-pulse ${star.size}`}
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
};

// Simple Toggle Switch Component
const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange }) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/20 ${
        checked ? "bg-indigo-600" : "bg-neutral-800 border border-neutral-700"
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
};

const App: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(true);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Grid Background Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(circle at center, black 40%, transparent 100%)",
        }}
      />

      {/* Ambient center glow for atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neutral-800/20 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 p-12 flex flex-col items-center gap-24">
        <CosmicButton
          onClick={() => console.log("Clicked!")}
          cameraEnabled={isCameraActive}
        />

        {/* Controls */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 bg-neutral-900/50 backdrop-blur-sm px-5 py-2 rounded-full border border-white/5">
            <span
              className={`text-xs uppercase tracking-wider font-medium transition-colors ${
                isCameraActive ? "text-white" : "text-neutral-500"
              }`}
            >
              Camera Mode
            </span>
            <ToggleSwitch
              checked={isCameraActive}
              onChange={setIsCameraActive}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
