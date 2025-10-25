import React from "react";
import { Shield, Users, Lock } from "lucide-react";

export const LoginFooter = () => {
  return (
    <div className="mt-8 space-y-4">
      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-6 py-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-slate-600">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">Trusted by 500+ Agencies</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium">Enterprise Security</span>
        </div>
      </div>
      
      {/* Version Info */}
      <div className="text-center">
        <p className="text-xs text-slate-400 font-medium">
          Travia Demo Platform v1.0
        </p>
      </div>
    </div>
  );
};
