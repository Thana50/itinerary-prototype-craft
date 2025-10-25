
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock, Loader2 } from "lucide-react";
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
  const [loginError, setLoginError] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setLoginError(false);

    // Validate input before submission
    try {
      const validatedData: LoginInput = loginSchema.parse({ email, password });
      
      setIsLoading(true);
      
      await login(validatedData.email, validatedData.password);
      toast.success("Login successful! Redirecting...");
      onSuccess?.();
    } catch (error: any) {
      setLoginError(true);
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
    <form onSubmit={handleSubmit} className={`space-y-6 ${loginError ? 'animate-shake' : ''}`}>
      {/* Email Input with Floating Label */}
      <div className="relative">
        <div className="relative">
          <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            emailFocused ? 'text-white' : 'text-white/60'
          }`} />
          <Input 
            id="email" 
            type="email" 
            placeholder=" "
            value={email} 
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            onChange={(e) => {
              setEmail(e.target.value);
              setValidationErrors((prev) => ({ ...prev, email: '' }));
              setLoginError(false);
            }} 
            className={`pl-12 h-14 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-transparent backdrop-blur-sm transition-all duration-300 focus:border-white/60 focus:bg-white/15 ${
              validationErrors.email ? 'border-red-400 animate-glow-pulse' : ''
            } ${emailFocused ? 'shadow-lg shadow-white/20' : ''}`}
            required 
          />
          <Label 
            htmlFor="email" 
            className={`absolute left-12 transition-all duration-300 pointer-events-none ${
              email || emailFocused 
                ? 'top-2 text-xs text-white/80' 
                : 'top-1/2 -translate-y-1/2 text-base text-white/60'
            }`}
          >
            Email Address
          </Label>
        </div>
        {validationErrors.email && (
          <p className="text-sm text-red-300 mt-2 ml-1 animate-fade-in">{validationErrors.email}</p>
        )}
      </div>
      
      {/* Password Input with Floating Label */}
      <div className="relative">
        <div className="relative">
          <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            passwordFocused ? 'text-white' : 'text-white/60'
          }`} />
          <Input 
            id="password" 
            type="password" 
            placeholder=" "
            value={password} 
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onChange={(e) => {
              setPassword(e.target.value);
              setValidationErrors((prev) => ({ ...prev, password: '' }));
              setLoginError(false);
            }} 
            className={`pl-12 h-14 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-transparent backdrop-blur-sm transition-all duration-300 focus:border-white/60 focus:bg-white/15 ${
              validationErrors.password ? 'border-red-400 animate-glow-pulse' : ''
            } ${passwordFocused ? 'shadow-lg shadow-white/20' : ''}`}
            required 
          />
          <Label 
            htmlFor="password" 
            className={`absolute left-12 transition-all duration-300 pointer-events-none ${
              password || passwordFocused 
                ? 'top-2 text-xs text-white/80' 
                : 'top-1/2 -translate-y-1/2 text-base text-white/60'
            }`}
          >
            Password
          </Label>
        </div>
        {validationErrors.password && (
          <p className="text-sm text-red-300 mt-2 ml-1 animate-fade-in">{validationErrors.password}</p>
        )}
      </div>

      {/* Remember Me Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <Checkbox 
            id="remember" 
            checked={rememberMe} 
            onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
            className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-primary transition-all duration-300 group-hover:border-white/60"
          />
          <Label htmlFor="remember" className="text-sm text-white/80 cursor-pointer transition-colors duration-300 group-hover:text-white">
            Remember me
          </Label>
        </div>
      </div>

      {/* Submit Button with Loading State */}
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full h-14 bg-white text-primary hover:bg-white/90 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Signing In...</span>
          </div>
        ) : (
          <>
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </>
        )}
      </Button>
    </form>
  );
};
