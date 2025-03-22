import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface EnergyContextType {
  energy: number;
  targetEnergy: number;
  maxEnergy: number;
  setTargetEnergy: (value: number) => void;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [energy, setEnergy] = useState(0); // Current displayed value (for animation)
  const [targetEnergy, setTargetEnergy] = useState(50); // Target value
  const maxEnergy = 100;

  // Animation effect to smoothly change the displayed energy value
  useEffect(() => {
    let animationFrame: number;

    const animateToTarget = () => {
      setEnergy(current => {
        // If we're close enough, just set to target value
        if (Math.abs(current - targetEnergy) < 0.5) return targetEnergy;

        // Otherwise, move towards target value gradually
        const step = (targetEnergy - current) * 0.1;
        return current + step;
      });

      // Continue animation if we haven't reached target
      if (Math.abs(energy - targetEnergy) > 0.1) {
        animationFrame = requestAnimationFrame(animateToTarget);
      }
    };

    animationFrame = requestAnimationFrame(animateToTarget);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetEnergy, energy]);

  return (
    <EnergyContext.Provider value={{ energy, targetEnergy, maxEnergy, setTargetEnergy }}>
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = (): EnergyContextType => {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error("useEnergy must be used within an EnergyProvider");
  }
  return context;
};
