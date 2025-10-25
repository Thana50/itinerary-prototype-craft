
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { DemoAccountsInfo } from "@/components/auth/DemoAccountsInfo";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginFooter } from "@/components/auth/LoginFooter";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Login = () => {
  useAuthRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden animate-gradient bg-gradient-to-br from-blue-600 via-teal-500 to-purple-600">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-32 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Geometric Patterns */}
        <div className="absolute top-10 right-10 w-32 h-32 border border-white/10 rotate-45 animate-float" />
        <div className="absolute bottom-10 left-10 w-40 h-40 border border-white/10 rounded-full animate-float-delayed" />
      </div>

      {/* Glassmorphism Card */}
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 animate-fade-in relative z-10">
        <LoginHeader />
        <CardContent className="px-8 pb-8">
          <DemoAccountsInfo />
          <LoginForm />
          <LoginFooter />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
