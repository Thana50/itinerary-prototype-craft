
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";
import Login from "@/pages/Login";
import AgentDashboard from "@/pages/AgentDashboard";
import VendorDashboard from "@/pages/VendorDashboard";
import TravelerDashboard from "@/pages/TravelerDashboard";
import EnhancedClientDashboard from "@/pages/EnhancedClientDashboard";
import NegotiationRoom from "@/pages/NegotiationRoom";
import NegotiationDetail from "@/pages/NegotiationDetail";
import NotFound from "@/pages/NotFound";
import SystemOptimizationDashboard from "@/pages/SystemOptimizationDashboard";
import CreateItinerary from "@/pages/CreateItinerary";
import RateNegotiationAI from "@/pages/RateNegotiationAI";
import TemplateRepository from "@/pages/TemplateRepository";
import TemplateAnalyticsDashboard from "@/pages/TemplateAnalyticsDashboard";
import ItineraryNegotiation from "@/pages/ItineraryNegotiation";
import UnifiedItineraryDetail from "@/pages/UnifiedItineraryDetail";
import SharedItinerary from "@/pages/SharedItinerary";

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
              
              <Route 
                path="/create-itinerary" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['agent']}>
                      <CreateItinerary />
                    </RoleGuard>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/rate-negotiation" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['agent']}>
                      <RateNegotiationAI />
                    </RoleGuard>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/rate-negotiation-ai" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['agent']}>
                      <RateNegotiationAI />
                    </RoleGuard>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/template-repository" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['agent']}>
                      <TemplateRepository />
                    </RoleGuard>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/template-analytics" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['agent']}>
                      <TemplateAnalyticsDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                } 
              />
              
            <Route 
              path="/itinerary/:id" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['agent', 'traveler']}>
                    <UnifiedItineraryDetail />
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />
              
              <Route 
                path="/itinerary/:id/negotiate" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['agent']}>
                      <ItineraryNegotiation />
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

              {/* System Optimization Dashboard */}
              <Route 
                path="/system-optimization" 
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['agent']}>
                      <SystemOptimizationDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                } 
              />

              {/* Shared Itinerary Route */}
              <Route 
                path="/shared/:token" 
                element={<SharedItinerary />} 
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
              
              {/* Fallback routes */}
              <Route path="/client-portal" element={<Navigate to="/client-portal/demo" />} />
              <Route path="/analytics" element={<Navigate to="/template-analytics" />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
