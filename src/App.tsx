
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useMemo } from "react";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Import our new pages
import AgentDashboard from "./pages/AgentDashboard";
import TravelerDashboard from "./pages/TravelerDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import ItineraryDetail from "./pages/ItineraryDetail";
import NegotiationDetail from "./pages/NegotiationDetail";
import CreateItinerary from "./pages/CreateItinerary";
import SharedItinerary from "./pages/SharedItinerary";
import NegotiationRoom from "./pages/NegotiationRoom";
import ClientAIPortal from "./pages/ClientAIPortal";
import RateNegotiationAI from "./pages/RateNegotiationAI";
import ProviderPortal from "./pages/ProviderPortal";

const App = () => {
  // Create QueryClient inside component to ensure proper React context
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
      },
    },
  }), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
            <Route path="/traveler-dashboard" element={<TravelerDashboard />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/client-portal" element={<ClientAIPortal />} />
            <Route path="/rate-negotiation" element={<RateNegotiationAI />} />
            <Route path="/provider-portal/:id" element={<ProviderPortal />} />
            <Route path="/itinerary/:id" element={<ItineraryDetail />} />
            <Route path="/itinerary/shared/:token" element={<SharedItinerary />} />
            <Route path="/negotiation/:id" element={<NegotiationDetail />} />
            <Route path="/negotiation/room/:id" element={<NegotiationRoom />} />
            <Route path="/create-itinerary" element={<CreateItinerary />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
