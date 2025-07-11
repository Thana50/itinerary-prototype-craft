
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
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
  const [systemStatus, setSystemStatus] = useState<'unknown' | 'healthy' | 'warning' | 'error'>('unknown');
  const [statusMessage, setStatusMessage] = useState('System status unknown - run verification to check');
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
      console.log('Login: Attempting login for:', email);
      await login(email, password);
      toast.success("Login successful! Redirecting...");
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      console.error('Login: Login failed:', error);
      
      // Provide specific error messages based on error type
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Please check your email and click the confirmation link before signing in.');
      } else if (error.message?.includes('Database error')) {
        toast.error('Authentication system error. Please try the system verification first.');
        setSystemStatus('error');
        setStatusMessage('Database error detected - authentication system needs attention');
      } else {
        toast.error(error.message || "Login failed. Please try again or run system verification.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemCheck = async () => {
    setIsDebugging(true);
    setSystemStatus('unknown');
    setStatusMessage('Running comprehensive system verification...');
    console.log('Login: Starting comprehensive system verification...');
    
    try {
      // First check the health function
      console.log('Login: Checking auth schema health...');
      const { data: healthData, error: healthError } = await supabase.rpc('check_auth_schema_health');
      
      if (healthError) {
        console.error('Login: Health check failed:', healthError);
        setSystemStatus('error');
        setStatusMessage('Health check failed: ' + healthError.message);
        toast.error('System health check failed: ' + healthError.message);
        return;
      }
      
      console.log('Login: Health check result:', healthData);
      
      // Then run the comprehensive demo users check
      console.log('Login: Running demo users verification...');
      const { data, error } = await supabase.functions.invoke('fix-demo-users');
      
      if (error) {
        console.error('Login: Demo users check error:', error);
        setSystemStatus('error');
        setStatusMessage('Demo users verification failed: ' + error.message);
        toast.error('System verification failed: ' + error.message);
        return;
      }
      
      console.log('Login: Demo users check result:', data);
      
      // Analyze results
      const authResults = data?.authTestResults || [];
      const successCount = authResults.filter((r: any) => r.status === 'SUCCESS').length;
      const totalTests = authResults.length;
      const publicUsersCount = data?.publicUsers || 0;
      
      if (totalTests === 0) {
        setSystemStatus('warning');
        setStatusMessage('No demo accounts found for testing');
        toast.warning('System verification completed but no demo accounts were tested.');
      } else if (successCount === totalTests) {
        setSystemStatus('healthy');
        setStatusMessage(`All systems operational! ${totalTests} demo accounts verified, ${publicUsersCount} users in database.`);
        toast.success(`✅ Authentication system fully operational! All ${totalTests} demo accounts working perfectly.`);
      } else if (successCount > 0) {
        setSystemStatus('warning');
        setStatusMessage(`Partial functionality: ${successCount}/${totalTests} accounts working. ${publicUsersCount} users in database.`);
        toast.warning(`⚠️ System partially working: ${successCount}/${totalTests} demo accounts functional.`);
      } else {
        setSystemStatus('error');
        setStatusMessage(`Authentication system failure: 0/${totalTests} accounts working.`);
        toast.error(`❌ Authentication system failure: No demo accounts are working.`);
      }
      
    } catch (error: any) {
      console.error('Login: System verification exception:', error);
      setSystemStatus('error');
      setStatusMessage('System verification failed with exception: ' + error.message);
      toast.error('Failed to run system verification: ' + error.message);
    } finally {
      setIsDebugging(false);
    }
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'healthy': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = () => {
    if (isDebugging) {
      return <RefreshCw className="inline h-4 w-4 mr-1 text-blue-600 animate-spin" />;
    }
    
    switch (systemStatus) {
      case 'healthy': return <CheckCircle className="inline h-4 w-4 mr-1 text-green-600" />;
      case 'warning': return <AlertCircle className="inline h-4 w-4 mr-1 text-yellow-600" />;
      case 'error': return <AlertCircle className="inline h-4 w-4 mr-1 text-red-600" />;
      default: return <AlertCircle className="inline h-4 w-4 mr-1 text-blue-600" />;
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

          {/* Enhanced System Status */}
          <div className={`mb-4 p-3 rounded-lg border ${getStatusColor()}`}>
            <div className="flex items-start gap-2 mb-2">
              {getStatusIcon()}
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">
                  {isDebugging ? 'Running System Verification...' : 'Authentication System Status'}
                </p>
                <p className="text-xs opacity-75">
                  {statusMessage}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSystemCheck}
              disabled={isDebugging}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isDebugging ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying System...
                </>
              ) : (
                "Run System Verification"
              )}
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
