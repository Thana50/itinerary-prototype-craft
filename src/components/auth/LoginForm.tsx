
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Login: Attempting login for:', email);
      await login(email, password);
      toast.success("Login successful! Redirecting...");
      onSuccess?.();
    } catch (error: any) {
      console.error('Login: Login failed:', error);
      
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Please check your email and click the confirmation link before signing in.');
      } else if (error.message?.includes('Database error')) {
        toast.error('Authentication system error. Please try again later.');
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 font-medium">
          Email Address
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            id="email" 
            type="email" 
            placeholder="agent@demo.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-lg" 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-700 font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            id="password" 
            type="password" 
            placeholder="demo123" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-lg" 
            required 
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe} 
            onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
          />
          <Label htmlFor="remember" className="text-sm text-slate-600">
            Remember me
          </Label>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
};
