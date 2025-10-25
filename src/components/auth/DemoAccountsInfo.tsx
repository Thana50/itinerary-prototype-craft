
import React from "react";

export const DemoAccountsInfo = () => {
  return (
    <div className="mb-6 p-4 bg-white/5 border border-white/20 backdrop-blur-sm rounded-xl text-sm">
      <p className="font-semibold text-white mb-2">Demo Accounts:</p>
      <div className="space-y-1.5">
        <p className="text-white/80">• agent@demo.com <span className="text-white/60 text-xs">(Travel Agent)</span></p>
        <p className="text-white/80">• traveler@demo.com <span className="text-white/60 text-xs">(Traveler)</span></p>
        <p className="text-white/80">• vendor@demo.com <span className="text-white/60 text-xs">(Vendor)</span></p>
      </div>
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-white/70 text-xs">Password: <span className="font-mono font-medium text-white">demo123</span></p>
      </div>
    </div>
  );
};
