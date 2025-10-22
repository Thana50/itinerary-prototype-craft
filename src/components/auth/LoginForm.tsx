
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/validationSchemas";
import { ZodError } from "zod";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate input before submission
    try {
      const validatedData: LoginInput = loginSchema.parse({ email, password });
      
      setIsLoading(true);
      
      await login(validatedData.email, validatedData.password);
      toast.success("Login successful! Redirecting...");
      onSuccess?.();
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setValidationErrors(errors);
        toast.error("Please check your input");
      } else if (error.message?.includes('Invalid login credentials')) {
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
            onChange={(e) => {
              setEmail(e.target.value);
              setValidationErrors((prev) => ({ ...prev, email: '' }));
            }} 
            className={`pl-10 h-12 bg-gray-50 border-gray-200 rounded-lg ${validationErrors.email ? 'border-red-500' : ''}`}
            required 
          />
        </div>
        {validationErrors.email && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
        )}
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
            onChange={(e) => {
              setPassword(e.target.value);
              setValidationErrors((prev) => ({ ...prev, password: '' }));
            }} 
            className={`pl-10 h-12 bg-gray-50 border-gray-200 rounded-lg ${validationErrors.password ? 'border-red-500' : ''}`}
            required 
          />
        </div>
        {validationErrors.password && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
        )}
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
