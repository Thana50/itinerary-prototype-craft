
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const LoginHeader = () => {
  return (
    <CardHeader className="text-center pb-2">
      <div className="flex justify-center mb-6">
        <img 
          alt="Travia Logo" 
          className="h-20 w-auto" 
          src="/lovable-uploads/c7af2edd-ad30-440d-8a82-e27e44ff6b9b.png" 
        />
      </div>
      <CardTitle className="text-2xl font-bold text-slate-700 mb-2">
        Travel Platform Login
      </CardTitle>
      <CardDescription className="text-slate-500">
        Demo Login - Use any of the emails below
      </CardDescription>
    </CardHeader>
  );
};
