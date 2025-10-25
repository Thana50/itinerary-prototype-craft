
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { DemoAccountsInfo } from "@/components/auth/DemoAccountsInfo";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginFooter } from "@/components/auth/LoginFooter";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Badge } from "@/components/ui/badge";

const Login = () => {
  useAuthRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))]">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Demo Version Badge */}
      <Badge className="absolute top-6 right-6 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold animate-glow">
        Demo Version v1.0
      </Badge>

      {/* Login Card */}
      <Card className="w-full max-w-md glass-card rounded-3xl shadow-2xl relative z-10 animate-fade-in">
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
