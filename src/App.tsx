import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleGuard from "@/components/auth/RoleGuard";
import Login from "@/pages/Login";
import AgentDashboard from "@/pages/AgentDashboard";
import VendorDashboard from "@/pages/VendorDashboard";
import TravelerDashboard from "@/pages/TravelerDashboard";
import EnhancedClientDashboard from "@/pages/EnhancedClientDashboard";
import NegotiationRoom from "@/pages/NegotiationRoom";
import NegotiationDetail from "@/pages/NegotiationDetail";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/" element={<Login />} />
              
              {/* Agent Routes */}
              <Route 
                path="/agent-dashboard" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['agent']}>
                      <AgentDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                } 
              />
              
              {/* Vendor Routes */}
              <Route 
                path="/vendor-dashboard" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['vendor']}>
                      <VendorDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                } 
              />
              
              {/* Client/Traveler Routes */}
              <Route 
                path="/traveler-dashboard" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['traveler']}>
                      <TravelerDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                } 
              />
              
              {/* Enhanced Client Dashboard */}
              <Route 
                path="/client-dashboard" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['traveler']}>
                      <EnhancedClientDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                } 
              />

              {/* Negotiation Routes */}
              <Route 
                path="/negotiation-room/:id" 
                element={
                  <ProtectedRoute>
                    <NegotiationRoom />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/negotiation/:id" 
                element={
                  <ProtectedRoute>
                    <NegotiationDetail />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
