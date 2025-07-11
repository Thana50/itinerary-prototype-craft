
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock, Bug, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugComplete, setDebugComplete] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoutes = {
        agent: '/agent-dashboard',
        traveler: '/traveler-dashboard',
        vendor: '/vendor-dashboard'
      };
      navigate(dashboardRoutes[user.role], { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful! Redirecting...");
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugAuth = async () => {
    setIsDebugging(true);
    setDebugComplete(false);
    console.log('Running authentication debug...');
    
    try {
      const { data, error } = await supabase.functions.invoke('fix-demo-users');
      
      if (error) {
        console.error('Edge function error:', error);
        toast.error('Debug function failed: ' + error.message);
      } else {
        console.log('Debug function result:', data);
        setDebugComplete(true);
        
        // Check if auth tests passed
        const authResults = data?.authTestResults || [];
        const successCount = authResults.filter((r: any) => r.status === 'SUCCESS').length;
        const totalTests = authResults.length;
        
        if (successCount === totalTests) {
          toast.success(`Authentication fix successful! All ${totalTests} demo accounts working.`);
        } else {
          toast.warning(`Debug completed. ${successCount}/${totalTests} accounts working. Check console for details.`);
        }
      }
    } catch (error) {
      console.error('Error calling debug function:', error);
      toast.error('Failed to run debug function');
    } finally {
      setIsDebugging(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-700 px-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-xl">
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
        <CardContent className="px-8 pb-8">
          <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
            <p className="font-medium text-blue-800 mb-1">Demo Accounts:</p>
            <p className="text-blue-700">• agent@demo.com (Travel Agent)</p>
            <p className="text-blue-700">• traveler@demo.com (Traveler)</p>
            <p className="text-blue-700">• vendor@demo.com (Vendor)</p>
            <p className="text-blue-600 text-xs mt-2">Password: demo123</p>
          </div>

          {/* Authentication Status */}
          <div className={`mb-4 p-3 rounded-lg ${debugComplete ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <p className={`text-sm mb-2 ${debugComplete ? 'text-green-800' : 'text-yellow-800'}`}>
              {debugComplete ? (
                <>
                  <CheckCircle className="inline h-4 w-4 mr-1" />
                  Authentication system verified and working
                </>
              ) : (
                'Authentication system status: Run debug to verify'
              )}
            </p>
            <Button 
              onClick={handleDebugAuth}
              disabled={isDebugging}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Bug className="h-4 w-4 mr-2" />
              {isDebugging ? "Running Debug..." : "Verify Authentication"}
            </Button>
          </div>
          
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
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Travia Demo Prototype v0.1
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
