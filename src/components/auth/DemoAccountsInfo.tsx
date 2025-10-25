import React from "react";
import { Shield } from "lucide-react";

export const DemoAccountsInfo = () => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-primary" />
        <p className="font-semibold text-slate-800">Demo Accounts:</p>
      </div>
      <div className="space-y-1 ml-6">
        <p className="text-slate-700">• agent@demo.com (Travel Agent)</p>
        <p className="text-slate-700">• traveler@demo.com (Traveler)</p>
        <p className="text-slate-700">• vendor@demo.com (Vendor)</p>
      </div>
      <p className="text-slate-600 text-xs mt-3 font-medium">Password: demo123</p>
    </div>
  );
};
