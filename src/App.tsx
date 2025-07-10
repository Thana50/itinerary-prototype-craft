
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";
import Login from "./pages/Login";
import AgentDashboard from "./pages/AgentDashboard";
import CreateItinerary from "./pages/CreateItinerary";
import UnifiedItineraryDetail from "./pages/UnifiedItineraryDetail";
import SharedItinerary from "./pages/SharedItinerary";
import TravelerDashboard from "./pages/TravelerDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import ProviderPortal from "./pages/ProviderPortal";
import PremiumProviderPortalPage from "./pages/PremiumProviderPortal";
import PremiumProviderSuccessPage from "./pages/PremiumProviderSuccess";
import RateNegotiationAI from "./pages/RateNegotiationAI";
import NegotiationRoom from "./pages/NegotiationRoom";
import NegotiationDetail from "./pages/NegotiationDetail";
import ClientAIPortal from "./pages/ClientAIPortal";
import TemplateRepository from "./pages/TemplateRepository";
import NotFound from "./pages/NotFound";
import TemplateAnalyticsDashboard from "./pages/TemplateAnalyticsDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              
              {/* Agent Routes */}
              <Route path="/agent-dashboard" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['agent']}>
                    <AgentDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/create-itinerary" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['agent']}>
                    <CreateItinerary />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/rate-negotiation" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['agent']}>
                    <RateNegotiationAI />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/template-repository" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['agent']}>
                    <TemplateRepository />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/template-analytics" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['agent']}>
                    <TemplateAnalyticsDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              
              {/* Traveler Routes */}
              <Route path="/traveler-dashboard" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['traveler']}>
                    <TravelerDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              
              {/* Vendor Routes */}
              <Route path="/vendor-dashboard" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['vendor']}>
                    <VendorDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              
              {/* Unified Itinerary Detail Route - replaces old /itinerary/:id */}
              <Route path="/itinerary/:id" element={
                <ProtectedRoute>
                  <UnifiedItineraryDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/negotiation-room/:id" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['agent', 'vendor']}>
                    <NegotiationRoom />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/negotiation/:id" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['agent', 'vendor']}>
                    <NegotiationDetail />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              
              {/* Public Routes */}
              <Route path="/shared/:id" element={<SharedItinerary />} />
              <Route path="/provider-portal/:id" element={<ProviderPortal />} />
              <Route path="/premium-provider-portal/:id" element={<PremiumProviderPortalPage />} />
              <Route path="/premium-provider-portal/success" element={<PremiumProviderSuccessPage />} />
              <Route path="/client-portal/:id" element={<ClientAIPortal />} />
              
              {/* Fallback routes for navigation edge cases */}
              <Route path="/client-portal" element={<Navigate to="/client-portal/demo" />} />
              <Route path="/analytics" element={<Navigate to="/template-analytics" />} />
              <Route path="/templates" element={<Navigate to="/template-repository" />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
