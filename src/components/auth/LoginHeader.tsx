import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const LoginHeader = () => {
  return (
    <CardHeader className="text-center pb-4 pt-8">
      <div className="flex justify-center mb-4">
        <img 
          alt="Travia Logo" 
          className="h-24 w-auto drop-shadow-lg" 
          src="/lovable-uploads/c7af2edd-ad30-440d-8a82-e27e44ff6b9b.png" 
        />
      </div>
      
      <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3 tracking-tight">
        TRAVIA
      </CardTitle>
      
      <div className="mb-4 overflow-hidden">
        <p className="text-lg font-medium text-slate-700 animate-typing">
          Where Custom Trips Click.
        </p>
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <CardDescription className="text-sm font-medium text-slate-600">
          AI-Powered Travel Platform
        </CardDescription>
        <Sparkles className="w-4 h-4 text-accent" />
      </div>
      
      <CardDescription className="text-xs text-slate-500 mt-3">
        Demo Login - Use any of the emails below
      </CardDescription>
    </CardHeader>
  );
};
