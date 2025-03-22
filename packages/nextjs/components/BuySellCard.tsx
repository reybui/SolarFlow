// packages/nextjs/components/BuySellCard.tsx
import React from "react";

export const BuySellCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-48 w-40 rounded-lg p-4">
      <button className="btn btn-success">Buy</button>
      <button className="btn btn-error">Sell</button>
    </div>
  );
};
