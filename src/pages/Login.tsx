
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
    <div className="min-h-screen flex items-center justify-center bg-slate-700 px-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-xl">
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
