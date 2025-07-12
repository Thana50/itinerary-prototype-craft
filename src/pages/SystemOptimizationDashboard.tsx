
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SystemHealthDashboard from '@/components/system-optimization/SystemHealthDashboard';
import DatabaseOptimizer from '@/components/system-optimization/DatabaseOptimizer';

const SystemOptimizationDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState("health");

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0eec4e7f-1447-475b-928f-96fbc0eca6e8.png" 
              alt="Travia Logo" 
              className="h-12 w-auto mr-4"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">System Optimization</h1>
              <p className="text-sm text-gray-600">Monitor and optimize system performance</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="health" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              System Health
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Database Optimization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health">
            <SystemHealthDashboard />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseOptimizer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemOptimizationDashboard;
